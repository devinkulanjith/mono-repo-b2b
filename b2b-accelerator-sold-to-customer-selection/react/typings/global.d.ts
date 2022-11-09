interface Window extends Window {
  vtex: any
}

interface OrderFormContext {
  orderForm: OrderForm
  loading: boolean
}

interface OrderFormItem {
  additionalInfo: ItemAdditionalInfo
  availability: string
  detailUrl: string
  id: string
  imageUrl: string
  listPrice: number
  measurementUnit: string
  name: string
  price: number
  productId: string
  quantity: number
  sellingPrice: number
  skuName: string
  skuSpecifications: SKUSpecification[]
  uniqueId: string
  productCategories: Record<string, string>
  productCategoryIds: string
  productRefId: string
  refId: string
}

interface ItemAdditionalInfo {
  brandName: string
}

interface SKUSpecification {
  fieldName: string
  fieldValues: string[]
}

interface CustomApp {
  id: string
  major: number
  fields: {
    [key: string]: string
  }
}

interface CustomData {
  customApps: CustomApp[]
}

interface OrderForm {
  id: string
  items: OrderFormItem[]
  marketingData: MarketingData
  totalizers: Totalizer[]
  value: number
  messages: OrderFormMessages
  customData: CustomData
}

interface MarketingData {
  coupon: string
}

interface Totalizer {
  id: string
  name: string
  value: number
}

interface OrderFormMessages {
  couponMessages: Message[]
  generalMessages: Message[]
}

interface Message {
  code: string
  status: string
  text: string
}

type SimulateItemResponse = {
  lineItemValue: number
  shippingCost: number
  tax: number
  availableQuantity?: number
  lineItemWarnings: string[]
  lineItemErrors: string[]
  itemLine: string | number
  productRefId: string
  quantity: number
  baseUnitOfMeasure: string
  itemReqDeliveryDate: string
}

type SimulationResponse = {
  customerPO: string
  soldToCustomerNumber: string
  shipToCustomerNumber: string
  requestedDeliveryDate: string
  currency?: string
  globalErrors?: string[]
  items: SimulateItemResponse[]
  soldToPartnerRole?: string
  shipToPartnerRole?: string
  orderDocType?: string
  salesOrganization?: string
  distributionChannel?: string
  division?: string
  poType?: string
  shipToPO?: string
  shipToReference?: string
  plant?: string
}

type OrderFormSimulationResponse = {
  simulationResponse: SimulationResponse
  customData: CustomData
}

type TimeSplit = {
  hours: string
  minutes: string
  seconds: string
}

interface KeyValue {
  key: string
  value: string
}
