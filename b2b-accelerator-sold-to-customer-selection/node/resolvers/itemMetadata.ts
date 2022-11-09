import type {
  CustomerItemAssignment,
  SalesOrganization,
} from '../typings/masterdata'
import {
  acronymCustomerItemAssignment,
  acronymSalesAccount,
  acronymSalesOrganization,
} from '../utils/masterdata'
import type { OrgAccount } from '../typings/vtexShipping'

type Args = {
  itemRefId: string
  productId: string
}

export const getItemMetadata = async (
  _: any,
  args: Args,
  {
    clients: {
      checkout: checkoutClient,
      masterdata: mdClient,
      searchGraphQL: searchGraphQlClient,
    },
    vtex: { orderFormId },
  }: Context
) => {
  if (orderFormId) {
    const orderForm = await checkoutClient.orderForm(orderFormId)

    if (orderForm.items.find(item => item.refId === args.itemRefId)) {
      const itemMetadata = JSON.parse(
        orderForm.customData?.customApps.find(
          app => app.id === 'checkout-simulation'
        )?.fields.itemMetadata ?? '{}'
      )

      if (itemMetadata.customerItem) {
        return itemMetadata.customerItem
      }
    }

    const selectedSoldTo = orderForm.customData?.customApps.find(
      app => app.id === 'checkout-simulation'
    )?.fields.soldTo

    const targetSystem = orderForm.customData?.customApps.find(
      app => app.id === 'checkout-simulation'
    )?.fields.targetSystem

    const productInfo = await searchGraphQlClient.product(args.productId)

    if (selectedSoldTo) {
      const custItem = (
        await mdClient.searchDocuments<CustomerItemAssignment>({
          dataEntity: acronymCustomerItemAssignment,
          where: `((targetSystem=${targetSystem} OR (targetSystem is null)) AND customerNumber=${
            selectedSoldTo ?? ''
          } AND skuRefId=${args.itemRefId})`,
          fields: ['customerSku'],
          sort: 'updatedIn DESC',
          pagination: { page: 1, pageSize: 1 },
        })
      ).find(cItem => cItem)

      const orgAccount = (
        await mdClient.searchDocuments<OrgAccount>({
          dataEntity: acronymSalesAccount,
          where: `(targetSystem=${targetSystem} AND customerNumber=${selectedSoldTo})`,
          pagination: { page: 1, pageSize: 1 },
          sort: `updatedIn DESC`,
          fields: ['salesOrganizationCode'],
        })
      ).find(oa => oa)

      if (!orgAccount?.salesOrganizationCode) {
        return {
          unitOfMeasure:
            productInfo.properties
              .find(property => property.originalName === 'Unit of Measure')
              ?.values.find(value => value) ?? 'EA',
          customerItem: custItem?.customerSku,
        }
      }

      const uomInfo = (
        await mdClient.searchDocuments<SalesOrganization>({
          dataEntity: acronymSalesOrganization,
          where: `(targetSystem=${targetSystem} AND code=${orgAccount.salesOrganizationCode} AND skuRefId=${args.itemRefId})`,
          fields: ['minOrderQuantity', 'unitMultiplier'],
          pagination: { page: 1, pageSize: 1 },
          sort: 'updatedIn DESC',
        })
      ).find(ui => ui)

      return {
        unitOfMeasure:
          productInfo.properties
            .find(property => property.originalName === 'Unit of Measure')
            ?.values.find(value => value) ?? 'EA',
        minimumOrderQuantity: uomInfo?.minOrderQuantity,
        unitMultiplier: uomInfo?.unitMultiplier,
        customerItem: custItem?.customerSku,
      }
    }
  }

  return null
}
