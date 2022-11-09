import type { OrgAccount } from '../typings/vtexShipping'

export const updateSimulationInfoInSession = async (
  sessionClient: Context['clients']['session'],
  soldTo: OrgAccount,
  storeUserSessionToken?: string
) => {
  const sessionResponse = await sessionClient.getSession(
    storeUserSessionToken ?? '',
    [
      'public.checkoutSimulation.email',
      'authentication.storeUserEmail',
      'impersonate.storeUserEmail',
    ]
  )

  const loggedInUserEmail =
    sessionResponse.sessionData.namespaces.impersonate?.storeUserEmail?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserEmail
      ?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserEmail?.value

  await sessionClient.updateSession(
    'checkoutSimulation.soldToAccount',
    soldTo.id,
    ['public.checkoutSimulation.soldToAccount'],
    storeUserSessionToken
  )

  await sessionClient.updateSession(
    'checkoutSimulation.soldToInfo',
    soldTo,
    ['public.checkoutSimulation.soldToInfo'],
    storeUserSessionToken
  )

  await sessionClient.updateSession(
    'checkoutSimulation.email',
    loggedInUserEmail,
    ['public.checkoutSimulation.email'],
    storeUserSessionToken
  )
}
