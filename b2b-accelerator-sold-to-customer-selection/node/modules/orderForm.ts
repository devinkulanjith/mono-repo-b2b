import { UserInputError } from '@vtex/api'

import type { OrderFormItem } from '../typings/orderForm'
import {
  acronymCustomerItemAssignment,
  acronymSalesAccount,
} from '../utils/masterdata'
import type { OrgAccount } from '../typings/vtexShipping'
import type { CustomerItemAssignment } from '../typings/masterdata'
import { getOrgAccountAsString } from '../utils/orgAccounts'
import { getShipToAccountsForSoldTo } from './soldToAccounts'
import type { ProductResponse } from '../clients/searchGraphQL/productQuery'

type WithMetadata<T> = T & {
  unitOfMeasure: string
  unitMultiplier: number
  minimumOrderQuantity: number
  customerItem: string
  sapcert?: string
  custsku?: string
  smallPack: boolean
}

type CertificateType =
  | '2.2 - C - M - LQ'
  | '2.2 - COC - LQ'
  | '2.2 - LOT'
  | '3.1'
  | 'COC - LOT- Q'
  | 'MAT'
  | 'MAT - COC - LQ'

export const getCertificationId = (certificateType?: CertificateType) => {
  if (!certificateType) {
    return ''
  }

  const certifications = {
    '2.2 - C - M - LQ': 'C1',
    '2.2 - COC - LQ': 'C2',
    '2.2 - LOT': 'C3',
    '3.1': 'C4',
    'COC - LOT- Q': 'C5',
    MAT: 'C6',
    'MAT - COC - LQ': 'C7',
  }

  return certifications[certificateType]
}

type JdeCertificateType = 'CC' | 'MC'

export const getCertificationIdForJde = (
  certificateType?: JdeCertificateType
) => {
  if (!certificateType) {
    return ''
  }

  const certifications = {
    CC: 'CC',
    MC: 'MC',
  }

  return certifications[certificateType]
}

export const getUnitOfMeasure = (
  productInfo: ProductResponse,
  targetSystem: string
) => {
  const propUom =
    targetSystem === 'JDE' ? 'JDE Unit of Measure' : 'Unit of Measure'

  return (
    productInfo.properties
      .find(property => property.originalName === propUom)
      ?.values.find(value => value) ?? 'EA'
  )
}

export const updateItemMetadata = async (orderFormId: string, ctx: Context) => {
  const {
    clients: {
      checkout: checkoutClient,
      searchGraphQL: searchGraphQlClient,
      masterdata: mdClient,
    },
  } = ctx

  const orderForm = await checkoutClient.orderForm(orderFormId!)
  const { items } = orderForm

  const targetSystem = orderForm.customData?.customApps.find(
    app => app.id === 'checkout-simulation'
  )?.fields.targetSystem

  if (!targetSystem) {
    throw new UserInputError('Target system not set!')
  }

  const outdatedItemMetadata = JSON.parse(
    (orderForm.customData?.customApps ?? []).find(
      app => app.id === 'checkout-simulation'
    )?.fields.itemMetadata ?? '[]'
  ) as Array<WithMetadata<OrderFormItem>>

  // TODO: This may not be required, as we already have this information in the order form.
  const soldToAccount = await mdClient.getDocument<OrgAccount>({
    dataEntity: acronymSalesAccount,
    id:
      (orderForm.customData?.customApps ?? []).find(
        app => app.id === 'checkout-simulation'
      )?.fields.soldToCustomerNumber ?? '',
    fields: [
      'id',
      'salesOrganizationCode',
      'corporateName',
      'customerNumber',
      'street',
      'city',
      'state',
      'postalCode',
      'country',
      'receiverName',
    ],
  })

  let shipToAccount
  const shipToCustomerNumber =
    (orderForm.customData?.customApps ?? []).find(
      app => app.id === 'checkout-simulation'
    )?.fields.shipToCustomerNumber ?? ''

  if (shipToCustomerNumber && shipToCustomerNumber.length > 0) {
    // TODO: This may not be required, as we already have this information in the order form.
    shipToAccount = await mdClient.getDocument<OrgAccount>({
      dataEntity: acronymSalesAccount,
      id: shipToCustomerNumber,
      fields: [
        'id',
        'corporateName',
        'customerNumber',
        'street',
        'city',
        'state',
        'postalCode',
        'country',
        'receiverName',
      ],
    })
  }

  const allShipToAccounts = await getShipToAccountsForSoldTo(
    soldToAccount?.id,
    ctx.clients.masterdata
  )

  const itemPromises = items.map(async (item: OrderFormItem, index: number) => {
    let unitOfMeasure = outdatedItemMetadata.find(
      itemWithUom => itemWithUom.uniqueId === item.uniqueId
    )?.unitOfMeasure

    let unitMultiplier = outdatedItemMetadata.find(
      itemWithUom => itemWithUom.uniqueId === item.uniqueId
    )?.unitMultiplier

    let minimumOrderQuantity = outdatedItemMetadata.find(
      itemWithUom => itemWithUom.uniqueId === item.uniqueId
    )?.minimumOrderQuantity

    let smallPack = outdatedItemMetadata.find(
      itemWithUom => itemWithUom.uniqueId === item.uniqueId
    )?.smallPack

    let customerItem = outdatedItemMetadata.find(
      itemWithUom => itemWithUom.uniqueId === item.uniqueId
    )?.customerItem

    const custsku = outdatedItemMetadata.find(
      itemWithUom => itemWithUom.uniqueId === item.uniqueId
    )?.custsku

    let certification = outdatedItemMetadata.find(
      itemWithUom => itemWithUom.uniqueId === item.uniqueId
    )?.sapcert

    if (
      !unitOfMeasure ||
      !unitMultiplier ||
      !minimumOrderQuantity ||
      !customerItem ||
      !certification ||
      !custsku
    ) {
      const productInfo = await searchGraphQlClient.product(item.productId)

      const itemRefId =
        productInfo.items
          .find(itemInProd => item.id === itemInProd.itemId)
          ?.referenceId.find(refId => refId.Key === 'RefId')?.Value ?? ''

      customerItem = (
        await mdClient.searchDocuments<CustomerItemAssignment>({
          dataEntity: acronymCustomerItemAssignment,
          where: `((targetSystem=${targetSystem} OR (targetSystem is null)) AND customerNumber=${
            soldToAccount?.customerNumber ?? ''
          } AND skuRefId=${itemRefId})`,
          fields: ['customerSku', 'customerNumber', 'targetSystem', 'skuRefId'],
          sort: 'updatedIn DESC',
          pagination: { page: 1, pageSize: 1 },
        })
      ).find(ci => ci)?.customerSku

      unitOfMeasure = getUnitOfMeasure(productInfo, targetSystem)
      // TODO: Check whether both SAP and JDE should have this value from the sales organization.
      unitMultiplier = item.unitMultiplier
      minimumOrderQuantity = parseInt(
        productInfo.properties
          .find(property => property.originalName === 'Minimum Order Quantity')
          ?.values.find(value => value) ?? '1',
        10
      )
      smallPack =
        (productInfo.properties
          .find(property => property.originalName === 'SmallPack')
          ?.values.find(value => value) ?? 'False') === 'True'
    }

    certification =
      targetSystem === 'JDE'
        ? getCertificationIdForJde(
            item.attachments.find(
              attachment => attachment.name === 'JDE Certifications'
            )?.content['Certificate Type'] as JdeCertificateType
          )
        : getCertificationId(
            item.attachments.find(
              attachment => attachment.name === 'Certifications'
            )?.content['Certificate Type'] as CertificateType
          )

    return {
      itemIndex: index,
      uniqueId: item.uniqueId,
      id: item.id,
      productId: item.productId,
      unitOfMeasure,
      unitMultiplier,
      minimumOrderQuantity,
      smallPack,
      ...(certification ? { sapcert: certification } : {}),
      ...(customerItem ? { customerItem, custsku: customerItem } : {}),
    }
  })

  await Promise.all(itemPromises).then(itemsWithUom => {
    return checkoutClient.setOrderFormCustomData(
      orderFormId,
      'checkout-simulation',
      'itemMetadata',
      JSON.stringify(itemsWithUom)
    )
  })

  return {
    orderForm: await checkoutClient.orderForm(orderFormId, true),
    soldTo: {
      ...soldToAccount,
      address: getOrgAccountAsString(soldToAccount),
    },
    ...(shipToAccount
      ? {
          shipTo: {
            ...shipToAccount,
            address: getOrgAccountAsString(shipToAccount),
          },
        }
      : {}),
    allShipToAccounts: (allShipToAccounts ?? []).map(shipToAcc => ({
      ...shipToAcc,
      address: getOrgAccountAsString(shipToAcc),
    })),
  }
}

export const invalidateSimulationData = async (
  checkoutClient: Context['clients']['checkout'],
  orderFormId: string
) => {
  await checkoutClient.updateOrderFormShipping(orderFormId, {
    address: null,
    selectedAddresses: [],
  })
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'soldTo'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'soldToCustomerNumber'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'soldToInfo'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'shipTo'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'shipToCustomerNumber'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'shipToInfo'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'clientEmail'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'poNumber'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'requiredDeliveryDate'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'simulationData'
  )
  await checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'simulationCompletedAt'
  )

  return checkoutClient.removeOrderFormCustomData(
    orderFormId,
    'checkout-simulation',
    'targetSystem'
  )
}

export const emptyCart = async (
  checkoutClient: Context['clients']['checkout'],
  orderFormId: string
) => checkoutClient.removeAllItems(orderFormId)
