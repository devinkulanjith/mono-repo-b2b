import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { ParsedVtexCheckoutTaxRequest } from '../typings/common'

export class TaxProvider extends ExternalClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    // The first argument is the base URl of your provider API endpoint
    super('baseURL', ctx, options)
  }

  public getTaxInformation(
    parsedCheckoutRequest: ParsedVtexCheckoutTaxRequest
  ) {
    return (parsedCheckoutRequest?.items ?? []).map(ofItem => {
      const simulatedItem = (
        parsedCheckoutRequest.simulationData?.items ?? []
      ).find(sItem => parseInt(ofItem.id, 10) === sItem.itemLine)

      return {
        id: ofItem.id,
        taxes: [
          {
            name: 'Regular',
            value: simulatedItem?.tax ?? 0,
          },
          {
            name: 'Shipping',
            value: (simulatedItem?.shippingCost ?? 0) / 100,
          },
        ],
      }
    })
  }
}
