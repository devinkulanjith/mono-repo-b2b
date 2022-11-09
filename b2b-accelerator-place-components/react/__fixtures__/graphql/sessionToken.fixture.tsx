import { Query } from 'vtex.geolocation-graphql-interface'
import { MockedResponse } from '@apollo/react-testing'

import SESSION_TOKEN from '../../graphql/sessionToken.graphql'

export const DEFAULT_SESSION_TOKEN = 'default session token'

export const defaultSessionToken: MockedResponse = {
  request: {
    query: SESSION_TOKEN,
  },
  result: {
    data: {
      sessionToken: DEFAULT_SESSION_TOKEN,
    } as Query,
  },
}
