import React, { useEffect, useState } from 'react'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { Listbox } from 'vtex.checkout-components'
import { CountryFlag } from 'vtex.country-flags'
import { defineMessages, useIntl } from 'react-intl'

import { useCountry } from './useCountry'

const {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} = Listbox

const messages = defineMessages({
  ARG: {
    defaultMessage: '',
    id: 'place-components.label.ARG',
  },
  BRA: {
    defaultMessage: '',
    id: 'place-components.label.BRA',
  },
  BOL: {
    defaultMessage: '',
    id: 'place-components.label.BOL',
  },
  KOR: {
    defaultMessage: '',
    id: 'place-components.label.KOR',
  },
})

const renderCountryFlagWithName = ({
  country,
  name,
}: {
  country: string
  name: string
}) => (
  <>
    <CountryFlag iso3={country} />
    <span className="dib ml3">{name}</span>
  </>
)

interface LocationCountryProps {
  labelId?: string
  className?: string
}

const LocationCountry: React.FC<LocationCountryProps> = ({
  labelId = 'location-country',
  className = '',
}) => {
  const intl = useIntl()
  const { setAddress, countries } = useAddressContext()

  const [country, setCountry] = useState(useCountry())

  if (country && countries && !countries.includes(country)) {
    throw new Error(
      `The country "${country}" doesn't belong to the country list, can't render LocationCountry`
    )
  }

  useEffect(() => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      country,
      // reset all other fields related
      // to the country
      city: null,
      complement: null,
      geoCoordinates: null,
      neighborhood: null,
      number: null,
      postalCode: null,
      state: null,
      street: null,
    }))
  }, [country, setAddress])

  // Do not render anything if we only have 1 country or none.
  if ((countries ?? []).length <= 1) {
    return null
  }

  return (
    <div className={className}>
      <span
        id={labelId}
        className="vtex-input__label db mb3 w-100 c-on-base t-body"
      >
        {intl.formatMessage({ id: 'place-components.label.country' })}
      </span>
      <ListboxInput
        translate={undefined}
        aria-labelledby={labelId}
        value={country}
        onChange={setCountry}
      >
        <ListboxButton>
          {({ label }) =>
            renderCountryFlagWithName({
              country,
              name: label,
            })
          }
        </ListboxButton>
        <ListboxPopover translate={undefined}>
          <ListboxList>
            {countries.map((countryCode) => {
              const name =
                countryCode in messages
                  ? intl.formatMessage(
                      messages[countryCode as keyof typeof messages]
                    )
                  : countryCode

              return (
                <ListboxOption
                  value={countryCode}
                  label={name}
                  key={countryCode}
                >
                  {renderCountryFlagWithName({
                    country: countryCode,
                    name,
                  })}
                </ListboxOption>
              )
            })}
          </ListboxList>
        </ListboxPopover>
      </ListboxInput>
    </div>
  )
}

export default LocationCountry
