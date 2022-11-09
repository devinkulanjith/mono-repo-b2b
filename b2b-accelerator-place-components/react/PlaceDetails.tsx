import msk from 'msk'
import React from 'react'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { AddressFields } from 'vtex.address-context/types'
import { ButtonPlain } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'
import { DisplayData } from 'vtex.country-data-settings'

import { FieldName } from './useAddressForm'
import { useCountry } from './useCountry'

interface Props {
  display?: keyof Omit<DisplayData, '__typename'>
  hiddenFields?: AddressFields[]
  onEdit?: () => void
}

const messages = defineMessages({
  edit: {
    defaultMessage: '',
    id: 'place-components.label.edit',
  },
})

const PlaceDetails: React.FC<Props> = ({
  display = 'extended',
  hiddenFields = [],
  onEdit,
}) => {
  const { address, rules } = useAddressContext()
  const country = useCountry()
  const countryRules = rules[country]

  const intl = useIntl()

  if (!countryRules) {
    return null
  }

  const displaySpec = countryRules.display[display]

  return (
    <div className="flex flex-column">
      {displaySpec
        .map((line) => {
          return line.filter(
            (fragment) =>
              address[fragment.name as FieldName] &&
              !hiddenFields.includes(fragment.name as FieldName)
          )
        })
        .filter((line) => line.length > 0)
        .map((line, displayIndex) => (
          <div className="flex" key={displayIndex}>
            {line.map((fragment, index) => {
              const hasPreviousFragment =
                index > 0 && address[line[index - 1].name as FieldName]

              const hasNextFragment =
                index + 1 < line.length &&
                address[line[index + 1].name as FieldName]

              const hasDifferentDelimiter = fragment.delimiterAfter !== '-'
              const shouldShowDelimiter =
                hasNextFragment ?? hasDifferentDelimiter

              const valueMask =
                fragment.name in countryRules.fields
                  ? countryRules.fields[fragment.name as FieldName]?.mask
                  : undefined

              const addressValue = valueMask
                ? msk(address[fragment.name as FieldName] as string, valueMask)
                : address[fragment.name as FieldName]

              return (
                <div className="dib" key={fragment.name}>
                  {fragment.delimiter && hasPreviousFragment && (
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {fragment.delimiter}
                    </span>
                  )}
                  <span className={fragment.name}>{addressValue}</span>
                  {fragment.delimiterAfter && shouldShowDelimiter && (
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {fragment.delimiterAfter}
                    </span>
                  )}
                </div>
              )
            })}
            {onEdit && displayIndex === 0 && (
              <div className="ml4 flex items-center">
                <ButtonPlain onClick={onEdit}>
                  <span className="ttl">
                    {intl.formatMessage(messages.edit)}
                  </span>
                </ButtonPlain>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

export default PlaceDetails
