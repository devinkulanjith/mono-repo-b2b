import { AuthenticationError, UserInputError } from '@vtex/api'

import { getSessionTokenFromCookie } from '../utils/session'
import { getOrderFormIdFromCookie } from '../utils'

export async function validateAuth(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { session: sessionClient, checkout: checkoutClient },
    cookies,
  } = ctx

  const sessionToken = getSessionTokenFromCookie(ctx.cookies)
  const orderFormId = getOrderFormIdFromCookie(cookies)

  if (!orderFormId) {
    throw new UserInputError('Order form ID not found!')
  }

  const orderForm = await checkoutClient.orderForm(orderFormId)

  const sessionResponse = await sessionClient.getSession(sessionToken ?? '', [
    'authentication.storeUserEmail',
    'authentication.storeUserId',
    'impersonate.storeUserEmail',
    'impersonate.storeUserId',
  ])

  const loggedInUserEmail =
    sessionResponse.sessionData.namespaces.impersonate?.storeUserEmail?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserEmail
      ?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserEmail?.value

  if (!loggedInUserEmail || loggedInUserEmail.length === 0) {
    throw new AuthenticationError('Not authenticated!')
  }

  const loggedInUserId =
    sessionResponse.sessionData.namespaces.impersonate?.storeUserId?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserId?.value

  if (loggedInUserId && loggedInUserId !== orderForm.userProfileId) {
    // throw new AuthenticationError('Operation not allowed for user!')
    // ctx.response.set(
    //   'Set-Cookie',
    //   serialize(`VtexIdclientAutCookie_${ctx.vtex.account}`, '', {
    //     path: '/',
    //     maxAge: 0,
    //   })
    // )
    // ctx.redirect(
    //   `/api/vtexid/pub/logout?scope=${ctx.vtex.account}&returnUrl=/checkout`
    // )
    // throw new UserInputError({
    //   code: 400,
    //   message: 'Forbidden',
    //   response: {
    //     data: {
    //       logoutUrl: `/api/vtexid/pub/logout?scope=${ctx.vtex.account}&returnUrl=/checkout`,
    //     },
    //   },
    // })

    await checkoutClient.updateOrderFormShipping(orderFormId, {
      address: null,
      selectedAddresses: [],
    })

    await checkoutClient.removeAllItems(orderFormId)

    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'soldTo'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'soldToCustomerNumber'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'soldToInfo'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'shipTo'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'shipToCustomerNumber'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'shipToInfo'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'simulationData'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'simulationCompletedAt'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'targetSystem'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'clientEmail'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'poNumber'
    )
    await checkoutClient.removeOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'requestedDeliveryDate'
    )
  }

  await next()
}
