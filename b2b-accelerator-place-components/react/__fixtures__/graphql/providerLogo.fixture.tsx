import { Query } from 'vtex.geolocation-graphql-interface'
import { MockedResponse } from '@apollo/react-testing'

import PROVIDER_LOGO from '../../graphql/providerLogo.graphql'

export const googleLogo: MockedResponse = {
  request: {
    query: PROVIDER_LOGO,
  },
  result: {
    data: {
      providerLogo: {
        src:
          'https://user-images.githubusercontent.com/26108090/100493516-45802680-3116-11eb-9028-06c336a587a7.png',
        alt: 'Google logo',
      },
    } as Query,
  },
}
