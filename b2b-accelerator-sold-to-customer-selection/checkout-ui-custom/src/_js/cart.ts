import { lcm } from './algebra'
import type { OrderFormItem } from './typings'
import { validateOrderForm } from './simulation'
import { serviceBaseUrl } from './utils'
import { changeValue } from './itemQuantity'
import { formattedPrice } from './orderForm'

declare const $: any

export const forceHidePricing = () => {
  $('td.product-price').html(`<span class="new-product-price">N/A</span>`)
  $('.totalizers td.monetary').text('N/A')
  $('.mini-cart .price').text('N/A')
  $('.cart-template .price').text('N/A')
}

export const forceHideDeliveryDate = () => {
  $('.collapse-delivery-date .shipping-date').text('Delivery date unavailable')
}

export const hideRealPricing = (orderForm: any) => {
  const appData = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields

  if (!appData?.simulationCompletedAt || !appData?.simulationData) {
    forceHidePricing()
  }
}

export const removeCloneOption = () => {
  $('.clone-item-container').remove()
  $('.clone-item-sep').remove()
  $('.clone-item').remove()
}

export const getSimulationDataForItem = (
  parsedSimulationData: any,
  index: number
) =>
  (parsedSimulationData.items ?? []).find(
    (simulatedItem: any) => simulatedItem.itemLine === index
  )

export const unitMultiplierAndMinimumQuantity = (
  item: OrderFormItem,
  customUnitMultiplier: number,
  customMinOrderQuantity: number
) => {
  const unitMultiplier = lcm(item.unitMultiplier, customUnitMultiplier)
  let adjustedMinimumQty = customMinOrderQuantity

  if (
    customMinOrderQuantity >= unitMultiplier &&
    customMinOrderQuantity % unitMultiplier === 0
  ) {
    adjustedMinimumQty = customMinOrderQuantity
  } else if (
    customMinOrderQuantity < unitMultiplier &&
    unitMultiplier % customMinOrderQuantity === 0
  ) {
    adjustedMinimumQty = unitMultiplier
  } else {
    adjustedMinimumQty =
      customMinOrderQuantity +
      (unitMultiplier - (customMinOrderQuantity % unitMultiplier))
  }

  return [
    unitMultiplier,
    adjustedMinimumQty,
    item.unitMultiplier,
    item.quantity,
  ]
}

export const getSchedulesDeliveryDateForItem = (
  item: any,
  prefix?: string,
  defaultValue?: string
) =>
  item?.schedules
    ? `${prefix}${item.schedules
        .map((schedule: any) => schedule.deliveryDate)
        .join(', ')}`
    : defaultValue

export const getSchedulesDeliveryDatesWithQuantitiesForItem = (item: any) =>
  (item?.schedules ?? []).map(
    (schedule: any) =>
      `${schedule.confirmedQuantity} ${schedule.salesUnitOfMeasure} delivered by ${schedule.deliveryDate}`
  )

export const addMetadata = (orderForm: any) => {
  const customData = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields

  const decimalDivider =
    orderForm.storePreferencesData.currencyFormatInfo.currencyDecimalDigits ?? 2

  const parsedItemMetadata = JSON.parse(customData?.itemMetadata ?? '[]')
  const parsedSimulationData = JSON.parse(customData?.simulationData ?? '{}')

  $('tr.product-item').each(function (index: number) {
    const itemId = $(this).data('sku')

    const metadata = parsedItemMetadata.find(
      (item: any) => item.id === itemId.toString()
    )

    const simulationData = getSimulationDataForItem(parsedSimulationData, index)
    const appliedPrice = simulationData?.originalLineTotal

    const price =
      simulationData && appliedPrice
        ? formattedPrice(appliedPrice / 10 ** decimalDivider, orderForm)
        : 'N/A'

    $(this).find('td.product-price').text(price)

    if ($(`#item-${itemId}-metadata-${index}`).length > 0) {
      return
    }

    const deliveryDates =
      getSchedulesDeliveryDatesWithQuantitiesForItem(simulationData)

    const $metadataElement =
      $(`<small id="item-${itemId}-metadata-${index}" class="seller item-metadata muted">
        <div>
          <span>Customer SKU: </span>
          <span>${metadata?.customerItem ?? 'N/A'}</span>
        </div>
        <div>
          <span>Unit of Measurement: </span>
          <span>${metadata?.unitOfMeasure ?? 'EA'}</span>
        </div>
        <div>
          <span>Unit Multiplier: </span>
          <span>${metadata?.unitMultiplier ?? 1}</span>
        </div>
        <div>
          <span>Minimum Order Quantity: </span>
          <span>${metadata?.minimumOrderQuantity ?? 1}</span>
        </div>
        <div>
          <span>Total Line Quantity: </span>
          <span class="item-simulation-data" id="quantity-${itemId}-metadata-${index}">
            ${simulationData?.quantity ?? 'N/A'}
          </span>
        </div>
        <div>
          <span>Total Line Value: </span>
          <span class="item-simulation-data" id="line-value-${itemId}-metadata-${index}">${price}</span>
        </div>
        <div>
          <div class="accordion" id="delivery-date-${itemId}-metadata-${index}-accordion">
            <div class="accordion-group">
              <div class="accordion-heading">
                <a class="accordion-toggle delivery-date-accordion-toggle" data-toggle="collapse" data-parent="#delivery-date-${itemId}-metadata-${index}-accordion" href="#delivery-date-${itemId}-metadata-${index}-accordion-collapse">
                  View Delivery Info <i class="icon-plus-sign"></i>
                </a>
              </div>
              <div id="delivery-date-${itemId}-metadata-${index}-accordion-collapse" class="accordion-body collapse in collapse-delivery-date">
                <div class="accordion-inner">
                  ${
                    deliveryDates.length > 0
                      ? deliveryDates
                          .map(
                            (deliveryDate: string) => `
            <span class="shipping-date pull-left">${
              simulationData.deliveryDateExactMatch
                ? ''
                : 'Std Lead Time:<br />'
            }${deliveryDate}</span>
          `
                          )
                          .join('')
                      : 'Delivery date unavailable'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </small>`)

    $(this)
      .find('td.product-name a.sku-selector-button')
      .before($metadataElement)
  })
}

export const initializeDeliveryDates = () => {
  $('.collapse.collapse-delivery-date').collapse('hide')
}

// export const addDeliveryDate = (orderForm: any) => {
//   const itemInputs = orderForm.customData?.customApps.find(
//     (app: any) => app.id === 'checkout-simulation'
//   )?.fields.itemInputs
//
//   const parsedItemInputs = JSON.parse(itemInputs)
//
//   $('tr.product-item').each(function (index: number) {
//     const itemId = $(this).data('sku')
//     const itemInput = parsedItemInputs.find(
//       (parsedInput: any) => parsedInput.index === index
//     )
//
//     const $itemReqDeliveryDate = $(
//       `<input type="text" id="requested-delivery-date-${index}" value="${itemInput.requestedDeliveryDate}">`
//     )
//
//     $(this).find('td.product-name').append($itemReqDeliveryDate)
//     $itemReqDeliveryDate
//       .datepicker({
//         autoclose: true,
//         format: 'yyyy-mm-dd',
//         startDate: '0d',
//       })
//       .on('changeDate', function (e: any) {
//         $.post(``)
//       })
//   })
// }

export const resetCartSimulationData = (itemId: string, index: number) => {
  $(`#quantity-${itemId}-metadata-${index}`).text('N/A')
  $(`#line-value-${itemId}-metadata-${index}`).text('N/A')
  $(`#delivery-date-${itemId}-metadata-${index}`).text('N/A')
}

export const resetAllSimulationData = () => {
  $('.item-simulation-data').text('N/A')
}

export const updateQuantitySelector = (orderForm: any) => {
  const itemMetadata = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields.itemMetadata

  if (!itemMetadata || window.location.hash !== '#/cart') {
    return
  }

  const parsedItemMetadata = JSON.parse(itemMetadata)

  // const $cartRows = $('tr.product-item td.quantity input')

  const element = setInterval(function () {
    if ($('tr.product-item td.quantity > input').length) {
      clearInterval(element)
      $('tr.product-item td.quantity > input').each(function (index: number) {
        const quantityId = $(this).attr('id')
        const [, itemId] = quantityId.match(/(?:-)(\d+)$/)

        const metadata = parsedItemMetadata.find(
          (item: any) => item.itemIndex === index
        )

        const minimumOrderQuantity =
          parseInt(metadata.minimumOrderQuantity, 10) ?? 1

        const unitOfMeasure = metadata.unitOfMeasure ?? 'N/A'

        const ofItem = orderForm.items.find(
          (item: any, itemIndex: number) => index === itemIndex
        )

        if (!ofItem) {
          return
        }

        const [
          calculatedUnitMultiplier,
          calculatedMinimumQuantity,
          itemUnitMultiplier,
        ] = unitMultiplierAndMinimumQuantity(ofItem, 1, minimumOrderQuantity)

        $(this)
          .parent()
          .find('.item-multiplier-label')
          .text(`${metadata.unitOfMeasure}`)

        const selectedQuantity =
          (ofItem?.quantity ?? 0) * calculatedUnitMultiplier

        // $(this).val(
        //   (selectedQuantity * itemUnitMultiplier) / calculatedUnitMultiplier
        // )

        // $(this).attr({ min: adjustedMinimumQty, step: unitMultiplier })
        if (
          $(`#custom-quantity-input-wrapper-${itemId}-${index}`).length === 0
        ) {
          const $customInput =
            $(`<div id="custom-quantity-input-wrapper-${itemId}-${index}" class="custom-quantity-input-wrapper">
          <a class="item-quantity-change item-quantity-change-decrement" id="custom-item-quantity-change-decrement-${itemId}-${index}">
            <i class="icon icon-minus-sign"></i>
            <span class="hide item-quantity-change-decrement-text"></span>
          </a>
          <input type="tel" id="custom-update-quantity-${itemId}-${index}" value="${selectedQuantity}" />
          <a class="item-quantity-change item-quantity-change-increment" id="custom-item-quantity-change-increment-${itemId}-${index}">
            <i class="icon icon-plus-sign"></i>
            <span class="hide item-quantity-change-increment-text" ></span>
          </a>
        </div>`)

          $(document).on(
            'change',
            `#custom-update-quantity-${itemId}-${index}`,
            function (e: any) {
              const $quantityInput = $(
                `#custom-update-quantity-${itemId}-${index}`
              )

              const [validatedValue, displayValue] = changeValue(
                e.target.value,
                e,
                calculatedMinimumQuantity / calculatedUnitMultiplier,
                999999999,
                calculatedMinimumQuantity / calculatedUnitMultiplier,
                unitOfMeasure,
                calculatedUnitMultiplier,
                true
              )

              const updateItem = {
                index,
                // quantity: updatedNewValue / calculatedUnitMultiplier,
                quantity: validatedValue,
              }

              $.ajax({
                type: 'POST',
                url: `${serviceBaseUrl()}/api/checkout/pub/orderForm/${
                  orderForm.orderFormId
                }/items/update`,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                  orderItems: [updateItem],
                  noSplitItem: true,
                }),
                success: (_updatedOrderForm: any) => {
                  // $(window).trigger('orderFormUpdated.vtex', [updatedOrderForm])
                  $quantityInput.val(
                    (validatedValue as number) * calculatedUnitMultiplier
                  )
                  validateOrderForm()
                  // $(window).trigger('orderFormUpdated.vtex', [updatedOrderForm])
                  resetAllSimulationData()
                  forceHideDeliveryDate()
                  forceHidePricing()
                },
                error: (error: any) => {
                  console.error(error)
                },
              })
            }
          )

          $(document).on(
            'click',
            `#custom-item-quantity-change-increment-${itemId}-${index}`,
            function (e: any) {
              const $quantityInput = $(
                `#custom-update-quantity-${itemId}-${index}`
              )

              const itemCurrentQuantity = parseInt(
                $quantityInput.val() ?? '1',
                10
              )

              const updateItem = {
                index,
                quantity:
                  (itemCurrentQuantity + calculatedUnitMultiplier) /
                  calculatedUnitMultiplier,
              }

              $.ajax({
                type: 'POST',
                url: `${serviceBaseUrl()}/api/checkout/pub/orderForm/${
                  orderForm.orderFormId
                }/items/update`,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                  orderItems: [updateItem],
                  noSplitItem: true,
                }),
                success: (_updatedOrderForm: any) => {
                  $quantityInput.val(
                    itemCurrentQuantity + calculatedUnitMultiplier
                  )
                  // $(window).trigger('orderFormUpdated.vtex', [updatedOrderForm])
                  validateOrderForm()
                  resetAllSimulationData()
                  forceHidePricing()
                  forceHideDeliveryDate()
                },
                error: (error: any) => {
                  console.error(error)
                },
              })
            }
          )

          $(document).on(
            'click',
            `#custom-item-quantity-change-decrement-${itemId}-${index}`,
            function (e: any) {
              const $quantityInput = $(
                `#custom-update-quantity-${itemId}-${index}`
              )

              const itemCurrentQuantity = parseInt(
                $quantityInput.val() ?? '1',
                10
              )

              if (
                itemCurrentQuantity - calculatedUnitMultiplier <
                calculatedMinimumQuantity
              ) {
                console.warn(
                  `Minimum order quantity is ${calculatedMinimumQuantity}`
                )

                return
              }

              const updateItem = {
                index,
                quantity:
                  (itemCurrentQuantity - calculatedUnitMultiplier) /
                  calculatedUnitMultiplier,
              }

              $.ajax({
                type: 'POST',
                url: `${serviceBaseUrl()}/api/checkout/pub/orderForm/${
                  orderForm.orderFormId
                }/items/update`,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                  orderItems: [updateItem],
                  noSplitItem: true,
                }),
                success: (_updatedOrderForm: never) => {
                  $quantityInput.val(
                    itemCurrentQuantity - calculatedUnitMultiplier
                  )
                  // $(window).trigger('orderFormUpdated.vtex', [updatedOrderForm])
                  validateOrderForm()
                  resetAllSimulationData()
                  forceHidePricing()
                  forceHideDeliveryDate()
                },
                error: (error: never) => {
                  console.error(error)
                },
              })
            }
          )

          if (selectedQuantity < calculatedMinimumQuantity) {
            const updateItem = {
              index,
              quantity: calculatedMinimumQuantity / calculatedUnitMultiplier,
            }

            $.ajax({
              type: 'POST',
              url: `${serviceBaseUrl()}/api/checkout/pub/orderForm/${
                orderForm.orderFormId
              }/items/update`,
              dataType: 'json',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify({
                orderItems: [updateItem],
                noSplitItem: true,
              }),
              success: (_updatedOrderForm: never) => {
                // $(window).trigger('orderFormUpdated.vtex', [updatedOrderForm])
                $(`custom-update-quantity-${itemId}-${index}`).val(
                  calculatedMinimumQuantity
                )
                validateOrderForm()
                // $(window).trigger('orderFormUpdated.vtex', [updatedOrderForm])
                forceHidePricing()
                forceHideDeliveryDate()
              },
              error: (error: never) => {
                console.error(error)
              },
            })
          } else {
            $(`custom-update-quantity-${itemId}-${index}`).val(selectedQuantity)
          }

          $(this).parent().append($customInput)
        }
      })
    }
  }, 200)
}

export const fixChooseProduct = () => {
  const baseUrl = serviceBaseUrl()

  if (baseUrl.length > 0) {
    $('#cart-choose-products').attr('href', baseUrl)
  }
}

export const hideFreightMessage = () => {
  const $freightMessageCloseButton = $(
    '.vtex-front-messages-template.vtex-front-messages-type-warning.vtex-front-messages-template-opened.vtex-front-messages-close-all.close'
  )

  if (
    ($freightMessageCloseButton.length &&
      $(
        `.vtex-front-messages-template.vtex-front-messages-type-warning.vtex-front-messages-template-opened.vtex-front-messages-close-all.close`
      )
        .find('.vtex-front-messages-detail')
        .text() === 'Freight value has changed') ||
    $freightMessageCloseButton.find('.vtex-front-messages-detail').text() ===
      'Freight type has changed'
  ) {
    $freightMessageCloseButton.length && $freightMessageCloseButton.hide()
  }

  const $freightMessageContainer = $(
    `.vtex-front-messages-template.vtex-front-messages-type-warning.vtex-front-messages-template-opened`
  )

  if (
    $freightMessageContainer.length &&
    ($freightMessageContainer.find('.vtex-front-messages-detail').text() ===
      'Freight value has changed' ||
      $freightMessageContainer.find('.vtex-front-messages-detail').text() ===
        'Freight type has changed')
  ) {
    $freightMessageContainer.length && $freightMessageContainer.hide()
  }

  const $freightMessagePlaceholder = $(
    `.vtex-front-messages-placeholder.vtex-front-messages-placeholder-opened`
  )

  if (
    $freightMessagePlaceholder.length &&
    ($freightMessagePlaceholder.find('.vtex-front-messages-detail').text() ===
      'Freight value has changed' ||
      $freightMessagePlaceholder.find('.vtex-front-messages-detail').text() ===
        'Freight type has changed')
  ) {
    $freightMessagePlaceholder.length && $freightMessagePlaceholder.hide()
  }
}

export const updateCertificationName = () => {
  const checkExist = setInterval(function () {
    const $certificationsLabel = $('a:contains("Add JDE Certifications")')

    if ($certificationsLabel.length) {
      $certificationsLabel.text('Add Certifications')

      clearInterval(checkExist)
    }
  }, 200)
}
