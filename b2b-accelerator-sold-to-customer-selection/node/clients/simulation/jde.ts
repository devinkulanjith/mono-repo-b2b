import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { JdeOrderRequest, JdeOrderResponse } from '../../typings/jde'
import {
  mockJdeGlobalError,
  mockJdeLineItemError,
  mockJdeLineItemWarning,
  mockJdeSuccess,
} from './mockJde'
import type { SimulateResponse } from '../../typings/common'
import { parseJdeToVtex } from '../../parsers/jde/jdeToVtex'
import type { OrderForm } from '../../typings/orderForm'

const TIMEOUT_LONG = 60000

export class JdeClient extends ExternalClient {
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
    jdeOrderRequest: JdeOrderRequest,
    orderForm: OrderForm
  ): Promise<SimulateResponse> => {
    if (!jdeOrderRequest.sandboxExpectedResponseType) {
      return this.http
        .postRaw<JdeOrderResponse>(
          'smartOrder/VTEX/v1/order/simulate?erpid=JDE',
          jdeOrderRequest,
          {
            metric: 'jde-order-simulate',
          }
        )
        .then(res => parseJdeToVtex(res.data, orderForm))
    }

    switch (jdeOrderRequest.sandboxExpectedResponseType) {
      case 'success':
        return new Promise<SimulateResponse>(resolve => {
          setTimeout(
            () =>
              resolve(
                parseJdeToVtex(
                  {
                    ...mockJdeSuccess,
                    items: jdeOrderRequest.item.map((_item, index) => {
                      const mockItem = mockJdeSuccess.items!.find(
                        mi => parseInt(mi.itemLine, 10) - 1 === index
                      )

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
                parseJdeToVtex(
                  {
                    ...mockJdeGlobalError,
                    items: jdeOrderRequest.item.map((_item, index) => {
                      const mockItem = mockJdeGlobalError.items!.find(
                        mi => parseInt(mi.itemLine, 10) - 1 === index
                      )

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
                parseJdeToVtex(
                  {
                    ...mockJdeLineItemError,
                    items: jdeOrderRequest.item.map((_item, index) => {
                      const mockItem = mockJdeLineItemError.items!.find(
                        mi => parseInt(mi.itemLine, 10) - 1 === index
                      )

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
                parseJdeToVtex(
                  {
                    ...mockJdeLineItemWarning,
                    items: jdeOrderRequest.item.map((_item, index) => {
                      const mockItem = mockJdeLineItemWarning.items!.find(
                        mi => parseInt(mi.itemLine, 10) - 1 === index
                      )

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
                parseJdeToVtex(
                  {
                    ...mockJdeGlobalError,
                    items: jdeOrderRequest.item.map((_item, index) => {
                      const mockItem = mockJdeGlobalError.items!.find(
                        mi => parseInt(mi.itemLine, 10) - 1 === index
                      )

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
