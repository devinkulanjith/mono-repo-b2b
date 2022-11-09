import { Address } from 'vtex.checkout-graphql'
import { CountryRules, AddressFields } from 'vtex.address-context/types'
import msk from 'msk'
import { DisplayData } from 'vtex.country-data-settings'

import { FieldName } from './useAddressForm'

const isAddressField = (field: string): field is AddressFields =>
  (field as AddressFields) !== undefined

export default function formatAddressToString(
  address: Address,
  rules: CountryRules,
  displayType: keyof Omit<DisplayData, '__typename'> = 'compact'
) {
  const displaySpec = rules.display[displayType]

  return displaySpec
    .map((line) =>
      line.filter(({ name }) => isAddressField(name) && address[name])
    )
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .map((fragment, index) => {
          const hasPreviousFragment =
            index > 0 && address[line[index - 1].name as FieldName]

          const hasNextFragment =
            index + 1 < line.length &&
            address[line[index + 1].name as FieldName]

          const hasDifferentDelimiter = fragment.delimiterAfter !== '-'
          const shouldShowDelimiter = hasNextFragment ?? hasDifferentDelimiter

          const valueMask =
            fragment.name in rules.fields
              ? rules.fields[fragment.name as FieldName]?.mask
              : undefined

          const fragmentValue = valueMask
            ? msk(address[fragment.name as FieldName] as string, valueMask)
            : address[fragment.name as FieldName]

          return [
            hasPreviousFragment && fragment.delimiter,
            fragmentValue,
            shouldShowDelimiter && fragment.delimiterAfter,
          ]
            .filter(Boolean)
            .join(' ')
        })
        .join(' ')
    )
    .join(' ')
}
