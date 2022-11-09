import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { IconSearch, Input, Button, ButtonPlain } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLazyQuery } from 'react-apollo'
import msk from 'msk'
import {
  Address,
  Query,
  QueryGetAddressFromPostalCodeArgs,
} from 'vtex.places-graphql'

import GET_ADDRESS_FROM_POSTAL_CODE from './graphql/getAddressFromPostalCode.graphql'
import styles from './LocationInput.css'
import { useCountry } from './useCountry'

interface Props {
  onSuccess?: (address: Address) => void | Promise<void>
  variation?: 'primary' | 'secondary'
}

const LocationInput: React.FC<Props> = ({
  variation = 'secondary',
  onSuccess,
}) => {
  const { setAddress, rules } = useAddressContext()
  const intl = useIntl()
  const [inputValue, setInputValue] = useState('')
  // the network-only fetch policy asserts that if an incorrect postal code
  // has been submitted twice in a row, it won't return the cached error,
  // re-triggering the effect hook and avoiding an infinite loop state
  const [executeGetAddressFromPostalCode, { error, data }] = useLazyQuery<
    Query,
    QueryGetAddressFromPostalCodeArgs
  >(GET_ADDRESS_FROM_POSTAL_CODE, { fetchPolicy: 'network-only' })

  const [loading, setLoading] = useState(false)
  const [invalidPostalCode, setInvalidPostalCode] = useState(false)

  const country = useCountry()
  const countryRules = rules[country]

  const prevCountryRulesRef = useRef(countryRules)

  const formatAndValidate = useCallback(() => {
    const { mask, pattern } = countryRules?.fields.postalCode ?? {}

    if (!mask) {
      return
    }

    setInputValue(msk(inputValue, mask))
    const patternInvalid =
      inputValue.length && pattern && !inputValue.match(pattern)

    if (patternInvalid) {
      setInvalidPostalCode(true)
    }
  }, [countryRules?.fields.postalCode, inputValue])

  useEffect(() => {
    if (prevCountryRulesRef.current === countryRules) {
      return
    }

    prevCountryRulesRef.current = countryRules
    setInvalidPostalCode(false)
    formatAndValidate()
  }, [countryRules, formatAndValidate])

  useEffect(() => {
    let cancelled = false

    if (data?.getAddressFromPostalCode) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      ;(onSuccess?.(data.getAddressFromPostalCode) || Promise.resolve())
        .then(() => {
          setAddress((prevAddress) => ({
            ...prevAddress,
            ...data.getAddressFromPostalCode,
          }))

          if (cancelled) {
            return
          }

          setLoading(false)
        })
        .catch(() => {
          if (cancelled) {
            return
          }

          setInvalidPostalCode(true)
          setLoading(false)
        })
    }

    if (error) {
      console.error(error.message)
      setInvalidPostalCode(true)
      setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [data, error, onSuccess, setAddress])

  const handleSubmit: React.EventHandler<
    React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  > = (event) => {
    event.preventDefault()
    if (invalidPostalCode) {
      return
    }

    setLoading(true)
    executeGetAddressFromPostalCode({
      variables: {
        postalCode: inputValue,
        countryCode: country,
      },
    })
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (invalidPostalCode) {
      setInvalidPostalCode(false)
    }

    setInputValue(event.target.value)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === 'Enter') {
      formatAndValidate()
    }
  }

  if (!countryRules) {
    return null
  }

  return (
    <div className="w-100">
      <form className={`${styles.locationInput} mb4`} onSubmit={handleSubmit}>
        <Input
          id="postal-code-input"
          label={<FormattedMessage id="place-components.label.postalCode" />}
          suffix={
            <Button
              id="submit-postal-code-button"
              type="submit"
              onClick={handleSubmit}
              isLoading={loading}
              variation={variation}
            >
              <IconSearch />
            </Button>
          }
          size="large"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={formatAndValidate}
          onKeyDown={handleKeyDown}
          disabled={loading}
          error={invalidPostalCode}
          errorMessage={
            invalidPostalCode
              ? intl.formatMessage({ id: 'place-components.error.postalCode' })
              : undefined
          }
        />
      </form>
      {countryRules.fields.postalCode?.additionalData?.forgottenURL && (
        <ButtonPlain
          href={countryRules.fields.postalCode.additionalData.forgottenURL}
          target="_blank noreferrer"
        >
          <FormattedMessage id="place-components.label.dontKnowPostalCode" />
        </ButtonPlain>
      )}
    </div>
  )
}

export default LocationInput
