import { UserInputError } from '@vtex/api'

import type { OrderForm } from '../../typings/orderForm'
import type { SapOrderRequest } from '../../typings/sap'
import type { CL, OrgAccount } from '../../typings/vtexShipping'
import type { SandboxResponseType } from '../../typings/common'
import { isPunchoutSession } from '../../modules/soldToAccounts'

export const parseVtexToSap = (
  orderForm: OrderForm,
  soldToAccount: OrgAccount,
  shipToAccount: OrgAccount,
  clUser: Omit<CL, 'userId'>,
  sandboxResponseType?: SandboxResponseType
): SapOrderRequest => {
  const appData = orderForm.customData?.customApps.find(
    app => app.id === 'checkout-simulation'
  )

  if (!appData) {
    throw new UserInputError('Customer information invalid!')
  }

  return {
    ...(isPunchoutSession(orderForm) && {
      customerPO: appData.fields.poNumber,
    }),
    soldToPartnerRole: soldToAccount.partnerRole,
    soldToCustomerNumber: soldToAccount.customerNumber,
    shipToPartnerRole: shipToAccount.partnerRole,
    shipToCustomerNumber: shipToAccount.customerNumber,
    orderDocType: 'ZOR',
    salesOrganization: soldToAccount.salesOrganizationCode ?? '',
    distributionChannel: '10',
    division: 'ZZ',
    requestedDeliveryDate: appData.fields.requiredDeliveryDate,
    poType: 'ZVTX',
    shipToPO: clUser.email,
    shipToReference: clUser.firstName ?? '',
    currency: orderForm.storePreferencesData.currencyCode,
    sandboxExpectedResponseType: sandboxResponseType,
    items: orderForm.items.map((item, index) => ({
      itemLine: index + 1,
      // baseUnitOfMeasure: item.measurementUnit,
      itemReqDeliveryDate: appData.fields.requiredDeliveryDate,
      quantity: item.quantity * item.unitMultiplier,
      productRefId: item.refId,
    })),
  }
}
