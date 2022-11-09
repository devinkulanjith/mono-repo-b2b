export const LOADER = '<i class="icon-spinner icon-spin loading-coupon"></i>'

export const SHIPPING_BUTTON_TEXT = 'Submit Shipping'
export const SIMULATE_BUTTON_TEXT = 'Get Price and Availability'
export const MOCK_SIMULATE_SUCCESS_BUTTON_TEXT = 'Mock Successful Simulation'
export const MOCK_SIMULATE_LINE_ITEM_ERROR_BUTTON_TEXT =
  'Mock Line Item Error Simulation'
export const MOCK_SIMULATE_LINE_ITEM_WARNING_BUTTON_TEXT =
  'Mock Line Item Warning Simulation'
export const MOCK_SIMULATE_GLOBAL_ERROR_BUTTON_TEXT =
  'Mock Global Error Simulation'
export const FRACTION_DIGITS = 2

export const serviceBaseUrl = () => {
  const { host } = window.location
  const path = window.location.pathname

  console.info('Host', host)
  console.info('Path', path)

  if (host.includes('.myvtex.com')) {
    return ''
  }

  const [, locale, catalog] = path.split('/')

  console.info('locale', locale)
  console.info('catalog', catalog)

  return `/${locale}/${catalog}`
}

export const waitElement = (selector: string, fn: () => void) => {
  const element = setInterval(function () {
    if ($(selector).length) {
      clearInterval(element)
      fn()
    }
  }, 200)
}

export const isPunchoutSession = (orderForm: any) =>
  (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'punchout-to-go'
  )?.fields?.sessionKey
