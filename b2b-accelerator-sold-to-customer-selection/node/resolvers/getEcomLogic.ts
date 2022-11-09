import { UserInputError } from '@vtex/api'

import { getAssignedSoldToAccounts } from '../modules/soldToAccounts'
import {
  BRAND_CLIENT_ACRONYM,
  BRAND_CLIENT_SCHEMA,
  BRNAD_CLIENT_FIELDS,
  PLANT_ACRONYM,
  PLANT_FIELDS,
  PLANT_SCHEMA,
} from '../utils/constants'

interface SearchArgs {
  skuRefId: string
  targetSystem?: string
  salesOrganizationCode?: string
  customerNumber?: string
  brand?: string
}

interface BrandList {
  id: string
  targetSystem: string
  trade: string
  user: string
}

export const getAvailabilityInfo = async (
  _: any,
  { brand, skuRefId }: SearchArgs,
  ctx: Context
) => {
  const {
    clients: { masterdata: mdClient, checkout: checkoutClient },
    vtex,
  } = ctx

  const { orderFormId } = vtex

  if (!orderFormId) {
    throw new UserInputError('Order form ID not found!')
  }

  const response = await checkoutClient.orderForm(orderFormId)
  const soldToAccount = (response.customData?.customApps ?? []).find(
    app => app.id === 'checkout-simulation'
  )?.fields.soldToCustomerNumber

  const assignedSoldToAccountsForUser = await getAssignedSoldToAccounts(
    { pageSize: 200, page: 1 },
    ctx
  )

  const soldToAccountDetails = await assignedSoldToAccountsForUser.data.find(
    sa => sa?.id === soldToAccount
  )

  const targetSystem = soldToAccountDetails?.targetSystem
  const salesOrganizationCode = soldToAccountDetails?.salesOrganizationCode

  if (!targetSystem) {
    return {
      hideButton: 1,
      disableButton: 1,
      quantity: 0,
      plants: [],
      targetSystem: '',
    }
  }

  // If the target system is sap
  if (targetSystem?.toLowerCase() === 'sap') {
    const plantsList = await mdClient.searchDocumentsWithPaginationInfo({
      pagination: { pageSize: 200, page: 1 },
      dataEntity: PLANT_ACRONYM,
      schema: PLANT_SCHEMA,
      fields: PLANT_FIELDS,
      where: `salesOrganizationCode=${salesOrganizationCode} AND skuRefId=${skuRefId}`,
    })

    return {
      hideButton: soldToAccountDetails?.salesOrganizationCode ? 0 : 1,
      disableButton: plantsList.data.length ? 0 : 1,
      quantity: 0,
      plants: plantsList.data,
      targetSystem,
    }
  }

  if (targetSystem?.toLowerCase() === 'jde') {
    const brands = await mdClient.searchDocumentsWithPaginationInfo<BrandList>({
      dataEntity: BRAND_CLIENT_ACRONYM,
      schema: BRAND_CLIENT_SCHEMA,
      fields: BRNAD_CLIENT_FIELDS,
      pagination: { pageSize: 200, page: 1 },
      where: `user=${soldToAccountDetails?.customerNumber}`,
    })

    return {
      hideButton: soldToAccountDetails?.customerNumber !== null ? 0 : 1,
      disableButton: brands.data.find(data => data?.trade === brand) ? 0 : 1,
      quantity: 0,
      plants: [],
      targetSystem,
    }
  }

  return {
    hideButton: 1,
    disableButton: 1,
    quantity: 0,
  }
}
