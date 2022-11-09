import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export class Search extends ExternalClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super(`http://${ctx.account}.vtexcommercestable.com.br/`, ctx, opts)
  }

  public inventoryBySku = async (skuId: string | undefined) => {
    const url = `http://${this.context.account}.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${skuId}`

    const res = await this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${this.context.authToken}`,
      },
    })

    let result: any = []

    if (res.status === 200) {
      result = res.data.balance
    }

    return result
  }
}
