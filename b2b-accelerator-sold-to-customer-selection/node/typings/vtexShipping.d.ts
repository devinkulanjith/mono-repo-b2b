export type OrgAccount = {
  id: string
  type: string
  customerNumber: string
  salesOrganizationCode?: string
  targetSystem?: string
  partnerRole: string
  city: string
  country: string
  postalCode: string
  receiverName: string
  state: string
  street: string
}

export type ClientOrgAccount = {
  id: string
  soldToCustomerNumber: string
  targetSystem: string
  email: string
}

export type SoldToShipTo = {
  id: string
  soldToCustomerNumber: string
  shipToCustomerNumber: string
  targetSystem: string
}

export type CL = {
  email: string
  userId: string
  firstName?: string
  lastName?: string
}
