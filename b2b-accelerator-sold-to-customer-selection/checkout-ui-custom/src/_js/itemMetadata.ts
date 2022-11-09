import {
  addMetadata,
  hideRealPricing,
  initializeDeliveryDates,
  removeCloneOption,
  updateQuantitySelector,
} from './cart'
import { serviceBaseUrl } from './utils'
import { addMinicart, addTotalizers } from './miniCart'
import { addPoInput } from './shippingData'

export const updateItemMetadata = () => {
  $.ajax({
    type: 'POST',
    url: `${serviceBaseUrl()}/_v/private/update-item-metadata`,
    // data: {},
    success(response: any) {
      console.info('Item metadata update response', response)
      updateQuantitySelector(response.orderForm)
    },
    error: (_data: any) => {
      // const logoutUrl = JSON.parse(data.responseText ?? '{}').response?.data
      //   ?.logoutUrl
      //
      // if (logoutUrl && logoutUrl.length > 0) {
      //   window.location.href = `${serviceBaseUrl()}${logoutUrl}`
      // }

      console.warn('UoM update error occurred')
    },
    dataType: 'json',
  }).done(function (response: any) {
    console.info('Item metadata update response 1', response)
    updateQuantitySelector(response.orderForm)
    addMetadata(response.orderForm)
    hideRealPricing(response.orderForm)
    addMinicart(response.orderForm)
    addTotalizers(response.orderForm)
    addPoInput(response)
    removeCloneOption()
    initializeDeliveryDates()
  })
}
