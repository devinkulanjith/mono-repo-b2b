import { UserInputError } from '@vtex/api'

import {
  getAssignedSoldToAccounts,
  setSoldToAccountInOrderForm,
} from '../modules/soldToAccounts'
import { updateSimulationInfoInSession } from '../modules/session'
import type { OrgAccount } from '../typings/vtexShipping'

type GetOrderSoldToAccountArgs = {
  orderFormId?: string
}

export const setSoldToAccount = async (
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

  const assignedSoldToAccountsForUser = await getAssignedSoldToAccounts(
    { pageSize: 200, page: 1 },
    ctx
  )

  // const userLastOrder = await ctx.clients.oms.userLastOrder()

  // eslint-disable-next-line no-console,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const customeDataFields = (userLastOrder?.customData?.customApps ?? []).find(
  //   (data: any) => data.id === 'checkout-simulation'
  // )?.fields

  // const prevOrderSoldToAccountNumber = customeDataFields.soldToCustomerNumber

  const existingSoldToAccounts = (
    assignedSoldToAccountsForUser?.data ?? []
  ).filter(sa => sa.accountExists)

  const hasMultipleAccounts = existingSoldToAccounts.length > 1

  let soldToAccountSet = false

  let selectedSoldTo: OrgAccount | null = null

  if (!soldToAccount) {
    if (existingSoldToAccounts.length === 1 && !hasMultipleAccounts) {
      const firstSoldTo = existingSoldToAccounts.find(s => s) as OrgAccount

      selectedSoldTo = firstSoldTo

      await setSoldToAccountInOrderForm(firstSoldTo!.id ?? '', ctx, orderFormId)
      const {
        clients: { session: sessionClient },
        vtex: { storeUserSessionToken },
      } = ctx

      await updateSimulationInfoInSession(
        sessionClient,
        firstSoldTo!,
        storeUserSessionToken
      )
      soldToAccountSet = true
      // return false
    }

    // if (assignedSoldToAccountsForUser.data.length > 1) {
    //   await setSoldToAccountInOrderForm(
    //     prevOrderSoldToAccountNumber,
    //     ctx,
    //     orderFormId
    //   )

    //   return true
    // }
  }

  return {
    hasMultipleSoldToAccounts: hasMultipleAccounts,
    soldToAccountSet,
    selectedSoldTo,
  }
}
