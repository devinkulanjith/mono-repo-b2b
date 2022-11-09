import moment from 'moment'

import type { SapOrderResponse } from '../../typings/sap'
import type { SimulateResponse } from '../../typings/common'
import type { OrderForm } from '../../typings/orderForm'

export const parseSapToVtex = (
  response: SapOrderResponse,
  orderForm: OrderForm,
  logger?: Context['vtex']['logger']
): SimulateResponse => {
  if (logger) {
    logger.debug({ sapResponse: response })
  }

  const decimalDivider =
    orderForm.storePreferencesData.currencyFormatInfo.currencyDecimalDigits ?? 2

  const items = response.items
    ? (Array.isArray(response.items) ? response.items : [response.items]).map(
        item => ({
          ...item,
          itemLine: parseInt(item.itemLine, 10) - 1,
          netValue: parseFloat(item.NetValue),
          lineItemValue: parseFloat(item.lineItemValue),
          shippingCost: parseFloat(item.shippingCost ?? '0'),
          tax: parseFloat(item.tax ?? '0') * 10 ** decimalDivider,
          quantity: parseInt(item.quantity, 10),
          originalUnitPrice:
            (parseFloat(item.NetValue) - parseFloat(item.shippingCost ?? '0')) /
            parseInt(item.quantity, 10),
          originalLineTotal:
            parseFloat(item.NetValue) - parseFloat(item.shippingCost ?? '0'),
          unitPrice: Math.ceil(
            parseFloat(item.NetValue) -
              parseFloat(item.shippingCost ?? '0') / parseInt(item.quantity, 10)
          ),
          productRefId: item.ProductRefId,
          baseUnitOfMeasure: item.UnitsOfMeasure,
          smallPack: item.SmallPack ?? false,
          schedules: (!item.ScheduleLines
            ? []
            : Array.isArray(item.ScheduleLines)
            ? item.ScheduleLines
            : [item.ScheduleLines]
          )
            .map(scheduleLine => ({
              deliveryDate: moment(scheduleLine.ScheduleLineDate).format(
                'YYYY-MM-DD'
              ),
              arrivalTime: scheduleLine.ArrivalTime,
              confirmedQuantity: parseInt(
                scheduleLine.ConfirmedQuantity ?? '0',
                10
              ),
              salesUnitOfMeasure: scheduleLine.salesUnit,
            }))
            .filter(scheduleLine => scheduleLine.confirmedQuantity > 0),
          deliveryDateExactMatch: true,
        })
      )
    : []

  const tax = items.reduce((acc: number, item) => acc + (item.tax ?? 0), 0)
  const shipping = items.reduce(
    (acc: number, item) => acc + item.shippingCost,
    0
  )

  return {
    ...response,
    globalErrors:
      typeof response.globalErrors === 'string'
        ? [response.globalErrors]
        : response.globalErrors,
    currency: response.currency,
    soldToCustomerNumber: response.soldToCustomerNumber,
    shipToCustomerNumber: response.shipToCustomerNumber,
    customerPO: response.customerPO,
    requestedDeliveryDate: response.requestedDeliveryDate,
    items,
    total:
      items.reduce((acc: number, item) => acc + item.originalLineTotal, 0) +
      tax +
      shipping,
    tax,
    shipping,
  }
}
