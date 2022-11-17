import { useCssHandles } from 'vtex.css-handles'
import React, { useEffect, useState } from 'react'
import { GoogleMap, InfoWindow, Marker } from 'react-google-maps'

const CSS_HANDLES = [
  'inforWindowWebsite',
  'inforWindowWebsiteLink',
  'inforWindowPhoneNumber',
  'inforWindowPhoneIcon',
  'inforWindowAddress',
  'inforWindowAddressIcon',
  'inforWindowEmail',
  'inforWindowEmailIcon',
  'inforWindowStoreName',
  'emailLink',
  'phoneNumberLink',
]

type Point = {
  id: string
  pointName: string
  phoneNumber: string
  brand: string
  website: string
  address: string
  zipcode: string
  country: string
  lng: number
  lat: number
  email: string
}

export function Map({
  zoom = 4,
  center,
  delarData,
  mapStyler,
  defaultZoom,
  defaultCenter,
}: {
  zoom: number
  center: { lat: number; lng: number }
  delarData: [Point]
  mapStyler: any
  defaultZoom: number
  defaultCenter: { lat: number; lng: number }
}) {
  const mapStyles = useCssHandles(CSS_HANDLES)
  const [selectedPark, setSelectedPark] = useState<Point | null>()

  useEffect(() => {
    const listener = (e: any) => {
      if (e.key === 'Escape') {
        setSelectedPark(null)
      }
    }

    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [])


  return (
    <div>
      <GoogleMap
        defaultZoom={defaultZoom}
        zoom={zoom}
        defaultCenter={defaultCenter}
        center={center}
        defaultOptions={{ styles: mapStyler }}
      >
        {delarData.map((place) => {
          return (
            <Marker
              key={place.pointName}
              position={{ lat: place?.lat, lng: place?.lng }}
              onClick={() => setSelectedPark(place)}
              icon="https://sbdind.vteximg.com.br/arquivos/mapIcon.png"
            >
              {selectedPark &&
                selectedPark.lng === place.lng &&
                selectedPark.lat === place.lat && (
                  <InfoWindow
                    onCloseClick={() => {
                      setSelectedPark(null)
                    }}
                  >
                    <div>
                      <h2 className={`${mapStyles.inforWindowStoreName}`}>
                        {selectedPark?.pointName}
                      </h2>
                      <p className={`${mapStyles.inforWindowWebsite}`}>
                        <a
                          className={mapStyles.inforWindowWebsiteLink}
                          href={selectedPark?.website}
                        >
                          {selectedPark?.website}
                        </a>
                      </p>
                      <div className="flex items-center">
                        <img
                          className={`${mapStyles.inforWindowPhoneIcon}`}
                          alt="Phone Icon"
                          src="https://sbdind.vteximg.com.br/arquivos/blackPhoneIcon.png"
                        />
                        <p className={`${mapStyles.inforWindowPhoneNumber}`}>
                          <a
                            className={`${mapStyles.phoneNumberLink}`}
                            href={`tel:${selectedPark?.phoneNumber}`}
                          >
                            {selectedPark?.phoneNumber}
                          </a>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <img
                          className={`${mapStyles.inforWindowAddressIcon}`}
                          alt="Address Icon"
                          src="https://sbdind.vteximg.com.br/arquivos/addressPin.png"
                        />
                        <p className={`${mapStyles.inforWindowAddress}`}>
                          {selectedPark?.address}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <img
                          className={`${mapStyles.inforWindowEmailIcon}`}
                          alt="Phone Icon"
                          src="https://sbdind.vteximg.com.br/arquivos/emailIcon.png"
                        />
                        <p className={`${mapStyles.inforWindowEmail}`}>
                          <a
                            className={`${mapStyles.emailLink}`}
                            href={`mailto:${selectedPark.email}`}
                          >
                            {selectedPark?.email}
                          </a>
                        </p>
                      </div>
                    </div>
                  </InfoWindow>
                )}
            </Marker>
          )
        })}
      </GoogleMap>
    </div>
  )
}
