import { UserInputError } from '@vtex/api'

export async function handleOrderCreate(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { oms: omsClient },
  } = ctx

  const order = await omsClient.order(ctx.body.orderId)

  if (!order) {
    throw new UserInputError('Order not found')
  }

  // await mdClient.deleteDocument({
  //   dataEntity: 'SimulatedOrderFormV1',
  //   id: order.orderFormId,
  // })
  await next()
}
