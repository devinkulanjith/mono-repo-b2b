import type { SandboxResponseType } from './common'

export interface JdeItemRequest {
  // TODO: Is this ProductRefId?
  ProductRefId: string
  quantity: string
  baseUnitOfMeasure: string
  sapcert?: string
}

export interface JdeOrderRequest {
  plant?: string
  soldToCustomerNumber: string
  shipToCustomerNumber: string
  OrderId?: string
  customerPO?: string
  Business_Unit: string
  CreatedBy: string
  requestedDeliveryDate: string
  P4210_Version: string
  CreateOrder: '0' | '1'
  currency?: string
  // TODO: Is this field name correct?
  item: JdeItemRequest[]
  sandboxExpectedResponseType?: SandboxResponseType
}

export interface JdeItemResponse {
  itemLine: string
  ProductRefId: string
  shippingCost?: number
  tax?: number
  quantity: string
  availableQuantity?: number
  lineItemWarnings?: string[]
  lineItemErrors?: string[]
  creditHold?: string
  ExtendedAmount: string
  UnitPrice: string
  itemReqDeliveryDate: string
  Description?: string
  baseUnitOfMeasure: string
  DeliveryDate: string
  UnitsOfMeasure: string
  Lot_Number: string
  Print_Message: string
}

export interface JdeOrderResponse {
  globalErrors?: string[] | string
  items?: JdeItemResponse[]
  OrderNumber: string
  currency: string
  soldToCustomerNumber: string
  shipToCustomerNumber: string
  customerPO: string
  requestedDeliveryDate: string
}
