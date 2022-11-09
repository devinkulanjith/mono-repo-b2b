export interface ProductResponse {
  productName: string
  productId: string
  items: Array<{
    itemId: string
    name: string
    variations: Array<{
      name: string
      values: string[]
    }>
    referenceId: Array<{
      Key: string
      Value: string
    }>
  }>
  properties: Array<{
    originalName: string
    name: string
    values: string[]
  }>
}

export interface ProductsByIdentifierResponse {
  productsByIdentifier: ProductResponse[]
}

export interface ProductArgs {
  values: string[]
}

export const query = `
query Product($values: [ID!]!) {
  productsByIdentifier(field: id, values: $values) {
    productId
    properties {
      originalName
      name
      values
    }
    items {
      itemId
      referenceId {
        Key
        Value
      }
    }
  }
}
`
