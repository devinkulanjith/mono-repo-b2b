import { serviceBaseUrl } from './utils'
import {
  getSchedulesDeliveryDatesWithQuantitiesForItem,
  getSimulationDataForItem,
} from './cart'
import { formattedPrice, getTaxesFromSimulation } from './orderForm'

export const removeMiniCartLoader = () => {
  $(`.mini-cart .cart-items`).addClass('v-loaded')
}

export const changeMinicartContent = () => {
  const $backToCartButton = $('#orderform-minicart-to-cart')

  $backToCartButton.attr('href', `${window.location.pathname}#/cart`)
  $backToCartButton.text('Review order details')
}

export const addMinicart = (orderForm: any) => {
  const customData = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields

  const parsedSimulationData = JSON.parse(customData?.simulationData ?? '{}')
  const decimalDivider =
    orderForm.storePreferencesData.currencyFormatInfo.currencyDecimalDigits ?? 2

  const template = `
  <div class="cart visible">
    <ul class="cart-items unstyled clearfix">
      ${orderForm.items
        .map((item: any, index: number) => {
          const simulationData = getSimulationDataForItem(
            parsedSimulationData,
            index
          )

          const appliedPrice = simulationData?.originalLineTotal

          const price =
            simulationData && appliedPrice
              ? formattedPrice(appliedPrice / 10 ** decimalDivider, orderForm)
              : 'N/A'

          const deliveryDates =
            getSchedulesDeliveryDatesWithQuantitiesForItem(simulationData)

          const parsedItemMetadata = JSON.parse(
            customData?.itemMetadata ?? '[]'
          )

          const metadataForItem = parsedItemMetadata.find(
            (md: any, mdIndex: number) => index === mdIndex
          )

          return `
        <li class="hproduct item muted" data-sku="${item.id}">
        <a
          href="${serviceBaseUrl()}/${item.detailUrl}" class="url"> <img
          height="45" width="45"
          class="photo"
          src="${item.imageUrl}"
          alt="${item.name}"
          id="hproduct-item-${item.id}"> </a>
        <span class="fn product-name"
              title="${item.name}"
              href="${serviceBaseUrl()}/${item.detailUrl}">${item.name}</span>
        <span class="quantity badge">${
          item.quantity * item.unitMultiplier
        }</span>
        <div class="description">
          <div class="delivery-date-list">
            ${
              deliveryDates.length > 0
                ? deliveryDates
                    .map(
                      (deliveryDate: string) => `
            <span class="shipping-date pull-left">${
              simulationData.deliveryDateExactMatch ? '' : 'Std Lead Time: '
            }${deliveryDate}</span>
          `
                    )
                    .join('')
                : 'Delivery date unavailable'
            }
          </div>
<!--          <strong class="item-price pull-right hide">£ 1.00</strong>-->
<!--          <strong class="item-price-subtotal pull-right hide">£ 1.00</strong>-->
          <strong class="price pull-right">${price}</strong>
<!--          <strong class="price-subtotal pull-right hide">£ 1,359.50</strong>-->
        </div>
        ${
          metadataForItem?.smallPack
            ? '<div class="small-pack-disclaimer">Disclaimer: Delivery times may vary for this product. After placing the order, you will receive a final delivery confirmation email from our customer service team.</div>'
            : ''
        }
      </li>
      `
        })
        .join('')}
    </ul>
</div>
  `

  $('.summary-cart-template-holder').html(template)
}

export const addTotalizers = (orderForm: any) => {
  const decimalDivider =
    orderForm.storePreferencesData.currencyFormatInfo.currencyDecimalDigits ?? 2

  const customData = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields

  const simulationData = customData?.simulationData
  const parsedSimulationData = JSON.parse(simulationData ?? '{}')

  const price = parsedSimulationData?.total
    ? formattedPrice(
        parsedSimulationData?.total / 10 ** decimalDivider,
        orderForm
      )
    : 'N/A'

  const taxes = getTaxesFromSimulation(orderForm)

  const template = `
    <div class="forms coupon-column summary-coupon-wrap text-center visible" style="">
      <div class="coupon summary-coupon" style="">
<!--        <form class="coupon-form" action="">-->
<!--          <fieldset class="coupon-fieldset">-->
<!--            <div style="display: none;">-->
<!--              <p class="coupon-label">-->
<!--                <label for="cart-coupon">Coupon code</label>-->
<!--              </p>-->
<!--              <p class="coupon-fields">-->
<!--                <span>-->
<!--                  <input type="text" id="cart-coupon" class="coupon-value input-small" placeholder="Coupon Code" />-->
<!--                  <i class="loading-inline icon-spinner icon-spin loading-coupon" style="opacity: 0;">-->
<!--                    <span>Please, wait...</span>-->
<!--                  </i>-->
<!--                  <button type="submit" id="cart-coupon-add" class="btn">Add</button>-->
<!--                </span>-->
<!--                <span class="info" style="display: none;">-->
<!--                  <span></span>-->
<!--                  <small class="delete">-->
<!--                    <a href="javascript:void(0);" id="cart-coupon-remove">Delete</a>-->
<!--                  </small>-->
<!--                </span>-->
<!--              </p>-->
<!--            </div>-->
<!--            <p class="coupon-data" style="display: block;">-->
<!--              <a class="link-coupon-add" href="javascript:void(0);" id="cart-link-coupon-add">-->
<!--                <span>Add</span>-->
<!--                <span>coupon code</span>-->
<!--              </a>-->
<!--            </p>-->
<!--          </fieldset>-->
<!--        </form>-->
      </div>
    </div>
    <div class="visible">
      <div class="accordion-group" style="display: block;">
        <div class="accordion-heading">
          <span class="accordion-toggle collapsed">Summary</span>
        </div>
        <div class="accordion-body collapse in">
          <div class="accordion-inner">
<!--            <div class="summary-discount-descriptions" style="">-->
<!--              <h3 class="summary-discount-title">Discounts</h3>-->
<!--              <ul class="all-discount-descriptions unstyled">-->
<!--                <li class="discount-descriptions-item">-->
<!--                  <strong class="discount-name">new</strong>-->
<!--                  <span class="discount-description">These are the new items added</span>-->
<!--                </li>-->
<!--              </ul>-->
<!--            </div>-->
            <table class="table">
<!--              <tbody class="totalizers-list">-->
<!--                <tr class="Items">-->
<!--                  <td class="info">Subtotal</td>-->
<!--                  <td class="space"></td>-->
<!--                  <td class="monetary">20&nbsp;001,60 €</td>-->
<!--                  <td class="empty"></td>-->
<!--                </tr>-->
<!--                <tr class="Discounts">-->
<!--                  <td class="info">Discounts</td>-->
<!--                  <td class="space"></td>-->
<!--                  <td class="monetary">11&nbsp;256,86 €</td>-->
<!--                  <td class="empty"></td>-->
<!--                </tr>-->
<!--                <tr class="srp-summary-result hide">-->
<!--                  <td class="info">-->
<!--                    Shipping-->
<!--                  </td>-->
<!--                  <td class="space"></td>-->
<!--                  <td class="monetary">Free</td>-->
<!--                  <td class="empty"></td>-->
<!--                </tr>-->
<!--                <tr class="Shipping">-->
<!--                  <td class="info">-->
<!--                      <span class="postal-code-for-sla">-->
<!--                        <span class="shipping-name">Shipping</span>-->
<!--                        <span class="shipping-name-to">to</span>-->
<!--                        <span class="postal-code-value">90680</span>-->
<!--                        <a href="javascript:void(0);" class="cart-reset-postal-code" id="cart-reset-postal-code"-->
<!--                           title="Edit">-->
<!--                          <i class="icon-remove-sign"></i>-->
<!--                        </a>-->
<!--                      </span>-->
<!--                    <span class="shipping-selected-sla-estimate" id="Normal">Up to 3 business days</span>-->
<!--                  </td>-->
<!--                  <td class="space"></td>-->
<!--                  <td class="monetary">Free</td>-->
<!--                  <td class="empty"></td>-->
<!--                </tr>-->
<!--              </tbody>-->
<!--              <tbody class="shipping-reset" style="display: none;">-->
<!--                <tr>-->
<!--                  <td class="info">-->
<!--                    <span class="postal-code-for-sla">-->
<!--                      <span class="shipping-name">Shipping</span>-->
<!--                      <span class="shipping-name-to">to</span>-->
<!--                      <span class="postal-code-value">90680</span>-->
<!--                      <a href="javascript:void(0);" class="cart-reset-postal-code" id="cart-reset-postal-code" title="Edit">-->
<!--                        <i class="icon-remove-sign"></i>-->
<!--                      </a>-->
<!--                      <br>-->
<!--                      <a href="javascript:void(0);" class="cart-reset-postal-code" id="cart-reset-postal-code">-->
<!--                        Choose another postal code-->
<!--                      </a>-->
<!--                    </span>-->
<!--                  </td>-->
<!--                  <td class="space"></td>-->
<!--                  <td class="monetary shipping-unavailable">unavailable</td>-->
<!--                </tr>-->
<!--              </tbody>-->
<!--              <tbody class="shipping-calculate" style="display: none;">-->
<!--                <tr>-->
<!--                  <td class="info"><span>Shipping</span></td>-->
<!--                  <td class="space" style="display: none;"></td>-->
<!--                  <td class="monetary" style="display: none;">-->
<!--                    <a id="shipping-calculate-link" class="shipping-calculate-link" href="javascript:void(0)">Calculate</a>-->
<!--                  </td>-->
<!--                  <td class="monetary form-postal-code forms" colspan="3" style="display: none;">-->
<!--                    <div class="shipping summary-shipping">-->
<!--                      <form class="shipping-form-inline" action="">-->
<!--                        <fieldset class="shipping-fieldset">-->
<!--                          <div class="shipping-fields">-->
<!--                            <input type="tel" id="summary-postal-code" class="postal-code input-mini" maxlength="9" />-->
<!--                            <i class="loading-inline icon-spinner icon-spin" style="opacity: 0;">-->
<!--                              <span data-i18n="cart.wait">Please, wait...</span>-->
<!--                            </i>-->
<!--                            <button type="submit" id="cart-shipping-calculate" class="btn">Calculate</button>-->
<!--                          </div>-->
<!--                          <small class="postal-code-service summary-postal-code-service">-->
<!--                            <a id="cart-dont-know-postal-code" target="_blank" href="#">I don't know my postal code</a>-->
<!--                          </small>-->
<!--                        </fieldset>-->
<!--                      </form>-->
<!--                    </div>-->
<!--                  </td>-->
<!--                  <td class="empty" style="display: none;"></td>-->
<!--                </tr>-->
<!--              </tbody>-->
              <tbody class="totalizers-list">
                ${taxes
                  .map(
                    (tax: any) => `
                  <tr class="Discounts visible">
                    <td class="info">${tax.name}</td>
                    <td class="space"></td>
                    <td class="monetary">${tax.value}</td>
                    <td class="empty"></td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
              <tfoot>
                <tr class="">
                  <td class="info">Total</td>
                  <td class="space"></td>
                  <td class="monetary">${price}</td>
                  <td class="empty"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  `

  $('.totalizers.summary-totalizers.cart-totalizers').html(template)
}
