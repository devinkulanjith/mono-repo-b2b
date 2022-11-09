import { Query, QueryAddressArgs } from 'vtex.geolocation-graphql-interface'
import { MockedResponse } from '@apollo/react-testing'

import ADDRESS from '../../graphql/address.graphql'
import { DEFAULT_SESSION_TOKEN } from './sessionToken.fixture'
import { vtexOfficeAddress } from '../address.fixture'

export const simpleSuggestedAddress: MockedResponse = {
  request: {
    query: ADDRESS,
    variables: {
      externalId: '1',
      sessionToken: DEFAULT_SESSION_TOKEN,
    } as QueryAddressArgs,
  },
  result: {
    data: {
      address: vtexOfficeAddress,
    } as Query,
  },
}
