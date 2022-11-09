import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

import type { OrderForm } from '../typings/orderForm'

export async function validatePunchoutData(
  ctx: Context,
  next: () => Promise<any>
) {
  const payload: OrderForm = await json(ctx.req)

  if (!payload) {
    throw new UserInputError('Data not found')
  }

  ctx.state.punchoutOrderValidationRequest = payload

  await next()
}
