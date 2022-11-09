import { UserInputError } from '@vtex/api'

import { getOrderFormIdFromCookie } from '../../utils'
import { getSessionTokenFromCookie } from '../../utils/session'

export async function validateRemoveCustomData(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  console.info('Received params:', params)

  const {
    appId,
    fieldName,
    orderFormId = getOrderFormIdFromCookie(ctx.cookies),
  } = params

  if (!appId) {
    throw new UserInputError('App is required')
  }

  if (!fieldName) {
    throw new UserInputError('Field is required')
  }

  if (!orderFormId) {
    throw new UserInputError('Order form ID is required')
  }

  ctx.state.appId = appId as string
  ctx.state.fieldName = fieldName as string
  ctx.state.orderFormId = orderFormId as string

  await next()
}

export async function validateOrderFormIdExistence(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { orderFormId = getOrderFormIdFromCookie(ctx.cookies) } = params

  if (!orderFormId) {
    throw new UserInputError('Order form ID is required')
  }

  ctx.state.orderFormId = orderFormId as string

  await next()
}

export async function validateSessionTokenExistence(
  ctx: Context,
  next: () => Promise<any>
) {
  const sessionToken = getSessionTokenFromCookie(ctx.cookies)

  if (!sessionToken) {
    throw new UserInputError('Session token not found')
  }

  ctx.state.storeUserSessionToken = sessionToken

  await next()
}
