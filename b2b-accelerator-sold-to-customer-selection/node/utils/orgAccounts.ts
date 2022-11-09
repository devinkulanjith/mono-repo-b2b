import type { OrgAccount } from '../typings/vtexShipping'

export const getOrgAccountAsString = (orgAccount: OrgAccount) => {
  const { street, city, state, postalCode, country } = orgAccount

  const addressInfo = [street, city, state, postalCode, country]
    .filter(part => part && part.length > 0)
    .join(', ')

  if (!addressInfo || addressInfo.length === 0) {
    return orgAccount.customerNumber
  }

  return `${orgAccount.customerNumber} (${addressInfo})`
}
