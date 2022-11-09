export const canProceed = (customApp?: any) => {
  if (!customApp) {
    return false
  }
  const poNumber = customApp.fields.poNumber
  if (!poNumber) {
    return false
  }
  const lineItemData = JSON.parse(customApp.fields.lineItemData)
  return !((lineItemData.globalErrors ?? []).length > 0 ||
    lineItemData.itemErrors.filter((item: any) => item.lineItemErrors.length > 0).length > 0)
}
