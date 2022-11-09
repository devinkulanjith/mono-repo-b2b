type OrderFormItem = {
  id: string
  uniqueId: string
}

type OrderFormSimulationData = {
  clientEmail: string
  itemMetadata: string
  lastFormSnapshot: string
  poNumber: string
  requiredDeliveryDate: string
  shipTo: string
  shipToCustomerNumber: string
  shipToInfo: string
  simulationCompletedAt: string
  simulationData: string
  soldTo: string
  soldToCustomerNumber: string
  soldToInfo: string
  targetSystem: string
}

type CustomApp = {
  id: string
  fields: OrderFormSimulationData
}

type CustomData = {
  customApps: CustomApp[]
}

type OrderForm = {
  items: OrderFormItem[]
  customData: CustomData
}
