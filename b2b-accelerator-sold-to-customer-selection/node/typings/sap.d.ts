import type { SandboxResponseType } from './common'

export interface SapItemRequest {
  itemLine: number
  // TODO: Is this ProductRefId?
  productRefId: string
  quantity: number
  baseUnitOfMeasure?: string
  itemReqDeliveryDate: string
}

export interface SapOrderRequest {
  customerPO?: string
  soldToPartnerRole: string
  soldToCustomerNumber: string
  shipToPartnerRole: string
  shipToCustomerNumber?: string
  orderDocType: string
  salesOrganization: string
  distributionChannel: string
  division: string
  requestedDeliveryDate: string
  poType: string
  shipToPO: string
  shipToReference: string
  currency?: string
  items: SapItemRequest[]
  sandboxExpectedResponseType?: SandboxResponseType
}

export interface ScheduleLine {
  SalesDocumentItem: string
  ScheduleLine: string
  ScheduleLineCategory: string
  ItemIsRelevantForDelivery: string
  ScheduleLineDate: string
  ArrivalTime: string
  OrderQuantityInSalesUnits: string
  ConfirmedQuantity: string
  salesUnit: string
}

export interface SapItemResponse {
  itemLine: string
  lineItemValue: string
  shippingCost?: string
  tax?: string
  quantity: string
  NetValue: string
  availableQuantity?: number
  lineItemWarnings?: string[]
  lineItemErrors?: string[]
  ProductRefId: string
  UnitsOfMeasure: string
  itemReqDeliveryDate: string
  DeliveryDate: string
  Currency: string
  ItemShortText: string
  ScheduleLines?: ScheduleLine | ScheduleLine[]
  SmallPack?: boolean
}

export interface SapOrderResponse extends SapOrderRequest {
  globalErrors?: string[] | string
  items?: SapItemResponse[] | SapItemResponse
  targetSystem?: string
}
