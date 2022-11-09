import { UserInputError } from '@vtex/api'

export async function validateSoldTo(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { userProfileId } = params

  if (!userProfileId) {
    throw new UserInputError('User ID is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }

  ctx.state.userProfileId = userProfileId as string

  await next()
}

export async function validateOrgAccountById(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { id } = params

  if (!id) {
    throw new UserInputError('Account ID is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }

  ctx.state.orgAccountId = id as string

  await next()
}
