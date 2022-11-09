import { UserInputError } from '@vtex/api'

import { getOrderFormIdFromCookie } from '../utils'

export async function validateSimulation(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: {
      route: { params },
    },
    query,
  } = ctx

  const { orderFormId = getOrderFormIdFromCookie(ctx.cookies) } = params
  const { isSandboxMode, sandboxResponseType, refreshOutdatedData } = query

  if (!orderFormId) {
    throw new UserInputError('orderFormId not found') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }

  ctx.state.orderFormId = orderFormId as string
  ctx.state.isSandboxMode = !!(isSandboxMode as string)
  ctx.state.refreshOutdatedData = !!(refreshOutdatedData as string)
  ctx.state.sandboxResponseType = sandboxResponseType

  await next()
}
