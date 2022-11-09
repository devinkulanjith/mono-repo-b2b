export type SalesOrganization = {
  targetSystem: string
  code: string
  unitMultiplier: number
  minOrderQuantity: number
}

export type CustomerItemAssignment = {
  targetSystem?: string
  customerNumber: string
  skuRefId: number
  customerSku?: string
}
