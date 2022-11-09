export interface Attachment {
  name: string
  content: Record<string, string>
}

export interface OrderFormItem {
  index: nmber
  uniqueId: string
  itemId: string
  id: string
  quantity: number
  unitMultiplier: number
  measurementUnit: string
  seller: string
  refId: string
  productRefId: string
  productId: string
  attachments: Attachment[]
}

export interface OrderFormCustomApp {
  id: string
  major?: number
  fields: {
    [key: string]: string
  }
}

export interface OrderFormCustomData {
  customApps: OrderFormCustomApp[]
}

export interface CheckoutAddress {
  addressId: string
  addressType: string
  city: string | null
  complement: string | null
  country: string
  geoCoordinates: number[]
  neighborhood: string | null
  number: string | null
  postalCode: string | null
  receiverName: string | null
  reference: string | null
  state: string | null
  street: string | null
  isDisposable: boolean
}

export interface CheckoutProfile {
  userProfileId: string
  profileProvider: string
  availableAccounts: string[]
  availableAddresses: CheckoutAddress[]
  userProfile: any
}

export interface OpenTextField {
  value?: string
}

export interface CheckoutClientPreferencesData {
  optinNewsLetter?: boolean
  locale?: string
}

export interface OrderFormItemInput {
  id?: number
  index?: number
  quantity?: number
  seller?: string
  uniqueId?: string
  options?: AssemblyOptionInput[]
}

export interface AssemblyOptionInput {
  id: string
  quantity: number
  assemblyId: string
  seller: string
  inputValues: Record<string, string>
  options?: AssemblyOptionInput[]
}

export interface UserProfileInput {
  email?: string
  firstName?: string
  lastName?: string
  document?: string
  phone?: string
  documentType?: string
  isCorporate?: boolean
  corporateName?: string
  tradeName?: string
  corporateDocument?: string
  stateInscription?: string
}

export interface StorePreferencesData {
  countryCode: string
  currencyCode: string
  currencySymbol: string
  currencyFormatInfo: {
    currencyDecimalDigits: number
  }
}

export interface Totalizer {
  id: string
  name: string
  value: number
}

export interface OrderForm {
  orderFormId: string
  items: OrderFormItem[]
  value: number
  customData: OrderFormCustomData
  storePreferencesData: StorePreferencesData
  userProfileId?: string
  clientProfileData: UserProfileInput
  totalizers: Totalizer[]
}

interface PaymentInput {
  paymentSystem?: string
  bin?: string
  accountId?: string
  tokenId?: string
  installments?: number
  referenceValue?: number
  value?: number
}

interface PaymentDataInput {
  payments: PaymentInput[]
}

interface OrderFormConfiguration {
  paymentConfiguration: PaymentConfiguration
  taxConfiguration: TaxConfiguration | null
  minimumQuantityAccumulatedForItems: number
  decimalDigitsPrecision: number
  minimumValueAccumulated: number
  apps: App[]
  allowMultipleDeliveries: boolean
  allowManualPrice: boolean
  maxNumberOfWhiteLabelSellers: number
  maskFirstPurchaseData: boolean
  recaptchaValidation: boolean
}

interface PaymentConfiguration {
  requiresAuthenticationForPreAuthorizedPaymentOption: boolean
  allowInstallmentsMerge: boolean
  blockPaymentSession: boolean
  paymentSystemToCheckFirstInstallment: boolean
}

interface TaxConfiguration {
  allowExecutionAfterErrors: boolean
  authorizationHeader: string
  integratedAuthentication: boolean
  url: string | null
}

interface App {
  fields: string[]
  id: string
  major: number
}
