import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Input,
  IconSearch,
  IconClear,
  IconWarning,
  Spinner,
} from 'vtex.styleguide'
import { positionMatchWidth } from '@reach/popover'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { useLazyQuery, useQuery } from 'react-apollo'
import {
  Address,
  AddressSuggestion,
  Image,
  Query,
  QueryAddressArgs,
  QueryAddressSuggestionsArgs,
} from 'vtex.geolocation-graphql-interface'

import PROVIDER_LOGO from './graphql/providerLogo.graphql'
import SESSION_TOKEN from './graphql/sessionToken.graphql'
import ADDRESS_SUGGESTIONS from './graphql/addressSuggestions.graphql'
import ADDRESS from './graphql/address.graphql'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxPopover,
  ComboboxList,
} from './components/Combobox'
import PlaceIcon from './components/PlaceIcon'
import { useCountry } from './useCountry'

const DEBOUNCE_DELAY_IN_MS = 500

const useProviderLogo = (): Image | undefined => {
  const { data, error } = useQuery<Query, never>(PROVIDER_LOGO)

  if (error) {
    console.error(error.message)
  }

  return data?.providerLogo
}

const useDebouncedValue = (value: string, delayInMs: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayInMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayInMs])

  return debouncedValue
}

const useSuggestions = (
  searchTerm: string,
  sessionToken?: string | null,
  country?: string | null
): [AddressSuggestion[], boolean] => {
  const [executeAddressSuggestions, { data, error, loading }] = useLazyQuery<
    Query,
    QueryAddressSuggestionsArgs
  >(ADDRESS_SUGGESTIONS)

  useEffect(() => {
    if (searchTerm.trim().length) {
      executeAddressSuggestions({
        variables: { searchTerm, sessionToken, country },
      })
    }
    // the effect shouldn't be triggered when the sessionToken changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, country, executeAddressSuggestions])

  useEffect(() => {
    if (error) {
      console.error(error.message)
    }
  }, [error])

  return [data?.addressSuggestions ?? [], loading]
}

const renderSuggestionText = ({
  mainText,
  mainTextMatchInterval: { offset, length },
  secondaryText,
}: AddressSuggestion) => {
  return (
    <div className="truncate c-muted-2">
      <span className="c-on-base">
        {mainText.substr(0, offset)}
        <span className="b">{mainText.substr(offset, length)}</span>
        {mainText.substr(offset + length)}
      </span>{' '}
      <span>{secondaryText}</span>
    </div>
  )
}

interface LocationSearchProps {
  label?: ReactNode | string
  onSelectAddress?: (address: Address) => void
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  label = <FormattedMessage id="place-components.label.autocompleteAddress" />,
  onSelectAddress,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState('')
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const { setAddress } = useAddressContext()
  const providerLogo = useProviderLogo()
  const debouncedSearchTerm = useDebouncedValue(
    searchTerm,
    DEBOUNCE_DELAY_IN_MS
  )

  const {
    data: sessionTokenData,
    error: sessionTokenError,
    refetch: refetchSessionToken,
  } = useQuery<Query, never>(SESSION_TOKEN, {
    notifyOnNetworkStatusChange: true,
  })

  const country = useCountry()
  const sessionToken = sessionTokenData?.sessionToken ?? null
  const [suggestions, loadingSuggestions] = useSuggestions(
    debouncedSearchTerm,
    sessionToken,
    country
  )

  const [executeAddress, { data, error, loading }] = useLazyQuery<
    Query,
    QueryAddressArgs
  >(ADDRESS)

  useEffect(() => {
    if (sessionTokenError) {
      console.error(sessionTokenError.message)
    }
  }, [sessionTokenError])

  useEffect(() => {
    if (data) {
      setAddress((prevAddress) => ({
        ...prevAddress,
        ...data.address,
      }))
      onSelectAddress?.(data.address)
    }

    if (error) {
      console.error(error.message)
    }
  }, [data, error, onSelectAddress, setAddress])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return
    }

    setSearchTerm('')
    setDisplayedSearchTerm('')
  }

  const handleSuggestionSelection = (selectedSuggestion: string) => {
    const externalId = suggestions.find(
      (suggestion) => suggestion.description === selectedSuggestion
    )?.externalId

    if (externalId == null) {
      console.error(`${selectedSuggestion} was not found`)

      return
    }

    setDisplayedSearchTerm(selectedSuggestion)
    executeAddress({ variables: { externalId, sessionToken } })
    refetchSessionToken()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setDisplayedSearchTerm(event.target.value)
  }

  const handleClick = () => {
    setSearchTerm('')
    setDisplayedSearchTerm('')
  }

  return (
    <div className="w-100">
      <Combobox onSelect={handleSuggestionSelection}>
        <div ref={inputWrapperRef}>
          <ComboboxInput
            as={Input}
            size="large"
            testId="location-search-input"
            label={label}
            prefix={
              <div className="c-action-primary flex justify-center items-center">
                <IconSearch />
              </div>
            }
            suffix={
              loading ? (
                <Spinner size={20} />
              ) : searchTerm.trim().length ? (
                <span
                  data-testid="location-search-clear"
                  role="button"
                  // the input can be cleared by pressing the esc key,
                  // so the clear button should not be tabbable
                  tabIndex={-1}
                  className="flex pa3 na3 pointer outline-0 c-muted-3 hover-gray"
                  onClick={handleClick}
                  onKeyPress={() => {}}
                >
                  <IconClear />
                </span>
              ) : null
            }
            disabled={loading}
            value={displayedSearchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        {debouncedSearchTerm.trim().length ? (
          <ComboboxPopover
            position={(_targetRect, popoverRect) =>
              positionMatchWidth(
                inputWrapperRef.current?.getBoundingClientRect(),
                popoverRect
              )
            }
          >
            {suggestions.length > 0 ? (
              <ComboboxList>
                {suggestions.map((suggestion, index) => (
                  <ComboboxOption value={suggestion.description} key={index}>
                    <PlaceIcon className="flex flex-shrink-0 mr4 c-muted-1" />
                    {renderSuggestionText(suggestion)}
                  </ComboboxOption>
                ))}
              </ComboboxList>
            ) : null}
            {loadingSuggestions ? (
              <div className="flex flex-row justify-center items-center pa3">
                <Spinner size={20} />
              </div>
            ) : null}
            {suggestions.length > 0 && providerLogo ? (
              <div className="flex flex-row-reverse">
                <div className="mt3 mb1 mh5">
                  <img
                    className="h1"
                    src={providerLogo.src}
                    alt={providerLogo.alt}
                  />
                </div>
              </div>
            ) : null}
            {!loadingSuggestions && suggestions.length === 0 ? (
              <div className="flex items-center pv3 ph5">
                <div className="flex flex-shrink-0 mr4 c-muted-3">
                  <IconWarning />
                </div>
                <div className="truncate c-muted-2 fw6">
                  <FormattedMessage id="place-components.label.autocompleteAddressFail" />
                </div>
              </div>
            ) : null}
          </ComboboxPopover>
        ) : null}
      </Combobox>
    </div>
  )
}

export default LocationSearch
