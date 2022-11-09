import type { GraphQLField } from 'graphql'
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import { getSessionTokenFromCookie } from '../utils/session'

export class WithSessionToken extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root: any, args: any, ctx: Context, info: any) => {
      ctx.vtex.storeUserSessionToken = getSessionTokenFromCookie(ctx.cookies)

      return resolve(root, args, ctx, info)
    }
  }
}
