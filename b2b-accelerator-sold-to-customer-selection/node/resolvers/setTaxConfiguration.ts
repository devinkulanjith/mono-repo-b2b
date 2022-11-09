import { AuthenticationError, UserInputError } from '@vtex/api'

import { activateProvider, deactivateProvider } from '../utils/settings'

export async function setTaxConfiguration(
  _: unknown,
  { operation }: SettingsInput,
  ctx: Context
) {
  /*
    This resolver is responsible for activating or deactivating the
    tax service on the order form configuration by using GraphQL
  */

  const {
    clients: { checkoutAdmin },
    vtex: { account, adminUserAuthToken: userToken, workspace },
  } = ctx

  if (!userToken) {
    throw new AuthenticationError('No authorization provided')
  }

  const orderForm = await checkoutAdmin.getOrderFormConfiguration()

  if (operation === 'activate') {
    return activateProvider(
      orderForm,
      checkoutAdmin,
      account,
      workspace,
      userToken
    )
  }

  if (operation === 'deactivate') {
    return deactivateProvider(orderForm, checkoutAdmin, userToken)
  }

  throw new UserInputError(
    "operation must be either 'activate' or 'deactivate'"
  )
}

interface SettingsInput {
  operation: string
}
