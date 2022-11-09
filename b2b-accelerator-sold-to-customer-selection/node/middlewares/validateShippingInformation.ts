import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

import { getOrderFormIdFromCookie } from '../utils'
import type { OrgAccount } from '../typings/vtexShipping'
import { acronymSalesAccount } from '../utils/masterdata'

export async function validate(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)

  const { soldTo, shipTo, poNumber, requiredDeliveryDate } = body

  if (!soldTo && !shipTo && !poNumber && !requiredDeliveryDate) {
    throw new UserInputError('Input is invalid')
  }

  let shipToAcc: OrgAccount | undefined

  if (shipTo && shipTo.length > 0) {
    const shipToAccountResponse =
      await ctx.clients.masterdata.searchDocumentsWithPaginationInfo<OrgAccount>(
        {
          dataEntity: acronymSalesAccount,
          fields: [
            'id',
            'corporateName',
            'customerNumber',
            'city',
            'country',
            'neighborhood',
            'postalCode',
            'receiverName',
            'state',
            'street',
          ],
          pagination: {
            page: 1,
            pageSize: 1000,
          },
          where: `(id=${shipTo} AND isShipTo=1)`,
        }
      )

    shipToAcc = shipToAccountResponse.data.find(({ id }) => id)
  }

  if (!shipToAcc) {
    throw new UserInputError('Ship to account not found!')
  }

  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { orderFormId = getOrderFormIdFromCookie(ctx.cookies) } = params

  if (!orderFormId) {
    throw new UserInputError('Order form ID is required')
  }

  ctx.state.shipTo = shipToAcc.id
  ctx.state.shipToCustomerNumber = shipToAcc.customerNumber
  ctx.state.shipToAccount = shipToAcc
  ctx.state.poNumber = poNumber
  ctx.state.requiredDeliveryDate = requiredDeliveryDate
  ctx.state.orderFormId = orderFormId as string

  await next()
}
