import {
  ParamsContext,
  RecorderState,
  Service,
  ServiceContext,
} from '@vtex/api'

import { getMapPoints } from './resolvers/resolver'
import { Clients } from './clients'

const TWO_SECONDS_MS = 2 * 1000

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 2,
        timeout: TWO_SECONDS_MS,
      },
    },
  },
  graphql: {
    resolvers: {
      Query: {
        getMapPoints,
      },
    },
  },
})
