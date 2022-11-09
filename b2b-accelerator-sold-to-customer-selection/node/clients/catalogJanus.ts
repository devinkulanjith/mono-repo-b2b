import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export class CatalogJanusClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...(ctx.authToken
          ? {
              VtexIdclientAutCookie: ctx.authToken,
            }
          : {}),
      },
    })
  }

  public salesChannelAvailable = () =>
    this.http.get<SalesChannelAvailable[]>(
      `/api/catalog_system/pvt/saleschannel/list`,
      {
        metric: 'simulation-catalog-sales-channel-all',
      }
    )
}
