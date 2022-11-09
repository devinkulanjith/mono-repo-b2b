import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'
import axios from 'axios'

export class Catalog extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/`,
      context,
      options
    )
  }

  public inventoryBySkuId = async (id: string | number) => {
    const res = await axios.get(
      `http://${this.context.account}.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          VtexIdclientAutCookie: `${this.context.authToken}`,
        },
      }
    )

    let result: any = []

    if (res.status === 200) {
      result = res.data.balance
    }

    // console.log("ress : ", res)
    return result
  }
}
