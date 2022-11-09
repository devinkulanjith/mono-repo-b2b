import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type {
  SapItemResponse,
  SapOrderRequest,
  SapOrderResponse,
} from '../../typings/sap'
import {
  mockSapGlobalError,
  mockSapLineItemError,
  mockSapLineItemWarning,
  mockSapSuccess,
} from './mockSap'
import type { SimulateResponse } from '../../typings/common'
import { parseSapToVtex } from '../../parsers/sap/sapToVtex'
import type { OrderForm } from '../../typings/orderForm'

const TIMEOUT_LONG = 60000

export class SapClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account === 'sbdsefprod' ? 'api' : 'u-api'}.sbdinc.com`,
      context,
      {
        ...options,
        timeout: TIMEOUT_LONG,
        headers: {
          ...options?.headers,
          'X-Vtex-Use-Https': 'true',
          'Agora-Subscription-Key':
            context.account === 'sbdsefprod'
              ? 'a77fb0db4f55488d9b197e15dcece444'
              : '5f4ff2be6b174993af90351fa5cd23e7',
        },
      }
    )
  }

  public simulate = (
    sapOrderRequest: SapOrderRequest,
    orderForm: OrderForm,
    ctx: Context
  ): Promise<SimulateResponse> => {
    if (!sapOrderRequest.sandboxExpectedResponseType) {
      return this.http
        .postRaw<SapOrderResponse>(
          'smartOrder/VTEX/v1/order/simulate?erpid=SHP',
          sapOrderRequest,
          {
            metric: 'sap-order-simulate',
          }
        )
        .then(res => parseSapToVtex(res.data, orderForm, this.context.logger))
        .catch(async res => {
          await ctx.clients.masterdata.createDocument({
            dataEntity: 'SAPSimulationErrorLog',
            fields: { response: res.response.data },
          })

          return parseSapToVtex(
            res.response.data,
            orderForm,
            this.context.logger
          )
        })
    }

    switch (sapOrderRequest.sandboxExpectedResponseType) {
      case 'success':
        return new Promise<SimulateResponse>(resolve => {
          setTimeout(
            () =>
              resolve(
                parseSapToVtex(
                  {
                    ...mockSapSuccess,
                    currency: sapOrderRequest.currency,
                    soldToCustomerNumber: sapOrderRequest.soldToCustomerNumber,
                    shipToCustomerNumber: sapOrderRequest.shipToCustomerNumber,
                    customerPO: sapOrderRequest.customerPO,
                    items: sapOrderRequest.items.map(item => {
                      const mockItem = (
                        mockSapSuccess.items as SapItemResponse[]
                      ).find(mi => parseInt(mi.itemLine, 10) === item.itemLine)

                      return {
                        ...mockItem!,
                      }
                    }),
                  },
                  orderForm
                )
              ),
            1000
          )
        })

      case 'global':
        return new Promise<SimulateResponse>(resolve => {
          setTimeout(
            () =>
              resolve(
                parseSapToVtex(
                  {
                    ...mockSapGlobalError,
                    currency: sapOrderRequest.currency,
                    soldToCustomerNumber: sapOrderRequest.soldToCustomerNumber,
                    shipToCustomerNumber: sapOrderRequest.shipToCustomerNumber,
                    customerPO: sapOrderRequest.customerPO,
                    items: sapOrderRequest.items.map(item => {
                      const mockItem = (
                        mockSapGlobalError.items as SapItemResponse[]
                      ).find(mi => parseInt(mi.itemLine, 10) === item.itemLine)

                      return {
                        ...mockItem!,
                      }
                    }),
                  },
                  orderForm
                )
              ),
            1000
          )
        })

      case 'lineItemError':
        return new Promise<SimulateResponse>(resolve => {
          setTimeout(
            () =>
              resolve(
                parseSapToVtex(
                  {
                    ...mockSapLineItemError,
                    currency: sapOrderRequest.currency,
                    soldToCustomerNumber: sapOrderRequest.soldToCustomerNumber,
                    shipToCustomerNumber: sapOrderRequest.shipToCustomerNumber,
                    customerPO: sapOrderRequest.customerPO,
                    items: sapOrderRequest.items.map(item => {
                      const mockItem = (
                        mockSapLineItemError.items as SapItemResponse[]
                      ).find(mi => parseInt(mi.itemLine, 10) === item.itemLine)

                      return {
                        ...mockItem!,
                      }
                    }),
                  },
                  orderForm
                )
              ),
            1000
          )
        })

      case 'lineItemWarning':
        return new Promise<SimulateResponse>(resolve => {
          setTimeout(
            () =>
              resolve(
                parseSapToVtex(
                  {
                    ...mockSapLineItemWarning,
                    currency: sapOrderRequest.currency,
                    soldToCustomerNumber: sapOrderRequest.soldToCustomerNumber,
                    shipToCustomerNumber: sapOrderRequest.shipToCustomerNumber,
                    customerPO: sapOrderRequest.customerPO,
                    items: sapOrderRequest.items.map(item => {
                      const mockItem = (
                        mockSapLineItemWarning.items as SapItemResponse[]
                      ).find(mi => parseInt(mi.itemLine, 10) === item.itemLine)

                      return {
                        ...mockItem!,
                      }
                    }),
                  },
                  orderForm
                )
              ),
            1000
          )
        })

      default:
        return new Promise<SimulateResponse>(resolve => {
          setTimeout(
            () =>
              resolve(
                parseSapToVtex(
                  {
                    ...mockSapGlobalError,
                    currency: sapOrderRequest.currency,
                    soldToCustomerNumber: sapOrderRequest.soldToCustomerNumber,
                    shipToCustomerNumber: sapOrderRequest.shipToCustomerNumber,
                    customerPO: sapOrderRequest.customerPO,
                    items: sapOrderRequest.items.map(item => {
                      const mockItem = (
                        mockSapGlobalError.items as SapItemResponse[]
                      ).find(mi => parseInt(mi.itemLine, 10) === item.itemLine)

                      return {
                        ...mockItem!,
                      }
                    }),
                  },
                  orderForm
                )
              ),
            1000
          )
        })
    }
  }
}
