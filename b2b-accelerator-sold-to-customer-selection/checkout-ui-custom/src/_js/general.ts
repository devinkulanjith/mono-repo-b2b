export const buildVertical = () => {
  $('body').addClass('body-cart-vertical')
  $('.cart-template .cart-links-bottom:eq(0)').appendTo(
    '.cart-template > .summary-template-holder'
  )
  $(
    '.cart-template .cart-more-options:eq(0), .cart-template .extensions-checkout-buttons-container'
  ).appendTo('.cart-template-holder')
}

export const addEditButtonInLogin = () => {
  $('#v-custom-edit-login-data').remove()
  // Important: Original -> title="${this.lang ? this.lang.editLabel:true}"
  $('.client-pre-email h3.client-pre-email-h span').append(`
      <a id="v-custom-edit-login-data" class="link-box-edit btn btn-small" style="" title="true">
        <i class="icon-edit"></i>
        <i class="icon-spinner icon-spin icon-3x"></i>
      </a>
    `)
}

export const initializeElements = () => {
  // Important: Required for all styling in checkout
  const $body = $('body')

  $body.addClass('v-custom-loaded')
  $body.addClass('js-vcustom-hideEmailStep')
  buildVertical()
}

export const initializeElementsOnAjax = () => {
  if (!$('.custom-cart-template-wrap').length) {
    $('.cart-template.mini-cart .cart-fixed > *').wrapAll(
      '<div class="custom-cart-template-wrap">'
    )
  }

  $('.table.cart-items tbody tr.product-item').each(function (w) {
    if ($(this).find('.v-custom-product-item-wrap').length > 0) {
      return false
    }

    $(this).find('> *').wrapAll(`<div class="v-custom-product-item-wrap">`)
  })
  $('#cart-to-orderform').text('Get Price and Availability')
}
