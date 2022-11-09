import type { OrderForm, OrderFormItem } from '../typings/orderForm'
import { isPunchoutSession } from '../modules/soldToAccounts'

export const canProceed = (orderForm: any, customApp?: any) => {
  if (!customApp) {
    return false
  }

  const {
    poNumber,
    requiredDeliveryDate,
    soldToCustomerNumber,
    shipToCustomerNumber,
  } = customApp.fields

  if (
    (!isPunchoutSession(orderForm) && !poNumber) ||
    !requiredDeliveryDate ||
    !soldToCustomerNumber ||
    !shipToCustomerNumber ||
    !customApp.fields.simulationData
  ) {
    return false
  }

  const simulationData = JSON.parse(customApp.fields.simulationData)

  return !(
    (simulationData.globalErrors ?? []).length > 0 ||
    simulationData.items.filter(
      (item: any) => (item.lineItemErrors ?? []).length > 0
    ).length > 0
  )
}

export const transformOrderFormItems = (items: OrderFormItem[]) =>
  [...items]
    .sort((it1, it2) => it1.uniqueId.localeCompare(it2.uniqueId))
    .map(item => ({
      id: item.uniqueId,
      quantity: item.quantity,
      attachments: item.attachments,
    }))

export const orderFormSnapshotForValidation = (orderForm: OrderForm) => {
  const appData = orderForm.customData?.customApps.find(
    app => app.id === 'checkout-simulation'
  )?.fields

  return {
    clientEmail: appData?.clientEmail,
    userId: orderForm.userProfileId ?? '',
    poNumber: appData?.poNumber,
    soldToCustomerNumber: appData?.soldToCustomerNumber,
    soldTo: appData?.soldTo,
    shipToCustomerNumber: appData?.shipToCustomerNumber,
    shipTo: appData?.shipTo,
    requiredDeliveryDate: appData?.requiredDeliveryDate,
    items: transformOrderFormItems(orderForm.items),
  }
}
