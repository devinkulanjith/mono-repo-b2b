import { serviceBaseUrl } from './utils'

export const addPunchoutForm = (orderForm: any) => {
  const customData = (orderForm.customData?.customApps ?? []).find(
    (app: any) => app.id === 'checkout-simulation'
  )?.fields

  if (
    (customData?.simulationCompletedAt ?? '').length === 0 ||
    (customData?.simulationData ?? '').length === 0 ||
    $('form.punch-back-form').length > 0
  ) {
    return
  }

  $.post(`${serviceBaseUrl()}/_v/private/punchout-form`)
    .done((data: any) => {
      const $payButtons = $('.payment-submit-wrap button')

      if (!data.showForm) {
        $payButtons.last().attr('style', 'display: inline-block !important')

        return
      }

      $payButtons.last().attr('style', 'display: none !important')
      const $form =
        $(`<form id="punch-back-form" class="punch-back-form" action="https://qa-connect.punchout2go.com/gateway/link/punchin/id/${data.punchoutSessionKey}" method="post" target="_self">
          <input type="hidden" name="params" value="${data.formEncoded}" />
          <button type="submit" class="submit btn btn-success btn-large btn-block">Transfer Cart</button>
        </form>`)

      if ($('form.punch-back-form').length === 0) {
        $('.payment-confirmation-wrap').append($form)
      }
    })
    .fail(() => {
      $('.payment-submit-wrap button')
        .last()
        .attr('style', 'display: inline-block !important')
    })
}
