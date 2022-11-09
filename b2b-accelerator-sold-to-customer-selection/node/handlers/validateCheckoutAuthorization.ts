import { ForbiddenError } from '@vtex/api'

import { AUTHORIZATION_CODE } from '../utils/constants'

export async function validateCheckoutAuthorization(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    headers: { authorization },
  } = ctx

  console.log('Authorization', authorization)

  if (!authorization || authorization !== AUTHORIZATION_CODE) {
    throw new ForbiddenError('Authorization token does not match')
  }

  await next()
}
