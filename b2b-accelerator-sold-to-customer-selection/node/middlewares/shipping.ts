import type { OrgAccount } from '../typings/vtexShipping'
import {
  getAssignedSoldToAccounts,
  getShipToAccountsForSoldTo,
} from '../modules/soldToAccounts'
import { acronymSalesAccount } from '../utils/masterdata'

export async function orgAccount(ctx: Context, next: () => Promise<any>) {
  const soldToAcc = await ctx.clients.masterdata.getDocument<OrgAccount>({
    dataEntity: acronymSalesAccount,
    id: ctx.state.orgAccountId,
    fields: [
      'id',
      'corporateName',
      'postalCode',
      'street',
      'city',
      'state',
      'country',
      'receiverName',
      'customerNumber',
    ],
  })

  ctx.status = 200
  ctx.body = soldToAcc
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}

export async function soldToAccounts(ctx: Context, next: () => Promise<any>) {
  const userSalesAccounts = await getAssignedSoldToAccounts(
    { page: 1, pageSize: 100 },
    ctx
  )

  ctx.status = 200
  ctx.body = userSalesAccounts
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}

export async function shipToAccounts(ctx: Context, next: () => Promise<any>) {
  const {
    state: { soldTo },
  } = ctx

  const shippingAccounts = await getShipToAccountsForSoldTo(
    soldTo,
    ctx.clients.masterdata
  )

  ctx.status = 200
  ctx.body = shippingAccounts
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}
