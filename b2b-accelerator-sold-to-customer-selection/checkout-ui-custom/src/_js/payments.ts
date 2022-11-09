import { getTaxesFromSimulation } from './orderForm'

export type Payment = {
  paymentSystem: string
}

export const condensedTaxes = (orderForm: any) => {
  const customTax = getTaxesFromSimulation(orderForm)

  if (!customTax || customTax.length < 1) {
    return false
  }

  const tooltip = `
      <div class="vcustom-customTax-resume">
       ${customTax
         .map(
           (i: any) =>
             `<p class="vcustom-customTax-resume__i"><span class="n">${
               i.name
             }</span><span class="v">${
               orderForm.storePreferencesData.currencySymbol
             } ${(i.value / 100).toFixed(2)}</span></p>`
         )
         .join('')}
      </div>
    `

  const customTaxElem = $('tr.CustomTax.CustomTax--total')

  if (customTaxElem.length) {
    customTaxElem.find('.vcustom-customTax-tot').remove()
    customTaxElem
      .find('.info')
      .append(
        `<div class="vcustom-customTax-tot"><span>?</span> ${tooltip}</div>`
      )
  }
}

export const changePaymentContent = () => {
  $('[id="payment-data-submit"]').text('Place Order')
}

export const changePaymentConfirmationContent = () => {
  $('[id="payment-confirmation-message-container"]').text('One moment while we process your order.')
}
