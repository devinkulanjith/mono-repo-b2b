import {
  addMetadata,
  hideRealPricing,
  removeCloneOption,
  updateQuantitySelector,
  fixChooseProduct,
  initializeDeliveryDates,
  hideFreightMessage,
  updateCertificationName,
} from './_js/cart'
import { submitShippingInfo } from './_js/shippingData'
import {
  addSimulation,
  handleSimulationResponse,
  validateOrderForm,
} from './_js/simulation'
import { initializeElements, initializeElementsOnAjax } from './_js/general'
import {
  addMinicart,
  addTotalizers,
  changeMinicartContent,
} from './_js/miniCart'
import { changePaymentContent, condensedTaxes, changePaymentConfirmationContent } from './_js/payments'
import { SIMULATE_BUTTON_TEXT, LOADER, serviceBaseUrl } from './_js/utils'
import { updateItemMetadata } from './_js/itemMetadata'
import { showAttachments } from './_js/attachments'
import { addPunchoutForm } from './_js/punchout'

declare const vtexjs: any

declare global {
  interface Window {
    vtex: any
  }
}

window.vtex.disableSentry = true

$(window).on('orderFormUpdated.vtex', (_: any, orderForm: any) => {
  initializeElements()
  addMinicart(orderForm)
  addTotalizers(orderForm)
  hideRealPricing(orderForm)
  addSimulation(orderForm)
  condensedTaxes(orderForm)
  // addMetadata(orderForm)
  updateItemMetadata()
  showAttachments()
  initializeDeliveryDates()
  hideFreightMessage()
  addPunchoutForm(orderForm)
  updateCertificationName()

  const lastSimulationAt = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.simulationCompletedAt

  // if (lastSimulationAt && lastSimulationAt.length > 0) {
  //   runTimer(orderForm)
  // }
  console.warn('Order form updated...')
  if (!lastSimulationAt || lastSimulationAt.length === 0) {
    if (
      orderForm.shippingData.address ||
      (orderForm.shippingData.selectedAddresses ?? []).length > 0
    ) {
      console.warn('Clearing order form metadata')
      vtexjs.checkout.sendAttachment('shippingData', {
        clearAddressIfPostalCodeNotFound: false,
        address: null,
        selectedAddresses: [],
      })
    }
  }

  if (lastSimulationAt && lastSimulationAt.length > 0) {
    validateOrderForm()
  }
})

$(document).ajaxComplete((_e: any, data: any) => {
  initializeElementsOnAjax()
  // removeMiniCartLoader()
  showAttachments()
  changeMinicartContent()
  changePaymentContent()
  fixChooseProduct()
  hideFreightMessage()
  changePaymentConfirmationContent()

  let orderForm = vtexjs?.checkout?.orderForm

  if (data?.responseText) {
    orderForm = JSON.parse(data.responseText)
  }

  if (!orderForm?.orderFormId) {
    return
  }

  condensedTaxes(orderForm)
  addMinicart(orderForm)
  addTotalizers(orderForm)
  hideRealPricing(orderForm)
  removeCloneOption()
  initializeDeliveryDates()
  // updateItemMetadata()
})

$('body').on('click', '#btn-client-pre-email', function (e) {
  setTimeout(function () {
    if (!$('input#client-pre-email').hasClass('error')) {
      $('input#client-email').focus()
    }
  }, 1000)
})

$(window).on('load', async () => {
  const orderForm = await vtexjs.checkout.getOrderForm()

  addMetadata(orderForm)
})

$(window).on('hashchange', async () => {
  // removeMiniCartLoader()
  changeMinicartContent()
  changePaymentContent()
  showAttachments()
  hideFreightMessage()

  $('.mini-cart .price').removeAttr('data-bind')
  const orderForm = await vtexjs.checkout.getOrderForm()

  if (window.location.hash === '#/shipping') {
    // termsAndConditions()
  }

  hideRealPricing(orderForm)
  if (window.location.hash === '#/cart') {
    updateQuantitySelector(orderForm)
  }

  addMinicart(orderForm)
  addMetadata(orderForm)
  removeCloneOption()
  initializeDeliveryDates()

  // if (window.location.hash === '#/payment') {
  //   addSimulation(orderForm)
  //   runTimer(orderForm)
  // }
})

$(document).on('click', '#submit-shipping-info', async (e: any) => {
  e.preventDefault()
  e.stopPropagation()
  const orderForm = await vtexjs.checkout.getOrderForm()

  submitShippingInfo(orderForm)
})

$(document).on('click', '#simulate-run', () => {
  const $button = $('#simulate-run')

  $button.prop('disabled', true)
  $button.html(LOADER)
  // $.post('/_v/simulate')
  //   .done((data: any) => {
  //     $button.html(SIMULATE_BUTTON_TEXT)
  //     $button.prop('disabled', false)
  //     handleSimulationResponse(data)
  //   })
  //   .fail(() => {
  //     $button.html(SIMULATE_BUTTON_TEXT)
  //     $button.prop('disabled', false)
  //   })
  $.ajax({
    type: 'POST',
    url: `${serviceBaseUrl()}/_v/private/simulate`,
    timeout: 120000,
    // data: data,
    success: (data: any) => {
      $button.html(SIMULATE_BUTTON_TEXT)
      $button.prop('disabled', false)
      $('#simulation-error-container').remove()
      handleSimulationResponse(data)
    },
    error: (xhr: any, _status: any, _error: any) => {
      $button.html(SIMULATE_BUTTON_TEXT)
      $button.prop('disabled', false)
      const $error = $(
        `<div id="simulation-error-container" class="span12 text-center simulation-error-container"><span class="text-error">${
          JSON.parse(xhr.responseText ?? '{}').message ??
          'Something went wrong while sending the request. Please try again.'
        }</span></div>`
      )

      $('.simulation-summary-placeholder').append($error)
    },
    dataType: 'json',
  })
})
