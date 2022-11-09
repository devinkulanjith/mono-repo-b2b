export const parseVtexToProvider = (checkoutRequest: CheckoutRequest) => {
  const simulationData = JSON.parse(
    checkoutRequest.taxApp?.fields?.simulationData ?? '{}'
  )

  return {
    ...checkoutRequest,
    simulationData,
  }
}
