import {
  Query,
  QueryAddressSuggestionsArgs,
} from 'vtex.geolocation-graphql-interface'
import { MockedResponse } from '@apollo/react-testing'

import ADDRESS_SUGGESTIONS from '../../graphql/addressSuggestions.graphql'
import { DEFAULT_SESSION_TOKEN } from './sessionToken.fixture'

export const simpleSuggestions: MockedResponse = {
  request: {
    query: ADDRESS_SUGGESTIONS,
    variables: {
      searchTerm: 'Praia de Botafogo',
      sessionToken: DEFAULT_SESSION_TOKEN,
      country: 'BRA',
    } as QueryAddressSuggestionsArgs,
  },
  result: {
    data: {
      addressSuggestions: [
        {
          description: 'Praia de Botafogo, 200, Botafogo, Rio de Janeiro, RJ',
          mainText: 'Praia de Botafogo, 200',
          mainTextMatchInterval: {
            offset: 0,
            length: 0,
          },
          secondaryText: 'Botafogo, Rio de Janeiro, RJ',
          externalId: '1',
        },
        {
          description: 'Praia de Botafogo, 300, Botafogo, Rio de Janeiro, RJ',
          mainText: 'Praia de Botafogo, 300',
          mainTextMatchInterval: {
            offset: 0,
            length: 0,
          },
          secondaryText: 'Botafogo, Rio de Janeiro, RJ',
          externalId: '2',
        },
      ],
    } as Query,
  },
}

export const simpleSuggestionWithoutToken: MockedResponse = {
  ...simpleSuggestions,
  request: {
    ...simpleSuggestions.request,
    variables: {
      ...simpleSuggestions.request.variables,
      sessionToken: null,
    } as QueryAddressSuggestionsArgs,
  },
}

export const noSuggestions: MockedResponse = {
  request: {
    query: ADDRESS_SUGGESTIONS,
    variables: {
      searchTerm: 'asdfasdfasdf',
      sessionToken: DEFAULT_SESSION_TOKEN,
      country: 'BRA',
    } as QueryAddressSuggestionsArgs,
  },
  result: {
    data: {
      addressSuggestions: [] as Query['addressSuggestions'],
    } as Query,
  },
}
