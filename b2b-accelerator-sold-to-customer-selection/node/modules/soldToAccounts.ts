import { AuthenticationError, UserInputError } from '@vtex/api'
import { compose, forEach, keys } from 'ramda'
import { parse } from 'cookie'

import type {
  CL,
  ClientOrgAccount,
  OrgAccount,
  SoldToShipTo,
} from '../typings/vtexShipping'
import {
  acronymClient,
  acronymSalesAccount,
  acronymUserSalesAccount,
} from '../utils/masterdata'
import { CHECKOUT_COOKIE } from '../utils'
import type { KeyValue } from '../typings/common'
import type { OrderForm } from '../typings/orderForm'

export type SearchArgs = {
  pageSize: number
  page: number
  sort?: string
  where?: string
}

export const MAX_WHERE_CLAUSE_LENGTH_FOR_VTEX_MD = 30

export const soldToAccountByAddressNoOrUserProfile = async (
  ctx: Context,
  userEmail: string,
  page = 1,
  pageSize = 5,
  performanceData: KeyValue[] = [],
  where?: string
) => {
  const {
    vtex: { logger },
  } = ctx

  const whereClausesForAssignments = [`email=${userEmail}`, where]
    .filter(whereStmt => whereStmt)
    .join(' AND ')

  const start = Date.now()

  // TODO: remove this line
  performanceData.push({
    key: 'START Query UO table',
    value: Date.now().toString(),
  })

  const allAssignments =
    await ctx.clients.masterdata.searchDocumentsWithPaginationInfo<ClientOrgAccount>(
      {
        dataEntity: acronymUserSalesAccount,
        fields: ['soldToCustomerNumber', 'targetSystem'],
        pagination: {
          page,
          pageSize,
        },
        where: `(${whereClausesForAssignments})`,
      }
    )

  if (allAssignments.data.length > 0) {
    let i
    let j
    let temporary
    const chunk = MAX_WHERE_CLAUSE_LENGTH_FOR_VTEX_MD
    const searchPromises: Array<
      Promise<{
        data: OrgAccount[]
        pagination: {
          page: number
          pageSize: number
        }
      }>
    > = []

    // TODO: remove this line
    performanceData.push({
      key: 'START building `where` clauses to query AC',
      value: Date.now().toString(),
    })

    for (i = 0, j = allAssignments.data.length; i < j; i += chunk) {
      temporary = allAssignments.data.slice(i, i + chunk)
      const whereStatement = [
        `isSoldTo=1 AND (${temporary
          .map(
            assignment =>
              `(customerNumber=${assignment.soldToCustomerNumber} AND targetSystem=${assignment.targetSystem})`
          )
          .join(' OR ')})`,
      ]
        .filter(w => w)
        .join(' AND ')

      // TODO: remove this line
      performanceData.push({
        key: 'WHERE Statement : ',
        value: whereStatement,
      })

      searchPromises.push(
        ctx.clients.masterdata.searchDocumentsWithPaginationInfo<OrgAccount>({
          dataEntity: acronymSalesAccount,
          fields: [
            'id',
            'customerNumber',
            'targetSystem',
            'salesOrganizationCode',
            'corporateName',
            'country',
            'city',
            'state',
            'street',
            'postalCode',
          ],
          pagination: {
            page: 1,
            pageSize: 200,
          },
          where: `(${whereStatement})`,
        })
      )
    }

    const data: OrgAccount[] = []

    const afterAssignments = Date.now()

    // TODO: remove this line
    performanceData.push({
      key: 'START query AC table',
      value: Date.now().toString(),
    })

    await Promise.all(searchPromises).then(responses => {
      responses.forEach(response => {
        data.push(...response.data)
      })
    })

    // TODO: remove this line
    performanceData.push({
      key: 'BEFORE sending the response',
      value: Date.now().toString(),
    })

    const afterSoldToAccountQuery = Date.now()

    logger.info(
      `Sold to assignment query took ${afterAssignments - start} millis.`
    )

    logger.info(
      `Sold to account query took ${
        afterSoldToAccountQuery - afterAssignments
      } millis.`
    )

    return {
      data: allAssignments.data.map(assignment => {
        const soldToAccount = data.find(
          account =>
            account.targetSystem === assignment.targetSystem &&
            account.customerNumber === assignment.soldToCustomerNumber
        )

        return soldToAccount
          ? {
              ...soldToAccount,
              accountExists: true,
            }
          : {
              customerNumber: assignment.soldToCustomerNumber,
              targetSystem: assignment.targetSystem,
              salesOrganizationCode: undefined,
              id: undefined,
              accountExists: false,
            }
      }),
      pagination: allAssignments.pagination,
      performanceData,
    }
  }

  throw new UserInputError('No sold to accounts found for user')
}

export const getAssignedSoldToAccounts = async (
  { pageSize, page, where }: SearchArgs,
  ctx: Context
) => {
  const {
    clients: { session: sessionClient, checkout: checkoutClient },
    vtex: { storeUserSessionToken, orderFormId },
  } = ctx

  // TODO: remove this line
  const performanceData = [] as KeyValue[]

  // TODO: remove this line
  performanceData.push({
    key: 'START Request getAssignedSoldToAccounts',
    value: Date.now().toString(),
  })

  // TODO: remove this line
  performanceData.push({
    key: 'START Get Session query',
    value: Date.now().toString(),
  })

  const sessionResponse = await sessionClient.getSession(
    storeUserSessionToken ?? '',
    [
      'public.checkoutSimulation.soldToAccount',
      'public.checkoutSimulation.email',
      'authentication.storeUserEmail',
      'impersonate.storeUserEmail',
    ]
  )

  // TODO: remove this line
  performanceData.push({
    key: 'START Get information from session',
    value: Date.now().toString(),
  })

  const loggedInUserEmail =
    sessionResponse.sessionData.namespaces.impersonate?.storeUserEmail?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserEmail
      ?.value ??
    sessionResponse.sessionData.namespaces.public['checkoutSimulation.email']
      ?.value

  if (!loggedInUserEmail) {
    if (orderFormId) {
      await checkoutClient.removeAllItems(orderFormId)
    }

    throw new UserInputError('User email not found!')
  }

  return soldToAccountByAddressNoOrUserProfile(
    ctx,
    loggedInUserEmail,
    page,
    pageSize,
    performanceData,
    where
  )
}

const SetCookieWhitelist = [CHECKOUT_COOKIE, '.ASPXAUTH']
const IMPERSONATED_EMAIL = 'vtex-impersonated-customer-email'

const isWhitelistedSetCookie = (cookie: string) => {
  const [key] = cookie.split('=')

  return SetCookieWhitelist.includes(key)
}

const parseCookie = (cookie: string) => {
  const parsed = parse(cookie)
  const cookieName = keys(parsed)[0] as string
  const cookieValue = parsed[cookieName]

  const extraOptions = {
    path: parsed.path,
    domain: parsed.domain,
    expires: parsed.expires ? new Date(parsed.expires) : undefined,
  }

  return {
    name: cookieName,
    value: cookieValue,
    options: extraOptions,
  }
}

const replaceDomain = (host: string) => (cookie: string) =>
  cookie.replace(/domain=.+?(;|$)/, `domain=${host};`)

export async function setCheckoutCookies(
  rawHeaders: Record<string, any>,
  ctx: Context
) {
  const responseSetCookies: string[] =
    (rawHeaders && rawHeaders['set-cookie']) || []

  const host = ctx.get('x-forwarded-host')
  const forwardedSetCookies = responseSetCookies.filter(isWhitelistedSetCookie)

  const parseAndClean = compose(parseCookie, replaceDomain(host))

  const cleanCookies = forwardedSetCookies.map(parseAndClean)

  forEach(
    ({ name, value, options }) => ctx.cookies.set(name, value, options),
    cleanCookies
  )
}

export const isPunchoutSession = (orderForm: OrderForm) =>
  (orderForm.customData?.customApps ?? []).find(
    app => app.id === 'punchout-to-go'
  )?.fields?.sessionKey

export const setSoldToAccountInOrderForm = async (
  soldToAccount: string,
  ctx: Context,
  orderFormId?: string
) => {
  if (!orderFormId) {
    throw new UserInputError('Order form ID not found!')
  }

  const {
    clients: {
      checkout: checkoutClient,
      masterdata: mdClient,
      session: sessionClient,
    },
    vtex: { sessionToken },
  } = ctx

  let orderForm = await checkoutClient.orderForm(orderFormId)

  if (!orderForm.userProfileId) {
    throw new UserInputError('User not found in the order form!')
  }

  const sessionResponse = await sessionClient.getSession(sessionToken ?? '', [
    'authentication.storeUserEmail',
    'authentication.storeUserId',
    'impersonate.storeUserEmail',
    'impersonate.storeUserId',
    'profile.email',
    'profile.firstName',
    'profile.lastName',
  ])

  const loggedInUserEmail =
    sessionResponse.sessionData.namespaces.impersonate?.storeUserEmail?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserEmail
      ?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserEmail?.value

  if (!loggedInUserEmail || loggedInUserEmail.length === 0) {
    throw new AuthenticationError('Not authenticated!')
  }

  const loggedInUserId =
    sessionResponse.sessionData.namespaces.impersonate?.storeUserId?.value ??
    sessionResponse.sessionData.namespaces.authentication?.storeUserId?.value

  if (loggedInUserId && loggedInUserId !== orderForm.userProfileId) {
    // throw new ForbiddenError('Cart does not belong to user!')
    ctx.cookies.set(IMPERSONATED_EMAIL, '', {
      maxAge: 0,
      path: '/',
    })
    const response = await checkoutClient.newOrderForm()

    orderForm = response.data
    await setCheckoutCookies(response.headers, ctx)
  }

  const sAccount = await mdClient.getDocument<OrgAccount>({
    dataEntity: acronymSalesAccount,
    fields: [
      'id',
      'customerNumber',
      'corporateName',
      'targetSystem',
      'salesOrganizationCode',
      'city',
      'country',
      'neighborhood',
      'postalCode',
      'receiverName',
      'state',
      'street',
    ],
    id: soldToAccount,
  })

  const clUser = (
    await mdClient.searchDocuments<CL>({
      dataEntity: acronymClient,
      fields: ['email', 'firstName', 'lastName'],
      where: `(userId=${orderForm.userProfileId ?? loggedInUserId})`,
      pagination: { page: 1, pageSize: 1 },
    })
  ).find(cl => cl)

  if (
    !clUser &&
    !sessionResponse.sessionData.namespaces.profile?.email?.value
  ) {
    throw new UserInputError('User profile information not found!')
  }

  if (!sAccount) {
    throw new UserInputError('Sold to account not found!')
  }

  const existingSoldToAccountId = (orderForm.customData?.customApps ?? []).find(
    app => app.id === 'checkout-simulation'
  )?.fields.soldToCustomerNumber

  if (
    existingSoldToAccountId &&
    existingSoldToAccountId.length > 0 &&
    existingSoldToAccountId === sAccount.id
  ) {
    return sAccount
  }

  if (orderForm.items.length > 0) {
    await checkoutClient.removeAllItems(orderFormId)
  }

  await checkoutClient.removeOrderFormCustomData(
    orderForm.orderFormId,
    'checkout-simulation',
    'shipTo'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderForm.orderFormId,
    'checkout-simulation',
    'shipToCustomerNumber'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderForm.orderFormId,
    'checkout-simulation',
    'shipToInfo'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderForm.orderFormId,
    'checkout-simulation',
    'simulationData'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderForm.orderFormId,
    'checkout-simulation',
    'simulationCompletedAt'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderForm.orderFormId,
    'checkout-simulation',
    'itemMetadata'
  )
  await checkoutClient.setOrderFormMultipleCustomData(
    orderForm.orderFormId,
    'checkout-simulation',
    {
      soldToCustomerNumber: sAccount.id,
      soldTo: sAccount.customerNumber,
      soldToInfo: JSON.stringify(sAccount),
      targetSystem: sAccount.targetSystem ?? '',
      clientEmail:
        clUser?.email ??
        sessionResponse.sessionData.namespaces.profile?.email?.value,
    }
  )

  await checkoutClient.updateProfile(orderForm.orderFormId, {
    email:
      clUser?.email ??
      sessionResponse.sessionData.namespaces.profile?.email?.value,
    firstName:
      clUser?.firstName ??
      sessionResponse.sessionData.namespaces.profile?.firstName?.value,
    lastName:
      clUser?.lastName ??
      sessionResponse.sessionData.namespaces.profile?.lastName?.value,
    phone: '+12345678912',
  })

  return sAccount
}

export const getShipToAccountsForSoldTo = async (
  soldToId: string,
  mdClient: Context['clients']['masterdata']
) => {
  const soldToAccount = await mdClient.getDocument<OrgAccount>({
    dataEntity: acronymSalesAccount,
    id: soldToId,
    fields: ['id', 'customerNumber', 'targetSystem'],
  })

  if (!soldToAccount) {
    throw new UserInputError('Sold to account not found!')
  }

  const assignments =
    await mdClient.searchDocumentsWithPaginationInfo<SoldToShipTo>({
      dataEntity: 'AA',
      fields: ['shipToCustomerNumber', 'targetSystem'],
      pagination: {
        page: 1,
        pageSize: 100,
      },
      where: `(soldToCustomerNumber=${soldToAccount.customerNumber} AND targetSystem=${soldToAccount.targetSystem})`,
    })

  // if (assignments.data.length === 0) {
  //   throw new UserInputError('Sold to account not found!')
  // }

  const whereForShipOnly =
    assignments.data.length > 0
      ? `(isShipTo=1 AND (${assignments.data
          .map(
            assignment =>
              `(customerNumber=${assignment.shipToCustomerNumber} AND targetSystem=${assignment.targetSystem})`
          )
          .join(' OR ')}))`
      : undefined

  const whereForSoldToAndShipTo = `(isShipTo=1 AND isSoldTo=1 AND customerNumber=${soldToAccount.customerNumber} AND targetSystem=${soldToAccount.targetSystem})`
  const whereStatement = [whereForShipOnly, whereForSoldToAndShipTo]
    .filter(w => w)
    .join(' OR ')

  return mdClient.searchDocuments<OrgAccount>({
    dataEntity: acronymSalesAccount,
    fields: [
      'id',
      'customerNumber',
      'corporateName',
      'targetSystem',
      'city',
      'country',
      'postalCode',
      'receiverName',
      'state',
      'street',
    ],
    pagination: {
      page: 1,
      pageSize: 1000,
    },
    where: `(${whereStatement})`,
  })
}
