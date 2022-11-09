interface ExternalSimulationRequest {
  email: string
  simulationData: {
    poNumber: string
    soldTo: string
    soldToCustomerNumber: string
    soldToInfo: string
    shipTo: string
    shipToCustomerNumber: string
    shipToInfo: string
    targetSystem: string
    itemMetadata: string
    requiredDeliveryDate: string
    clientEmail: string
    itemInputs: string
  }
}
