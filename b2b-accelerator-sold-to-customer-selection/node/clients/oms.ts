import type { InstanceOptions, IOContext, RequestConfig } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import { statusToError } from '../utils'

export class OMS extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...(options && options.headers),
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
      },
    })
  }

  public userLastOrder = () =>
    this.get(this.routes.lastOrder, {
      ...this.options,
      metric: 'oms-userLastOrder',
    })

  public order = (id: string) =>
    this.get(this.routes.order(id), {
      ...this.options,
      metric: 'oms-order',
      headers: {
        ...this.options?.headers,
        VtexIdclientAutCookie: this.context.authToken,
      },
    })

  protected get = <T>(url: string, config: RequestConfig = {}) => {
    const { segmentToken, sessionToken } = this.context as CustomIOContext
    const segmentTokenCookie = segmentToken
      ? `vtex_segment=${segmentToken};`
      : ''

    const sessionTokenCookie = sessionToken
      ? `vtex_session=${sessionToken};`
      : ''

    config.headers = {
      ...config.headers,
      Cookie: `${segmentTokenCookie}${sessionTokenCookie}`,
    }

    return this.http.get<T>(url, config).catch(statusToError)
  }

  private get routes() {
    const base = '/api/oms'

    return {
      lastOrder: `${base}/user/orders/last`,
      order: (id: string) => `${base}/pvt/orders/${id}`,
    }
  }
}
