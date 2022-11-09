import React from 'react'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { Dropdown } from 'vtex.styleguide'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Address } from 'vtex.checkout-graphql'
import { AddressFields } from 'vtex.address-context/types'

import { useCountry } from './useCountry'

const messages = defineMessages({
  province: {
    defaultMessage: '',
    id: 'place-components.label.province',
  },
  city: {
    defaultMessage: '',
    id: 'place-components.label.city',
  },
  department: {
    defaultMessage: '',
    id: 'place-components.label.department',
  },
  region: {
    defaultMessage: '',
    id: 'place-components.label.region',
  },
  community: {
    defaultMessage: '',
    id: 'place-components.label.community',
  },
  municipality: {
    defaultMessage: '',
    id: 'place-components.label.municipality',
  },
  district: {
    defaultMessage: '',
    id: 'place-components.label.district',
  },
  state: {
    defaultMessage: '',
    id: 'place-components.label.state',
  },
  locality: {
    defaultMessage: '',
    id: 'place-components.label.locality',
  },
})

const LocationSelect: React.FC = () => {
  const { address, setAddress, rules } = useAddressContext()
  const country = useCountry()
  const countryRules = rules[country]

  if (!countryRules?.locationSelect) {
    throw new Error(
      `The country "${country}" is not applicable to the LocationSelect component`
    )
  }

  const { countryData, fields } = countryRules.locationSelect

  const addressFields = fields.map(
    (field) => address[field.name as AddressFields]
  )

  const firstMissingIdx = addressFields.findIndex((field) => !field)
  const completedFields =
    firstMissingIdx === -1
      ? addressFields
      : addressFields.slice(0, firstMissingIdx)

  const getLocationSelects = () => {
    const locationSelects = []
    let currentOptions = countryData

    for (let i = 0; i < fields.length; ++i) {
      const field = fields[i]
      const fieldValue = address[field.name as AddressFields]

      if (typeof fieldValue !== 'string') {
        continue
      }

      locationSelects.push(
        <div className="mb5" key={i}>
          <Dropdown
            label={
              <FormattedMessage
                {...messages[field.label as keyof typeof messages]}
              />
            }
            disabled={i > completedFields.length}
            options={(Array.isArray(currentOptions) // Workaround, fix JSON country data
              ? currentOptions
              : Object.keys(currentOptions)
            ).map((name) => {
              return { label: name, value: name }
            })}
            onChange={({
              target: { value },
            }: React.ChangeEvent<HTMLSelectElement>) => {
              let newFields: { [key: string]: string | null } = {
                [field.name as string]: value,
              }

              for (let j = i + 1; j < fields.length; ++j) {
                newFields = { ...newFields, [fields[j].name as string]: null }
              }

              setAddress((prevAddress: Address) => ({
                ...prevAddress,
                ...newFields,
              }))
            }}
            placeholder="Select..."
            value={fieldValue}
          />
        </div>
      )

      currentOptions = fieldValue
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          currentOptions[fieldValue as keyof object]
        : {}
    }

    return locationSelects
  }

  return <div>{getLocationSelects()}</div>
}

export default LocationSelect
