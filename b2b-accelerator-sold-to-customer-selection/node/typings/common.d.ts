import type { OrderFormCustomData } from './orderForm'

export type SandboxResponseType =
  | 'success'
  | 'global'
  | 'lineItemError'
  | 'lineItemWarning'

export interface ItemSchedule {
  deliveryDate: string
  arrivalTime?: string
  confirmedQuantity: number
  salesUnitOfMeasure: string
}

export interface SimulateItemResponse {
  lineItemValue: number
  netValue: number
  shippingCost?: number
  tax?: number
  availableQuantity?: number
  lineItemWarnings?: string[]
  lineItemErrors?: string[]
  itemLine: number
  // TODO: Is this ProductRefId?
  productRefId: string
  quantity: number
  baseUnitOfMeasure: string
  itemReqDeliveryDate: string
  schedules: ItemSchedule[]
  unitPrice: number
  originalUnitPrice: number
  originalLineTotal: number
  certificationData?: string
  smallPack: boolean
  deliveryDateExactMatch: boolean
}

export interface SimulateResponse {
  customerPO?: string
  soldToCustomerNumber: string
  shipToCustomerNumber?: string
  requestedDeliveryDate: string
  currency?: string
  globalErrors?: string[]
  items: SimulateItemResponse[]
  // SAP
  soldToPartnerRole?: string
  shipToPartnerRole?: string
  orderDocType?: string
  salesOrganization?: string
  distributionChannel?: string
  division?: string
  poType?: string
  shipToPO?: string
  shipToReference?: string
  // JDE
  plant?: string
  total: number
  tax: number
  shipping: number
}

export interface OrderFormSimulationResponse {
  simulationResponse: SimulateResponse
  customData: OrderFormCustomData
}

export interface ParsedVtexCheckoutTaxRequest extends CheckoutRequest {
  simulationData: {
    items: SimulateItemResponse[]
  }
}

export interface KeyValue {
  key: string
  value: string
}
