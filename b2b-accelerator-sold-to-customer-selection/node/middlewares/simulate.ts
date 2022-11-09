/* eslint-disable no-await-in-loop */
import { UserInputError } from '@vtex/api'

import { canProceed, orderFormSnapshotForValidation } from '../utils/orderForm'
import type { CL } from '../typings/vtexShipping'
import { acronymClient } from '../utils/masterdata'
import { performSimulation } from '../modules/simulation'

export async function simulate(ctx: Context, next: () => Promise<any>) {
  const {
    state: {
      orderFormId,
      sandboxResponseType,
      refreshOutdatedData,
      storeUserSessionToken,
    },
    clients: {
      masterdata: mdClient,
      checkout: checkoutClient,
      session: sessionClient,
    },
    vtex: { logger },
  } = ctx

  const orderForm = await checkoutClient.orderForm(
    orderFormId,
    refreshOutdatedData
  )

  const appData = orderForm.customData?.customApps.find(
    app => app.id === 'checkout-simulation'
  )

  if (!appData) {
    throw new UserInputError('Customer information invalid!')
  }

  const sessionResponse = await sessionClient.getSession(
    storeUserSessionToken ?? '',
    [
      'authentication.storeUserEmail',
      'authentication.storeUserId',
      'impersonate.storeUserEmail',
      'impersonate.storeUserId',
      'profile.email',
      'profile.firstName',
      'profile.lastName',
    ]
  )

  const clUsers = await mdClient.searchDocuments<CL>({
    dataEntity: acronymClient,
    where: `(userId=${orderForm.userProfileId})`,
    fields: ['email', 'firstName', 'lastName'],
    pagination: { page: 1, pageSize: 1 },
  })

  const clUser =
    clUsers.find(cl => cl) ??
    (sessionResponse.sessionData.namespaces.profile
      ? {
          email: sessionResponse.sessionData.namespaces.profile.email,
          firstName: sessionResponse.sessionData.namespaces.profile.firstName,
          lastName: sessionResponse.sessionData.namespaces.profile.lastName,
        }
      : undefined)

  if (!clUser) {
    throw new UserInputError('User not found!')
  }

  const { simulationResponse, newSalesChannel } = await performSimulation(
    clUser,
    orderForm,
    ctx,
    sandboxResponseType
  )

  const modifiedOrderForm = await checkoutClient.setOrderFormMultipleCustomData(
    orderFormId,
    'checkout-simulation',
    {
      simulationData: JSON.stringify({
        globalErrors: simulationResponse.globalErrors ?? [],
        items: simulationResponse.items,
        total: simulationResponse.total,
        tax: simulationResponse.tax,
        shipping: simulationResponse.shipping,
      }),
    }
  )

  // Set item prices
  if (
    !simulationResponse.globalErrors ||
    simulationResponse.globalErrors.length === 0
  ) {
    const simulationItems = simulationResponse.items.filter(
      item =>
        (!item.lineItemErrors || item.lineItemErrors.length === 0) &&
        item.itemLine < orderForm.items.length
    )

    try {
      // Simulation returns prices like 15738.999999999998, but now we take the ceil.
      for (const item of simulationItems) {
        await checkoutClient.changeItemPrice(
          orderFormId,
          item.itemLine,
          Math.ceil(item.unitPrice),
          newSalesChannel
        )
      }
    } catch (e) {
      logger.info({ error: e })
    }
  }

  let newOrderForm = await checkoutClient.orderForm(orderFormId)

  // Add the address here to enable the checkout
  if (
    canProceed(
      orderForm,
      modifiedOrderForm.customData?.customApps.find(
        app => app.id === 'checkout-simulation'
      )
    )
  ) {
    await checkoutClient.setOrderFormMultipleCustomData(
      orderFormId,
      'checkout-simulation',
      {
        simulationCompletedAt: new Date().getTime(),
      }
    )
    const selectedAddress = {
      addressType: 'residential',
      receiverName: 'Sahan Jayawardana',
      postalCode: '90680',
      city: 'STANTON',
      state: 'CA',
      country: 'USA',
      // number: shippingAccount.street,
      street: 'Garden Grove',
      isDisposable: true,
    }

    newOrderForm = await checkoutClient.updateOrderFormShipping(orderFormId, {
      clearAddressIfPostalCodeNotFound: false,
      address: selectedAddress,
    })
    if (newOrderForm.value > 0) {
      newOrderForm = await checkoutClient.updateOrderFormPayment(orderFormId, {
        payments: [
          {
            paymentSystem: '17',
            value: newOrderForm.value,
            installments: 1,
            referenceValue: newOrderForm.value,
          },
        ],
      })
    }

    // The try catch block below is to handle 304 exceptions
    try {
      newOrderForm = await checkoutClient.setOrderFormMultipleCustomData(
        orderFormId,
        'checkout-simulation',
        {
          lastFormSnapshot: JSON.stringify(
            orderFormSnapshotForValidation(newOrderForm)
          ),
        }
      )
    } catch (e) {
      console.warn(e)
    }
  }

  ctx.status = 200
  ctx.body = {
    simulationResponse,
    customData: modifiedOrderForm.customData,
    orderForm: newOrderForm,
    impersonation: {
      isImpersonated:
        !!sessionResponse.sessionData.namespaces.impersonate?.storeUserId,
      ...(sessionResponse.sessionData.namespaces.impersonate?.storeUserId
        ? {
            userId:
              sessionResponse.sessionData.namespaces.impersonate.storeUserId
                .value,
            email:
              sessionResponse.sessionData.namespaces.impersonate.storeUserEmail
                ?.value,
          }
        : {}),
    },
  }
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}
