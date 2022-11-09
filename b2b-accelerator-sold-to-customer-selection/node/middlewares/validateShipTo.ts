import { UserInputError } from '@vtex/api'

export async function validateShipTo(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { soldTo } = params

  if (!soldTo) {
    throw new UserInputError('Sold to account ID is required')
  }

  ctx.state.soldTo = soldTo as string

  await next()
}
