import { MockedResponse } from '@apollo/react-testing'
import { Query, QueryReverseGeocodeArgs } from 'vtex.places-graphql'

import { vtexOfficeAddress } from '../address.fixture'
import REVERSE_GEOCODE_QUERY from '../../graphql/reverseGeocode.graphql'

const [lat, lng] = vtexOfficeAddress.geoCoordinates.map((coordinate) =>
  coordinate.toString()
)

export const reverseGeocode: MockedResponse = {
  request: {
    query: REVERSE_GEOCODE_QUERY,
    variables: {
      lat,
      lng,
    } as QueryReverseGeocodeArgs,
  },
  result: {
    data: {
      reverseGeocode: vtexOfficeAddress,
    } as Query,
  },
}
