import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { ButtonPlain, Spinner, Tooltip, IconLocation } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useLazyQuery } from 'react-apollo'
import { Address } from 'vtex.places-graphql'

import REVERSE_GEOCODE_QUERY from './graphql/reverseGeocode.graphql'

export interface GeolocationPosition {
  coords: {
    latitude: number
    longitude: number
  }
}

interface GeolocationPositionError {
  code: number
  message: string
}

type PermissionState = 'prompt' | 'pending' | 'granted' | 'denied'

interface Props {
  onSuccess?: (address: Address) => void
}

const DeviceCoordinates: React.FC<Props> = ({ onSuccess }) => {
  const { setAddress } = useAddressContext()
  const [geolocationPermission, setGeolocationPermission] = useState<
    PermissionState
  >('prompt')

  const [executeReverseGeocode, geoResult] = useLazyQuery(REVERSE_GEOCODE_QUERY)

  const { loading } = geoResult

  useEffect(() => {
    if (geoResult.data) {
      setAddress(geoResult.data.reverseGeocode)
      onSuccess?.(geoResult.data.reverseGeocode)
    }

    if (geoResult.error) {
      console.warn(geoResult.error.message)
    }
  }, [geoResult, setAddress, onSuccess])

  const onGetCurrentPositionSuccess = useCallback(
    ({ coords }: GeolocationPosition) => {
      setGeolocationPermission('granted')

      executeReverseGeocode({
        variables: {
          lat: coords.latitude.toString(),
          lng: coords.longitude.toString(),
        },
      })
    },
    [executeReverseGeocode]
  )

  const onGetCurrentPositionError = useCallback(
    (err: GeolocationPositionError) => {
      setGeolocationPermission('denied')
      console.warn(`ERROR(${err.code}): ${err.message}`)
    },
    []
  )

  const requestGeolocation = useCallback(() => {
    setGeolocationPermission('pending')
    navigator.geolocation.getCurrentPosition(
      onGetCurrentPositionSuccess,
      onGetCurrentPositionError,
      {
        enableHighAccuracy: true,
      }
    )
  }, [onGetCurrentPositionError, onGetCurrentPositionSuccess])

  const handleButtonClick = () => {
    requestGeolocation()
  }

  useEffect(() => {
    // some browsers do not have/require permissions
    if (!navigator.permissions) {
      return
    }

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((result: PermissionStatus) => {
        if (result.state === 'denied') {
          setGeolocationPermission('denied')
        }
      })
  }, [requestGeolocation])

  const locationIcon = useMemo(() => {
    switch (geolocationPermission) {
      case 'prompt':
        return <IconLocation block />

      case 'granted':
        return <IconLocation solid block />

      case 'pending':
        return <Spinner size={16} block />

      case 'denied':
        return <IconLocation block />

      default:
        return null
    }
  }, [geolocationPermission])

  let buttonElement = (
    <ButtonPlain
      disabled={geolocationPermission === 'denied'}
      onClick={handleButtonClick}
    >
      <div className="flex items-center">
        <div className="flex-none mr3">
          {loading ? <Spinner size={16} /> : locationIcon}
        </div>
        <div className="flex-auto">
          <FormattedMessage id="place-components.label.useCurrentLocation" />
        </div>
      </div>
    </ButtonPlain>
  )

  if (geolocationPermission === 'denied') {
    buttonElement = (
      <Tooltip label="Permission not granted">{buttonElement}</Tooltip>
    )
  }

  return buttonElement
}

export default DeviceCoordinates
