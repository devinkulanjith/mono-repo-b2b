import { UserInputError } from '@vtex/api'

import type { SimulateResponse } from '../../typings/common'
import type { JdeOrderResponse } from '../../typings/jde'
import type { OrderForm } from '../../typings/orderForm'

export const parseJdeToVtex = (
  response: JdeOrderResponse,
  orderForm: OrderForm
): SimulateResponse => {
  // TODO: Caution: We are assuming that there is only one item with a given reference code.
  const items = (orderForm.items ?? []).map((ofItem, index) => {
    const item = (response.items ?? []).find(
      simulationItem => simulationItem.ProductRefId === ofItem.refId
    )

    if ((response.items ?? []).length > 0 && !item) {
      throw new UserInputError(
        `Simulation did not return anything for ${ofItem.refId}.`
      )
    }

    if (
      item &&
      (!parseFloat(item.ExtendedAmount ?? '0') ||
        parseFloat(item.ExtendedAmount ?? '0') === 0)
    ) {
      throw new UserInputError(
        `Pricing could not be returned for ${ofItem.refId}. Please Try Again or Contact Customer Services.`
      )
    }

    const certificateItem = (response.items ?? []).find(
      simulationItem => simulationItem.Lot_Number === item?.itemLine
    )

    // Validate certification item pricing
    // if (
    //   certificateItem &&
    //   (!parseFloat(certificateItem?.ExtendedAmount ?? '0') ||
    //     parseFloat(certificateItem?.ExtendedAmount ?? '0') === 0)
    // ) {
    //   throw new UserInputError(
    //     `Pricing could not be returned for ${ofItem.refId}. Please Try Again or Contact Customer Services.`
    //   )
    // }

    const extendedAmount =
      parseFloat(item?.ExtendedAmount ?? '0') +
      parseFloat(certificateItem?.ExtendedAmount ?? '0')

    const tax = (item?.tax ?? 0) + (certificateItem?.tax ?? 0)
    const shippingCost =
      (item?.shippingCost ?? 0) + (certificateItem?.shippingCost ?? 0)

    return {
      ...item,
      tax,
      shippingCost,
      baseUnitOfMeasure: item?.UnitsOfMeasure ?? '',
      itemReqDeliveryDate: item?.itemReqDeliveryDate ?? '',
      itemLine: index,
      productRefId: item?.ProductRefId ?? '',
      netValue:
        extendedAmount *
        10 **
          orderForm.storePreferencesData.currencyFormatInfo
            .currencyDecimalDigits,
      lineItemValue:
        extendedAmount *
        10 **
          orderForm.storePreferencesData.currencyFormatInfo
            .currencyDecimalDigits,
      quantity: parseInt(item?.quantity ?? '0', 10),
      originalUnitPrice:
        extendedAmount *
        10 **
          orderForm.storePreferencesData.currencyFormatInfo
            .currencyDecimalDigits,
      originalLineTotal:
        extendedAmount *
        10 **
          orderForm.storePreferencesData.currencyFormatInfo
            .currencyDecimalDigits,
      unitPrice:
        extendedAmount *
        10 **
          orderForm.storePreferencesData.currencyFormatInfo
            .currencyDecimalDigits,
      smallPack: false,
      // TODO: Correct delivery date map
      schedules: [
        {
          deliveryDate: item?.DeliveryDate ?? '',
          confirmedQuantity: parseInt(item?.quantity ?? '0', 10),
          salesUnitOfMeasure: item?.UnitsOfMeasure ?? '',
        },
      ],
      ...(certificateItem
        ? { certificationData: JSON.stringify(certificateItem) }
        : {}),
      deliveryDateExactMatch: false,
    }
  })

  return {
    ...response,
    currency: response.currency,
    items,
    total: items.reduce((acc: number, item) => acc + item.originalLineTotal, 0),
    tax: items.reduce((acc: number, item) => acc + (item.tax ?? 0), 0),
    shipping: items.reduce(
      (acc: number, item) => acc + (item.shippingCost ?? 0),
      0
    ),
    // TODO: Discuss the empty string of globalErrors
    globalErrors:
      !response.globalErrors || typeof response.globalErrors === 'string'
        ? []
        : response.globalErrors,
  }
}
