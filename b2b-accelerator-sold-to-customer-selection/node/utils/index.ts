import { AuthenticationError, ForbiddenError, UserInputError } from '@vtex/api'
import type { AxiosError } from 'axios'

export function statusToError(e: any) {
  if (!e.response) {
    throw e
  }

  const { response } = e as AxiosError
  const { status } = response!

  if (status === 401) {
    throw new AuthenticationError(e)
  }

  if (status === 403) {
    throw new ForbiddenError(e)
  }

  if (status === 400) {
    throw new UserInputError(e)
  }

  throw e
}

/** Checkout cookie methods */
export const CHECKOUT_COOKIE = 'checkout.vtex.com'

export function checkoutCookieFormat(orderFormId: string) {
  return `${CHECKOUT_COOKIE}=__ofid=${orderFormId};`
}

export function getOrderFormIdFromCookie(cookies: Context['cookies']) {
  const cookie = cookies.get(CHECKOUT_COOKIE)

  return cookie?.split('=')[1]
}
