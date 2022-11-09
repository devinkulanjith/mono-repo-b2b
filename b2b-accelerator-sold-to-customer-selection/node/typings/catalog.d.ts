interface SalesChannelAvailable {
  Id: number
  Name: string
  IsActive: boolean
  ProductClusterId: string | null
  CountryCode: string
  CultureInfo: string
  TimeZone: string
  CurrencyCode: string
  CurrencySymbol: string
  CurrencyLocale: number
  CurrencyFormatInfo: unknown
  Position: number
  ConditionRule: string | null
  CurrencyDecimalDigits: null | number
}
