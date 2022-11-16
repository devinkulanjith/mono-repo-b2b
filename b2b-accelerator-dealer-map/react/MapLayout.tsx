import React, { useCallback, useEffect, useState } from 'react'
import { withGoogleMap, withScriptjs } from 'react-google-maps'
import { useCssHandles } from 'vtex.css-handles'
import { Button, Dropdown, Input, Spinner } from 'vtex.styleguide'
import { useLazyQuery } from 'react-apollo'

import GET_MAP_POINTS from './queries/getMappoints.graphql'
import { brandList, countryList } from './util/util'
import './styles.css'
import { Map } from './component/Map'

const CSS_HANDLES = [
  'listWrapper',
  'listItem',
  'countryDropDown',
  'brandDropDown',
  'searchByPostalCode',
  'inforWindowWebsite',
  'inforWindowWebsiteLink',
  'inforWindowPhoneNumber',
  'inforWindowPhoneIcon',
  'inforWindowAddress',
  'inforWindowAddressIcon',
  'inforWindowEmail',
  'inforWindowEmailIcon',
  'inforWindowStoreName',
  'dealerMapButton',
  'postalCodeButton',
  'searchButton',
]

const MapWrapped = withScriptjs(withGoogleMap(Map))

const MapLayout = ({
  water = '#ffffff',
  landscape = '#FFD20D',
  poi = '#FFD20D',
  externalZoomButton = true,
  showMapPointerList = true,
  defaultZoom = 4,
  pointType = 'dealer',
  enableFilterbyCountry = false,
  enableFilterbyBrand = false,
  enableFilterbyPostalCode = false,
  enableFilterbyPointName = false,
  enableFilterbyPhoneNumber = false,
  enableFilterbyWebsite = false,
  enableFilterbyEmail = false,
}) => {
  const styles = useCssHandles(CSS_HANDLES)
  const [center, setCenter] = useState({
    lat: 17.6078, // Niger
    lng: 8.0817,
  })

  const [defaultCenter, setDefaultCenter] = useState({
    lat: 17.6078, // Niger
    lng: 8.0817,
  })

  const [zoom, setZoom] = useState(2.5)
  const [pointName, setPointName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [brandCode, setBrandCode] = useState('')
  const [currentLat, setCurrentLat] = useState(0)
  const [currentLng, setCurrentLng] = useState(0)

  const [
    getMapPoints,
    { data: mapPoints, loading: mapPointLoading, called: mapPointsCalled },
  ] = useLazyQuery(GET_MAP_POINTS, {
    ssr: false,
    fetchPolicy: 'no-cache',
    partialRefetch: true,
  })

  const fetchMapPoints = useCallback(
    (where: string) => {
      getMapPoints({
        variables: {
          where,
        },
      })
    },
    [getMapPoints]
  )

  console.log('mono-repo-test')

  useEffect(() => {
    if (navigator.geolocation && currentLat === 0 && currentLng === 0) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newCenter = {
          lat:
            position.coords.latitude > 0
              ? position.coords.latitude + 10.0
              : position.coords.latitude - 10.0,
          lng:
            position.coords.longitude > 0
              ? position.coords.longitude + 10.0
              : position.coords.longitude - 10.0,
        }

        setCurrentLat(
          position.coords.latitude > 0
            ? position.coords.latitude + 10.0
            : position.coords.latitude - 10.0
        )

        setCurrentLng(
          position.coords.longitude > 0
            ? position.coords.longitude + 10.0
            : position.coords.longitude - 10.0
        )

        setDefaultCenter(newCenter)
      })
    }

    if (!mapPointsCalled && currentLat && currentLng) {
      fetchMapPoints(
        `time=1(pointType=${pointType} AND (lat<${currentLat} AND lng<${currentLng}))`
      )
    }
  }, [
    currentLat,
    currentLng,
    fetchMapPoints,
    mapPointLoading,
    mapPointsCalled,
    pointType,
  ])

  if (!mapPointsCalled) {
    if (currentLat && currentLng) {
      fetchMapPoints(
        `time=1(pointType=${pointType} AND (lat<${currentLat} AND lng<${currentLng}))`
      )
    }

    if (mapPoints?.data.length > 0) {
      fetchMapPoints(`(pointType=${pointType}`)
    }

    fetchMapPoints(`pointType=${pointType}`)
  }

  let dealerData = []

  if (!mapPointLoading) {
    dealerData = mapPoints?.getMapPoints?.Points ?? []
  }

  if (mapPointLoading) {
    return (
      <div className="flex justify-center h3 ">
        <Spinner />
      </div>
    )
  }

  const mapStyles = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: water,
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        {
          color: landscape,
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: poi,
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: water,
        },
      ],
    },
    {
      featureType: 'administrative.province',
      elementType: 'geometry.stroke',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry.stroke',
      stylers: [
        {
          visibility: 'on',
        },
        {
          color: '##E5E5E5',
        },
      ],
    },
  ]

  const handleOnPostalCodeChange = (event: any) => {
    setPostalCode(event.target.value)
  }

  const handleOnPointNameChange = (event: any) => {
    setPointName(event.target.value)
  }

  const handleOnPhoneNumberChange = (event: any) => {
    setPhoneNumber(event.target.value)
  }

  const handleOnWebsiteChange = (event: any) => {
    setWebsite(event.target.value)
  }

  const handleOnEmailChange = (event: any) => {
    setEmail(event.target.value)
  }

  const handleOnCountryCodeChange = (event: any) => {
    setCountryCode(event.target.value)
  }

  const handleOnBrandCodeChange = (event: any) => {
    setBrandCode(event.target.value)
  }

  const handleOnSearchClick = () => {
    if (postalCode || brandCode || countryCode) {
      const country =
        countryList.find((c) => c.value === countryCode)?.label ?? ''

      const brand = brandList.find((b) => b.value === brandCode)?.label ?? ''
      const brandQuery = brand ? `brand="${brand}"` : ''
      const countryQuery = country ? `country="${country}"` : ''
      const postalCodeQuery = postalCode ? `zipcode="${postalCode}"` : ''
      const where = `pointType="${pointType}" AND (${postalCodeQuery}${
        postalCodeQuery ? ` AND ${countryQuery}` : countryQuery
      }${
        brandQuery
          ? postalCodeQuery || countryQuery
            ? ` AND ${brandQuery}`
            : brandQuery
          : ''
      })`

      fetchMapPoints(where)
    }
  }

  const handleOnClearClick = () => {
    setPostalCode('')
    setCountryCode('')
    setBrandCode('')
  }

  const mapPointList = (
    <div style={{ width: '15vw', height: '80vh', marginRight: '2.5vw' }}>
      <div role="button" className={`${styles.listWrapper}`}>
        {dealerData.map((dealer: any) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            aria-hidden="true"
            style={{
              border: '2px solid #e5e5e5',
              lineHeight: 2,
            }}
            className={`${styles.listItem}`}
            key={dealer.name}
            onClick={() => {
              setCenter(dealer.location)
              setZoom(20)
            }}
          >
            <div>
              <strong>{dealer.name}</strong>
            </div>
            <div>{dealer.email}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const zoomButtons = (
    <div
      style={{
        width: 'fit-content',
        border: '2px solid #e5e5e5',
        borderRadius: '10px',
        marginBottom: '1rem',
      }}
    >
      <Button
        variation="tertiary"
        onClick={() => {
          setZoom(zoom + 1)
        }}
      >
        <img
          src="https://cloudab2b.vteximg.com.br/arquivos/MagnifyingGlassPlus.png"
          alt="zoomIn"
        />
      </Button>
      <Button
        variation="tertiary"
        onClick={() => {
          setZoom(zoom - 1)
        }}
      >
        <img
          src="https://cloudab2b.vteximg.com.br/arquivos/MagnifyingGlassMinus.png"
          alt="zoomIn"
        />
      </Button>
    </div>
  )

  return (
    <div>
      <div className={`mb5 flex justify-end ${styles.dealerMapButton}`}>
        {enableFilterbyCountry ? (
          <div className={`${styles.countryDropDown}`}>
            <Dropdown
              placeholder="Country"
              options={countryList}
              onChange={handleOnCountryCodeChange}
              value={countryCode}
            />
          </div>
        ) : (
          <div />
        )}
        {enableFilterbyBrand ? (
          <div className={`${styles.brandDropDown}`}>
            <Dropdown
              placeholder="Brand"
              options={brandList}
              onChange={handleOnBrandCodeChange}
              value={brandCode}
            />
          </div>
        ) : (
          <div />
        )}
        {enableFilterbyPostalCode ? (
          <div className={`${styles.postalCodeButton}`}>
            <Input
              placeholder="Postal code"
              onChange={handleOnPostalCodeChange}
              value={postalCode}
              f={postalCode}
            />
          </div>
        ) : (
          <div />
        )}
        {enableFilterbyPointName ? (
          <div>
            <Input
              placeholder="Point Name"
              onChange={handleOnPointNameChange}
              value={pointName}
              f={pointName}
            />
          </div>
        ) : (
          <div />
        )}
        {enableFilterbyPhoneNumber ? (
          <div>
            <Input
              placeholder="Phone Number"
              onChange={handleOnPhoneNumberChange}
              value={phoneNumber}
              f={phoneNumber}
            />
          </div>
        ) : (
          <div />
        )}
        {enableFilterbyWebsite ? (
          <div>
            <Input
              placeholder="Website"
              onChange={handleOnWebsiteChange}
              value={website}
              f={website}
            />
          </div>
        ) : (
          <div />
        )}
        {enableFilterbyEmail ? (
          <div>
            <Input
              placeholder="E-mail"
              onChange={handleOnEmailChange}
              value={email}
              f={email}
            />
          </div>
        ) : (
          <div />
        )}
        {enableFilterbyCountry ||
        enableFilterbyBrand ||
        enableFilterbyEmail ||
        enableFilterbyWebsite ||
        enableFilterbyPointName ||
        enableFilterbyPhoneNumber ||
        enableFilterbyPostalCode ? (
          <div className={`${styles.searchButton}`}>
            <Button onClick={handleOnSearchClick}>Search</Button>
            <Button onClick={handleOnClearClick}>Clear</Button>
          </div>
        ) : (
          <div />
        )}
      </div>
      <div className="flex">
        <div>{showMapPointerList ? mapPointList : <div />}</div>
        <div style={{ width: '100vw', height: '90vh' }}>
          <div>{externalZoomButton ? zoomButtons : <div />}</div>
          <MapWrapped
            delarData={dealerData}
            center={center}
            defaultCenter={defaultCenter}
            zoom={zoom}
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAR-kwSuUJHUePQeccKOA1xz6HlY0GBZHE"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            mapStyler={mapStyles}
            defaultZoom={defaultZoom}
          />
        </div>
      </div>
    </div>
  )
}

export default MapLayout

MapLayout.schema = {
  title: 'Map details',
  description: 'Map Details',
  type: 'object',
  properties: {
    pointType: {
      title: 'Point type',
      description: 'Point types to be shown in the map',
      type: 'string',
      default: 'dealer',
    },
    enableFilterbyCountry: {
      title: 'Show Country Filter',
      description: 'Show the county filter',
      type: 'boolean',
    },
    enableFilterbyBrand: {
      title: 'Show Brand Filter',
      description: 'Show the Brand filter',
      type: 'boolean',
    },
    enableFilterbyEmail: {
      title: 'Show E-mail Filter',
      description: 'Show the e-mail filter',
      type: 'boolean',
    },
    enableFilterbyWebsite: {
      title: 'Show Website Filter',
      description: 'Show the website filter',
      type: 'boolean',
    },
    enableFilterbyPointName: {
      title: 'Show Point Name Filter',
      description: 'Show the Point name filter',
      type: 'boolean',
    },
    enableFilterbyPhoneNumber: {
      title: 'Show Phone Number Filter',
      description: 'Show the phone number filter',
      type: 'boolean',
    },
    enableFilterbyPostalCode: {
      title: 'Show Postal Code Filter',
      description: 'Show the postal code filter',
      type: 'boolean',
    },
  },
}


