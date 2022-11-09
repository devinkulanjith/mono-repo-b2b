import { UserInputError } from '@vtex/api'

import { updateItemMetadata } from '../modules/orderForm'

type UpdateUnitOfMeasurementDataArgs = {
  orderFormId?: string
}

type OrderFormArgs = UpdateUnitOfMeasurementDataArgs

export const updateUnitOfMeasurement = async (
  _: any,
  args: UpdateUnitOfMeasurementDataArgs,
  ctx: Context
) => {
  const { orderFormId = ctx.vtex.orderFormId } = args

  if (!orderFormId) {
    throw new UserInputError('Order form ID not found!')
  }

  const response = await updateItemMetadata(orderFormId, ctx)

  return !!response
}

export const orderForm = async (
  _: any,
  args: OrderFormArgs,
  { clients: { checkout: checkoutClient }, vtex }: Context
) => {
  const { orderFormId = vtex.orderFormId } = args

  if (!orderFormId) {
    throw new UserInputError('Order form ID not found!')
  }

  return checkoutClient.orderForm(orderFormId)
}
