import { poNumber, requiredDeliveryDate, soldTo } from './orderForm'
import {
  LOADER,
  serviceBaseUrl,
  SHIPPING_BUTTON_TEXT,
  isPunchoutSession,
} from './utils'

declare const $: any

export type OrgAccount = {
  id: string
  customerNumber: string
  targetSystem: string
  city: string
  country: string
  postalCode: string
  receiverName: string
  state: string
  street: string
}

export const showShippingInfo = (
  orderForm: any,
  appData: any,
  $shippingContainer: any,
  soldToAccount?: any,
  shipToAccount?: any
) => {
  const $shippingBox = $(
    `<div class="simulation-shipping-info span6" id="simulation-shipping-info-result">
      <div class="step accordion-group simulation-shipping-info">
        <div class="accordion-heading">
          <span class="accordion-toggle collapsed">
            <i class="icon-home"></i>Shipping Information<a id="edit-simulation-shipping-info" class="link-box-edit btn btn-small"><i class="icon-edit"></i></a>
          </span>
        </div>
        <div class="accordion-inner">
          <div class="box-step box-info shipping-summary-placeholder">
          ${
            !isPunchoutSession(orderForm)
              ? `
            <span class="street">PO Number: ${appData?.poNumber ?? 'N/A'}</span>
            <br class="line2-delimiter">`
              : ''
          }
            <span class="street">Requested Delivery Date: ${
              appData?.requiredDeliveryDate ?? 'N/A'
            }</span>
            <br class="line2-delimiter">
            <span class="street">Sold to:</span>
            <span class="street sold-to-account-more-info">${
              soldToAccount?.receiverName
                ? `${soldToAccount?.receiverName}, `
                : ''
            }${soldToAccount?.address ?? 'N/A'}</span>
            <br class="line2-delimiter">
            <span class="street">Ship to:</span>
            <span class="street ship-to-account-more-info">${
              shipToAccount?.receiverName
                ? `${shipToAccount?.receiverName}, `
                : ''
            }${shipToAccount?.address ?? 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>`
  )

  $shippingBox.insertBefore($shippingContainer)
}

export const showShippingEditForm = (
  orderForm: any,
  $shippingContainer: any,
  soldToAccount?: any,
  shipToAccount?: any,
  allShipToAccounts: any[] = []
) => {
  if (!soldTo(orderForm) || !soldToAccount) {
    const $soldToWarning =
      $(`<div class="simulation-shipping-info span6" id="simulation-shipping-info">
        <div class="step accordion-group">
          <div class="accordion-heading">
            <span class="accordion-toggle collapsed"><i class="icon-home"></i>Shipping Information</span>
          </div>
          <div class="accordion-inner">
            <div class="box-step box-info shipping-summary-placeholder">
              <div class="row ml-0">
                <div class="span12">
                  <p class="street simulation-text-alert"><i class="icon-simulation-warning-bg"/>Please select a sold to account!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`)

    if (!$('#simulation-shipping-info').length) {
      $soldToWarning.insertBefore($shippingContainer)
    }

    return
  }

  const $shippingBox = $(`
    <div class="simulation-shipping-info span6" id="simulation-shipping-info">
      <div class="step accordion-group">
        <div class="accordion-heading">
          <span class="accordion-toggle collapsed"><i class="icon-home"></i>Shipping Information</span>
        </div>
        <div class="accordion-inner">
          <div class="box-step box-info shipping-summary-placeholder">
            <div class="row ml-0">
              <div class="span12">
                <p class="sold-to-account-value"><i class="icon-simulation-success"/>Sold to:&nbsp;<span class="sold-to-account-more-info">
                ${
                  soldToAccount?.receiverName
                    ? `${soldToAccount?.receiverName}, `
                    : ''
                }${soldToAccount?.address ?? 'N/A'}</span></p>
                <form>
                ${
                  !isPunchoutSession(orderForm)
                    ? `
                  <div class="control-group" id="po-number-input-wrapper">

                    <label class="control-label astrick-add" for="po-number">PO Number</label>
                    <div class="controls">
                      <input required type="text" id="po-number" value="${poNumber(
                        orderForm
                      )}" placeholder="PO Number">
                      <span class="help-inline"></span>
                    </div>
                  </div>`
                    : '<input type="hidden" id="po-number">'
                }
                  <div class="control-group" id="required-delivery-date-input-wrapper">
                    <label class="control-label" for="required-delivery-date">Requested Delivery Date</label>
                    <div class="controls">
                      <input required type="text" id="required-delivery-date" value="${requiredDeliveryDate(
                        orderForm
                      )}" />
                      <span class="help-inline"></span>
                    </div>
                  </div>
                  <div class="control-group" id="ship-to-account-input-wrapper">
                    <label class="control-label" for="ship-to-account-select">Ship to Account</label>
                    <div class="controls">
                      <select required id="ship-to-account-select" class="ship-to-account-select">
                        ${
                          (allShipToAccounts ?? []).length !== 1 &&
                          '<option value="">Please select a ship to account</option>'
                        }
                        ${allShipToAccounts
                          .sort((s1, s2) => {
                            if (s1.customerNumber < s2.customerNumber) {
                              return 1
                            }

                            return -1
                          })
                          .map((shipToAcc: any) => {
                            return `<option ${
                              shipToAccount?.id &&
                              shipToAccount.id === shipToAcc.id
                                ? 'selected'
                                : ''
                            } value="${shipToAcc.id}">${
                              shipToAcc?.receiverName
                                ? `${shipToAcc?.receiverName}, `
                                : ''
                            }${shipToAcc.address}</option>`
                          })}
                      </select>
                      <span class="help-inline"></span>
                    </div>
                  </div>
                  <div class="control-group">
                    <div class="controls text-center">
                      <button class="submit btn btn-success btn-large" id="submit-shipping-info">Save Shipping</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `)

  if (!$('#simulation-shipping-info').length) {
    $shippingBox.insertBefore($shippingContainer)
    $('#required-delivery-date').datepicker({
      autoclose: true,
      format: 'yyyy-mm-dd',
      startDate: '+7d',
    })
  }
}

export type MetadataResponse = {
  orderForm: any
  soldTo: any
  shipTo: any
  allShipToAccounts: any[]
}

export const addPoInput = (metadataResponse: MetadataResponse) => {
  const {
    orderForm,
    soldTo: soldToAccount,
    shipTo: shipToAccount,
    allShipToAccounts,
  } = metadataResponse

  const $shippingContainer = $(
    '.orderform-template-holder .row-fluid #shipping-data'
  )

  const appData = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields

  if (
    (!isPunchoutSession(orderForm) && !appData?.poNumber) ||
    !appData?.requiredDeliveryDate ||
    !appData?.soldToCustomerNumber ||
    !appData?.shipToCustomerNumber
  ) {
    $('#btn-go-to-payment').prop('disabled', true)
  }

  if (
    (isPunchoutSession(orderForm) || appData?.poNumber) &&
    appData?.requiredDeliveryDate &&
    appData?.soldToCustomerNumber &&
    appData?.shipToCustomerNumber
  ) {
    $('.simulation-shipping-info').remove()
    showShippingInfo(
      orderForm,
      appData,
      $shippingContainer,
      soldToAccount,
      shipToAccount
    )
  } else {
    showShippingEditForm(
      orderForm,
      $shippingContainer,
      soldToAccount,
      shipToAccount,
      allShipToAccounts
    )
  }

  $(document).on('click', '#edit-simulation-shipping-info', function (e: any) {
    e.preventDefault()
    e.stopPropagation()
    $('.simulation-shipping-info').remove()

    showShippingEditForm(
      orderForm,
      $shippingContainer,
      soldToAccount,
      shipToAccount,
      allShipToAccounts
    )
  })
}

export const validateShipping = (
  orderForm: any,
  poNumberVal?: string,
  requiredDeliveryDateVal?: string,
  shipToAccVal?: string
) => {
  if (
    !isPunchoutSession(orderForm) &&
    (!poNumberVal || poNumberVal.length === 0)
  ) {
    $('#po-number-input-wrapper').addClass('error')
    $('#po-number-input-wrapper input').addClass('error')
    $('#po-number-input-wrapper span.help-inline').text(
      'PO number is required!'
    )
  } else if (!isPunchoutSession(orderForm) && poNumberVal.length > 20) {
    $('#po-number-input-wrapper').addClass('error')
    $('#po-number-input-wrapper input').addClass('error')
    $('#po-number-input-wrapper span.help-inline').text(
      'The maximum number of digits allowed for PO number is 20. Please re-enter the po number.'
    )
  } else {
    $('#po-number-input-wrapper').removeClass('error')
    $('#po-number-input-wrapper input').removeClass('error')
    $('#po-number-input-wrapper span.help-inline').text('')
  }

  if (!requiredDeliveryDateVal || requiredDeliveryDateVal.length === 0) {
    $('#required-delivery-date-input-wrapper').addClass('error')
    $('#required-delivery-date-input-wrapper input').addClass('error')
    $('#required-delivery-date-input-wrapper span.help-inline').text(
      'Delivery date is required!'
    )
  } else {
    $('#required-delivery-date-input-wrapper').removeClass('error')
    $('#required-delivery-date-input-wrapper input').removeClass('error')
    $('#required-delivery-date-input-wrapper span.help-inline').text('')
  }

  if (!shipToAccVal || shipToAccVal.length === 0) {
    $('#ship-to-account-input-wrapper').addClass('error')
    $('#ship-to-account-input-wrapper select').addClass('error')
    $('#ship-to-account-input-wrapper span.help-inline').text(
      'Ship to Account value is required!'
    )
  } else {
    $('#ship-to-account-input-wrapper').removeClass('error')
    $('#ship-to-account-input-wrapper select').removeClass('error')
    $('#ship-to-account-input-wrapper span.help-inline').text('')
  }
}

export const submitShippingInfo = (orderForm: any) => {
  const poVal = $('#po-number').val()
  const requiredDeliveryDateVal = $('#required-delivery-date').val()
  const shipToAccVal = $('#ship-to-account-select').val()

  validateShipping(orderForm, poVal, requiredDeliveryDateVal, shipToAccVal)

  if (
    [requiredDeliveryDateVal, shipToAccVal].filter(
      (input: string) => !input || input.length < 1
    ).length > 0
  ) {
    return
  }

  if (!isPunchoutSession(orderForm) && (!poVal || poVal.length > 20)) {
    return
  }

  const $button = $('#submit-shipping-info')

  $button.prop('disabled', true)
  $button.html(LOADER)
  $.post(
    `${serviceBaseUrl()}/_v/private/orderForm/shipping-information`,
    JSON.stringify({
      shipTo: shipToAccVal,
      poNumber: poVal,
      requiredDeliveryDate: requiredDeliveryDateVal,
    })
  )
    .done(function (data: any) {
      $('#submit-shipping-info').html(SHIPPING_BUTTON_TEXT)
      $(window).trigger('orderFormUpdated.vtex', [data.orderForm])
    })
    .fail(() => {
      $('#submit-shipping-info').html(SHIPPING_BUTTON_TEXT)
    })
}

// export function termsAndConditions() {
//   const modalTemplate = `
//   <div class="modal-header">
//     <h3 id="paymentModalLabel">Terms and Conditions</h3>
//   </div>
//   <div class="modal-body">
//     <div class="flex flex-row">
//         <input style="margin:0.5rem" type="checkbox" name="agree" id="agree1" onchange="handleOnChange()" />
//         I agree to the
//         <a href="https://www.stanleyengineeredfastening.com/support/terms-and-conditions" target="_blank">Terms and Conditions</a>
//     </div>
//   </div>
//   <div class="modal-footer">
//     <button onclick="handleOnChange()" id="agree-submit" disabled="" data-dismiss="modal" class="btn btn-success">
//         I Agree</button>
//   </div>
//   `

//   const modalDiv = document.createElement('div')

//   modalDiv.setAttribute('id', 'paymentModal')
//   modalDiv.setAttribute('class', 'modal hide fade')
//   modalDiv.setAttribute('tabindex', '-1')
//   modalDiv.setAttribute('role', 'dialog')
//   modalDiv.setAttribute('aria-labelledby', 'paymentModalLabel')
//   modalDiv.setAttribute('aria-hidden', 'true')
//   modalDiv.setAttribute('data-backdrop', 'static')
//   modalDiv.innerHTML = modalTemplate
//   document.body.appendChild(modalDiv)
//   $('#paymentModal').modal('show')

//   const $agreeButton = $('#agree-submit')

//   $agreeButton.click(handleOnChange)

//   const $agreeCheckBox = $('#agree1')

//   $agreeCheckBox.click(handleOnChange)

//   function handleOnChange() {
//     if (($('#agree1').prop('checked') as boolean) === true) {
//       $('#agree-submit').attr('disabled', false)
//     } else {
//       $('#agree-submit').attr('disabled', true)
//     }
//   }
// }
