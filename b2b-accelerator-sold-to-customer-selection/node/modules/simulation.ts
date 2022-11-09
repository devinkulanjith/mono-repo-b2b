import { UserInputError } from '@vtex/api'

import type { OrderForm } from '../typings/orderForm'
import type { CL, OrgAccount } from '../typings/vtexShipping'
import { acronymSalesAccount } from '../utils/masterdata'
import type { SandboxResponseType, SimulateResponse } from '../typings/common'
import { parseVtexToSap } from '../parsers/sap/vtexToSap'
import { parseVtexToJde } from '../parsers/jde/vtexToJde'

type AppSettings = {
  currencySalesChannelMap: string
}

type CurrencySalesChannelMap = {
  currency: string
  salesChannel: string
}

export const performSimulation = async (
  clUser: Omit<CL, 'userId'>,
  orderForm: OrderForm,
  ctx: Context,
  sandboxResponseType?: SandboxResponseType
) => {
  const {
    clients: {
      masterdata: mdClient,
      sap: sapClient,
      jde: jdeClient,
      apps: appClient,
    },
    vtex: { logger },
  } = ctx

  const appData = orderForm.customData?.customApps.find(
    app => app.id === 'checkout-simulation'
  )

  if (!appData) {
    throw new UserInputError('Customer information invalid!')
  }

  const soldToAccount = await mdClient.getDocument<OrgAccount>({
    dataEntity: acronymSalesAccount,
    fields: [
      'targetSystem',
      'customerNumber',
      'salesOrganizationCode',
      'partnerRole',
    ],
    id: appData.fields.soldToCustomerNumber,
  })

  if (!soldToAccount) {
    throw new UserInputError('Sold to account not found!')
  }

  const shipToAccount = await mdClient.getDocument<OrgAccount>({
    dataEntity: acronymSalesAccount,
    fields: ['customerNumber', 'partnerRole'],
    id: appData.fields.shipToCustomerNumber,
  })

  if (!shipToAccount) {
    throw new UserInputError('Ship to account not found!')
  }

  let simulationResponse: SimulateResponse | null = null
  let simulationRequest: unknown = null

  try {
    if (soldToAccount.targetSystem === 'SAP') {
      const sapRequest = parseVtexToSap(
        orderForm,
        soldToAccount,
        shipToAccount,
        clUser,
        sandboxResponseType
      )

      logger.debug({ sapRequest })
      simulationRequest = sapRequest
      simulationResponse = await sapClient.simulate(sapRequest, orderForm, ctx)
    } else if (soldToAccount.targetSystem === 'JDE') {
      const jdeRequest = parseVtexToJde(
        orderForm,
        soldToAccount,
        shipToAccount,
        clUser,
        sandboxResponseType
      )

      simulationRequest = jdeRequest
      logger.debug({ jdeRequest })
      simulationResponse = await jdeClient.simulate(jdeRequest, orderForm)
    }

    logger.debug({ simulationResponse })

    if (
      !simulationResponse ||
      !simulationResponse.items ||
      ((simulationResponse.globalErrors ?? []).length === 0 &&
        simulationResponse.items.length === 0)
    ) {
      throw new UserInputError('Simulation response did not return any item!')
    }
  } catch (e) {
    logger.info('-------------Error from simulation------------')
    logger.info(simulationResponse)
    await mdClient.createDocument({
      dataEntity: 'SimulationLog',
      fields: { simulationRequest, simulationResponse },
    })
    throw e
  }

  const settings: AppSettings = await appClient.getAppSettings(
    process.env.VTEX_APP_ID ?? ''
  )

  // TODO: The default sales channel is 1 with currency USD
  const currencyScMap: CurrencySalesChannelMap[] = (
    settings.currencySalesChannelMap ?? 'USD,1'
  )
    .split('|')
    .map((cs: string) => {
      const [currency, salesChannel] = cs.split(',')

      return {
        currency,
        salesChannel,
      }
    })
    .filter(cs => cs)

  // TODO: The default sales channel is 1 with currency USD
  const newSalesChannel =
    currencyScMap.find(cs => cs.currency === simulationResponse?.currency)
      ?.salesChannel ?? '1'

  if (!newSalesChannel) {
    throw new UserInputError('Currency not supported!')
  }

  return { simulationResponse, newSalesChannel }
}
