import { FRACTION_DIGITS } from './utils'

export const poNumber = (orderForm: any) =>
  (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.poNumber ?? ''

export const requiredDeliveryDate = (orderForm: any) =>
  (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.requiredDeliveryDate ?? ''

export const soldTo = (orderForm: any) =>
  (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.soldToCustomerNumber ?? ''

export const soldToCustomerNumber = (orderForm: any) =>
  (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.soldTo ?? ''

export const shipTo = (orderForm: any) =>
  (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.shipToCustomerNumber ?? ''

export const shipToCustomerNumber = (orderForm: any) =>
  (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.shipTo ?? ''

export const simulationLastRun = (orderForm: any) =>
  (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.simulationCompletedAt ?? ''

export const formattedPrice = (price: number, orderForm: any) => {
  const { currencyCode = 'USD' } = orderForm.storePreferencesData

  const { locale = 'en-US' } = orderForm.clientPreferencesData

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    useGrouping: true,
    minimumFractionDigits: FRACTION_DIGITS,
  }).format(price)
}

export const getTaxes = (orderForm: any) => {
  const decimalDivider =
    orderForm.storePreferencesData.currencyFormatInfo.currencyDecimalDigits ?? 2

  return orderForm.totalizers
    .filter((totalizer: any) => totalizer.id === 'CustomTax')
    .map((tax: any) => ({
      name: tax.name === 'REGULAR' ? 'TAXES' : tax.name,
      value: tax.value
        ? formattedPrice(tax.value / 10 ** decimalDivider, orderForm)
        : 'N/A',
    }))
}

export const getTaxesFromSimulation = (orderForm: any) => {
  const decimalDivider =
    orderForm.storePreferencesData.currencyFormatInfo.currencyDecimalDigits ?? 2

  const simulationData = JSON.parse(
    (orderForm.customData?.customApps ?? []).find(
      (app: any) => app.id === 'checkout-simulation'
    )?.fields.simulationData ?? '{}'
  )

  return [
    {
      name: 'TAXES',
      value:
        simulationData?.tax || simulationData?.tax === 0
          ? formattedPrice(simulationData.tax / 10 ** decimalDivider, orderForm)
          : 'N/A',
    },
    {
      name: 'SHIPPING',
      value:
        simulationData?.shipping || simulationData?.shipping === 0
          ? formattedPrice(
              simulationData.shipping / 10 ** decimalDivider,
              orderForm
            )
          : 'N/A',
    },
  ]
}
