import { simulationLastRun } from './orderForm'
import type { Payment } from './payments'
import {
  SIMULATE_BUTTON_TEXT,
  serviceBaseUrl,
  isPunchoutSession,
} from './utils'

declare const $: any
declare const vtexjs: any
declare const vtex: any

export const handleSimulationResponse = (data: any) => {
  const hasGlobalErrors =
    (data.simulationResponse.globalErrors ?? []).length > 0

  if (hasGlobalErrors) {
    $('#payment-data .loading-bg').hide()
    vtex.checkout.MessageUtils.showMessage({
      status: 'fatal',
      text: `<p>Simulation completed with errors. Please review below errors.</p>${(
        data.simulationResponse.globalErrors ?? []
      )
        .map(
          (globalError: string) =>
            `<p class="simulation-text-alert"><i class="icon-simulation-warning"/>${globalError}</p>`
        )
        .join('')}`,
    })

    return
  }

  const hasItemErrors = data.simulationResponse.items.find(
    (item: any) => (item.lineItemErrors ?? []).length > 0
  )?.lineItemErrors

  if (hasItemErrors) {
    const $cartLines = $('.product-item')

    $cartLines.each(function (index: number, $cartLine: any) {
      const itemErrors =
        data.simulationResponse.items.find(
          (item: any) => item.itemLine === index
        )?.lineItemErrors ?? []

      for (const itemError of itemErrors) {
        const $error = document.createElement('p')
        const $errorIcon = document.createElement('i')

        $errorIcon.classList.add('icon-simulation-error')

        $error.classList.add('text-error', 'simulation-text-alert', 'span12')
        $error.append($errorIcon, ' ', itemError)
        $cartLine.append($error)
      }
    })
    window.location.hash = '/cart'
    vtex.checkout.MessageUtils.showMessage({
      status: 'fatal',
      text: 'Simulation completed with errors. Please review your cart items.',
    })

    return
  }

  window.location.reload()
  // window.location.hash = '/payment'
  // $(window).trigger('orderFormUpdated.vtex', [data.orderForm])
}

export const toggleBuyButtonVisibility = (show: boolean) => {
  const $paymentConfirmationWrapper = $('.payment-confirmation-wrap')
  const $paymentSubmitWrapper = $(
    '.payment-confirmation-wrap .payment-submit-wrap'
  )

  const $submitButtons = $(
    '.payment-confirmation-wrap .payment-submit-wrap button.submit'
  )

  if (show) {
    $paymentConfirmationWrapper.show()
    $paymentSubmitWrapper.show()
    $submitButtons.show()

    return
  }

  $paymentConfirmationWrapper.hide()
  $paymentSubmitWrapper.hide()
  $submitButtons.hide()
}

export const addSimulation = (orderForm: any) => {
  const $orderFormContainer = $(
    '.orderform-template-holder .row-fluid #payment-data'
  )

  const appData = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields

  $('.simulation-wrapper').remove()

  if (
    (!isPunchoutSession(orderForm) && !appData?.poNumber) ||
    !appData?.requiredDeliveryDate ||
    !appData?.soldToCustomerNumber ||
    !appData?.shipToCustomerNumber
  ) {
    return
  }

  if (!appData?.simulationCompletedAt || !appData?.simulationData) {
    $('#btn-go-to-payment').prop('disabled', true)
    const $simulationBox = $(`
      <div class="simulation-wrapper span6 pull-right" id="simulation-wrapper">
        <div class="step accordion-group">
          <div class="accordion-heading">
            <span class="accordion-toggle collapsed">
              <i class="icon-home"></i>Price and Availability
            </span>
          </div>
          <div class="accordion-inner">
            <div class="box-step box-info simulation-summary-placeholder">
              <div class="simulation-note">Check item pricing by clicking the button below.</div>
              <button class="submit btn btn-success btn-large" id="simulate-run">${SIMULATE_BUTTON_TEXT}</button>
            </div>
          </div>
        </div>
      </div>`)

    $simulationBox.insertBefore($orderFormContainer)
    toggleBuyButtonVisibility(false)
  } else {
    const hasItemWarnings = JSON.parse(appData.simulationData).items.find(
      (item: any) => (item.lineItemWarnings ?? []).length > 0
    )

    let message =
      'Simulation completed successfully. You can proceed with your order.'

    if (hasItemWarnings) {
      message = `<p>Simulation completed successfully with following warnings.</p>${JSON.parse(
        appData?.simulationData ?? '{}'
      )
        .items.filter((item: any) => (item.lineItemWarnings ?? []).length > 0)
        .map(
          (item: any) =>
            `<h3>${
              orderForm.items.find(
                (_orderFormItem: any, index: number) => index === item.itemLine
              )?.name ?? ''
            } (at line ${parseInt(item.itemLine, 10) + 1})</h3>${(
              item.lineItemWarnings ?? []
            )
              .map(
                (warning: string) =>
                  `<p class="simulation-text-alert"><i class="icon-simulation-warning"/>${warning}</p>`
              )
              .join('')}`
        )}`
    }

    const $simulationBox = $(`
      <div class="simulation-wrapper span6 pull-right" id="simulation-wrapper-result">
        <div class="step accordion-group">
          <div class="accordion-heading">
            <span class="accordion-toggle collapsed"><i class="icon-home"></i>Price and Availability</span>
          </div>
          <div class="accordion-inner">
            <div class="box-step box-info simulation-summary-placeholder">
              <div>${message}</div>
            </div>
          </div>
        </div>
      </div>`)

    $simulationBox.insertBefore($orderFormContainer)
    toggleBuyButtonVisibility(true)
  }
}

export const runTimer = (orderForm: any) => {
  const simulationLastRunTimestamp = simulationLastRun(orderForm)

  if (
    simulationLastRunTimestamp &&
    orderForm.paymentData.payments.find(
      (payment: Payment) => payment.paymentSystem === '17'
    )
  ) {
    //   const appData = orderForm.customData?.customApps.find(
    //     (app: any) => app.id === 'checkout-simulation'
    //   )?.fields
    //
    //   const hasItemWarnings = JSON.parse(appData.simulationData).items.find(
    //     (item: any) => (item.lineItemWarnings ?? []).length > 0
    //   )
    //
    //   let message =
    //     'Simulation completed successfully. You have 10 seconds to place your order.'
    //
    //   if (hasItemWarnings) {
    //     message = `<p>Simulation completed successfully with following warnings. You have 10 seconds to place your order.</p>${JSON.parse(
    //       appData.simulationData
    //     )
    //       .items.filter((item: any) => (item.lineItemWarnings ?? []).length > 0)
    //       .map(
    //         (item: any) =>
    //           `<h3>${
    //             orderForm.items.find(
    //               (_orderFormItem: any, index: number) =>
    //                 index === parseInt(item.itemLine, 10) - 1
    //             )?.name ?? ''
    //           }</h3><ul>${(item.lineItemWarnings ?? []).map(
    //             (warning: string) => `<li>${warning}</li>`
    //           )}</ul>`
    //       )}`
    //   }
    //
    //   vtex.checkout.MessageUtils.showMessage({
    //     status: 'fatal',
    //     text: message,
    //   })
    // }

    const countDownDate = parseInt(
      simulationLastRunTimestamp && simulationLastRunTimestamp.length > 0
        ? simulationLastRunTimestamp
        : '1627035054284',
      10
    )

    // Update the count down every 1 second
    const timer = setInterval(function () {
      // Get today's date and time
      const now = new Date().getTime()

      // Find the distance between now and the count down date
      const distance = now - countDownDate

      console.warn('Simulate time', simulationLastRun(orderForm))
      console.warn('Time now', now)
      console.warn('Simulation interval', distance)

      // If the count down is finished, write some text
      if (distance >= 20000) {
        clearInterval(timer)
        vtexjs.checkout.sendAttachment('shippingData', {
          clearAddressIfPostalCodeNotFound: false,
          address: null,
        })
        $.ajax({
          url: `${serviceBaseUrl()}/_v/private/orderForm/checkout-simulation/simulationData`,
          type: 'DELETE',
          success(result: any) {
            console.warn('Removing metadata', result)
          },
        })
        $.ajax({
          url: `${serviceBaseUrl()}/_v/private/orderForm/checkout-simulation/simulationCompletedAt`,
          type: 'DELETE',
          success(result: any) {
            console.warn('Removing metadata', result)
          },
        })
      }
    }, 1000)
  }
}

export const validateOrderForm = () => {
  $.post(`${serviceBaseUrl()}/_v/private/validate-order-form`).done(
    (data: any) => {
      addSimulation(data.orderForm)
    }
  )
}
