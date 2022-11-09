import { UserInputError } from '@vtex/api'

import type { SearchArgs } from '../modules/soldToAccounts'
import {
  getAssignedSoldToAccounts,
  setSoldToAccountInOrderForm,
} from '../modules/soldToAccounts'
import { invalidateSimulationData } from '../modules/orderForm'
import { updateSimulationInfoInSession } from '../modules/session'

type GetOrderSoldToAccountArgs = {
  orderFormId?: string
}

type InvalidateSimulation = GetOrderSoldToAccountArgs

type SetOrderSoldToAccountArgs = {
  orderFormId?: string
  soldToAccount: string
}

export const assignedSoldToAccounts = async (
  _: any,
  { pageSize, page, sort, where }: SearchArgs,
  ctx: Context
) => getAssignedSoldToAccounts({ pageSize, page, sort, where }, ctx)

export const invalidateSimulation = async (
  _: any,
  args: InvalidateSimulation,
  ctx: Context
) => {
  const {
    clients: { checkout: checkoutClient },
    vtex,
  } = ctx

  const { orderFormId = vtex.orderFormId } = args

  if (!orderFormId) {
    throw new UserInputError('Order form ID not found!')
  }

  // await emptyCart(checkoutClient, orderFormId)

  return invalidateSimulationData(checkoutClient, orderFormId)
}

export const getOrderSoldToAccount = async (
  _: any,
  args: GetOrderSoldToAccountArgs,
  ctx: Context
) => {
  const {
    clients: { checkout: checkoutClient },
    vtex,
  } = ctx

  const { orderFormId = vtex.orderFormId } = args

  if (!orderFormId) {
    throw new UserInputError('Order form ID not found!')
  }

  const response = await checkoutClient.orderForm(orderFormId)
  const soldToAccount = (response.customData?.customApps ?? []).find(
    app => app.id === 'checkout-simulation'
  )?.fields.soldToCustomerNumber

  // if (!soldToAccount) {
  //   if (!storeUserSessionToken) {
  //     throw new AuthenticationError('Session token not found!')
  //   }
  //
  //   const sessionValue = await sessionClient.getSession(storeUserSessionToken, [
  //     'public.checkoutSimulation.soldToAccount',
  //   ])
  //
  //   soldToAccount =
  //     sessionValue.sessionData.namespaces.public[
  //       'checkoutSimulation.soldToAccount'
  //     ]?.value
  //
  //   if (!soldToAccount) {
  //     throw new UserInputError('No sold to account selected')
  //   }
  //
  //   await setSoldToAccountInOrderForm(soldToAccount, ctx, orderFormId)
  // }

  const assignedSoldToAccountsForUser = await getAssignedSoldToAccounts(
    { pageSize: 200, page: 1 },
    ctx
  )

  return assignedSoldToAccountsForUser.data.find(
    sa => soldToAccount && sa?.id === soldToAccount
  )
}

export const setOrderSoldToAccount = async (
  _: any,
  args: SetOrderSoldToAccountArgs,
  ctx: Context
) => {
  const { orderFormId = ctx.vtex.orderFormId } = args

  const soldTo = await setSoldToAccountInOrderForm(
    args.soldToAccount,
    ctx,
    orderFormId
  )

  const {
    clients: { session: sessionClient },
    vtex: { storeUserSessionToken },
  } = ctx

  await updateSimulationInfoInSession(
    sessionClient,
    soldTo,
    storeUserSessionToken
  )

  return true
}
