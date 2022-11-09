import { UserInputError } from '@vtex/api'

import type { OrderForm } from '../../typings/orderForm'
import type { CL, OrgAccount } from '../../typings/vtexShipping'
import type { SandboxResponseType } from '../../typings/common'
import type { JdeOrderRequest } from '../../typings/jde'
import { dateToJdeFormat } from '../../utils/dateTime'
import { isPunchoutSession } from '../../modules/soldToAccounts'

export const parseVtexToJde = (
  orderForm: OrderForm,
  soldToAccount: OrgAccount,
  shipToAccount: OrgAccount,
  clUser: Omit<CL, 'userId'>,
  sandboxResponseType?: SandboxResponseType
): JdeOrderRequest => {
  const appData = orderForm.customData?.customApps.find(
    app => app.id === 'checkout-simulation'
  )

  if (!appData) {
    throw new UserInputError('Customer information invalid!')
  }

  return {
    // plant: 'string',
    soldToCustomerNumber: soldToAccount.customerNumber,
    shipToCustomerNumber: shipToAccount.customerNumber,
    // OrderId: orderForm.orderFormId,
    customerPO: !isPunchoutSession(orderForm)
      ? appData.fields.poNumber
      : '12345',
    Business_Unit: '2100',
    CreatedBy: clUser.email,
    requestedDeliveryDate: dateToJdeFormat(
      new Date(appData.fields.requiredDeliveryDate)
    ),
    P4210_Version: 'E000001VTX',
    CreateOrder: '0',
    // currency: orderForm.storePreferencesData.currencyCode,
    sandboxExpectedResponseType: sandboxResponseType,
    item: orderForm.items.map((item, index) => {
      const certificate = JSON.parse(appData.fields.itemMetadata).find(
        (metadataItem: any) => item.uniqueId === metadataItem.uniqueId
      )?.sapcert

      return {
        itemLine: (index + 1).toString(),
        ProductRefId: item.refId,
        quantity: (item.quantity * item.unitMultiplier).toString(),
        baseUnitOfMeasure:
          JSON.parse(appData.fields.itemMetadata).find(
            (metadataItem: any) => item.uniqueId === metadataItem.uniqueId
          )?.unitOfMeasure ?? 'EA',
        ...(certificate ? { sapcert: certificate } : {}),
      }
    }),
  }
}
