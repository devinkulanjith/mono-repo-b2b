import { orderFormSnapshotForValidation } from '../../utils/orderForm'
import { updateItemMetadata as updateOrderFormItemMetadata } from '../../modules/orderForm'

export async function removeCustomData(ctx: Context, next: () => Promise<any>) {
  const {
    state: { orderFormId, appId, fieldName },
    clients: { checkout: checkoutClient },
  } = ctx

  await checkoutClient.removeOrderFormCustomData(orderFormId, appId, fieldName)

  ctx.status = 200
  ctx.body = {}
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}

export async function setShippingInformation(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    state: {
      orderFormId,
      shipTo,
      shipToCustomerNumber,
      shipToAccount,
      poNumber,
      requiredDeliveryDate,
    },
    clients: { checkout: checkoutClient },
  } = ctx

  const orderForm = await checkoutClient.setOrderFormMultipleCustomData(
    orderFormId,
    'checkout-simulation',
    {
      ...(shipTo.length > 0 ? { shipToCustomerNumber: shipTo } : {}),
      ...(shipToCustomerNumber.length > 0
        ? { shipTo: shipToCustomerNumber }
        : {}),
      shipToInfo: JSON.stringify(shipToAccount),
      ...(poNumber.length > 0 ? { poNumber } : {}),
      ...(requiredDeliveryDate.length > 0 ? { requiredDeliveryDate } : {}),
    }
  )

  ctx.status = 200
  ctx.body = { success: true, orderForm }
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}

export async function validateItems(ctx: Context, next: () => Promise<any>) {
  const {
    state: { orderFormId },
    clients: { checkout: checkoutClient },
  } = ctx

  const orderForm = await checkoutClient.orderForm(orderFormId)
  let modifiedOrderForm = orderForm
  const previousOrderFormSnapshot = orderForm.customData?.customApps.find(
    app => app.id === 'checkout-simulation'
  )?.fields.lastFormSnapshot

  if (
    orderForm.customData?.customApps.find(
      app => app.id === 'checkout-simulation'
    )?.fields.simulationCompletedAt
  ) {
    const newOrderFormSnapshot = orderFormSnapshotForValidation(orderForm)

    if (JSON.stringify(newOrderFormSnapshot) !== previousOrderFormSnapshot) {
      modifiedOrderForm = await checkoutClient.updateOrderFormShipping(
        orderFormId,
        {
          address: null,
          selectedAddresses: [],
        }
      )
      modifiedOrderForm = (
        await checkoutClient.removeOrderFormCustomData(
          orderFormId,
          'checkout-simulation',
          'simulationCompletedAt'
        )
      ).data
      modifiedOrderForm = (
        await checkoutClient.removeOrderFormCustomData(
          orderFormId,
          'checkout-simulation',
          'simulationData'
        )
      ).data
      await checkoutClient.setOrderFormMultipleCustomData(
        orderFormId,
        'checkout-simulation',
        {
          lastFormSnapshot: JSON.stringify(
            orderFormSnapshotForValidation(modifiedOrderForm)
          ),
        }
      )
    }
  }

  ctx.status = 200
  ctx.body = { success: true, orderForm: modifiedOrderForm }
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}

export async function updateItemMetadata(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    state: { orderFormId },
  } = ctx

  const metadata = await updateOrderFormItemMetadata(orderFormId, ctx)

  ctx.status = 200
  ctx.body = { success: true, ...metadata }
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}
