import type {
  ClientsConfig,
  ServiceContext,
  RecorderState,
  ParamsContext,
  IOContext,
  SegmentData,
  EventContext,
} from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'
import { prop } from 'ramda'

import { Clients } from './clients'
import { status } from './middlewares/status'
import { health } from './middlewares/health'
import {
  soldToAccounts,
  shipToAccounts,
  orgAccount,
} from './middlewares/shipping'
import {
  validateSoldTo,
  validateOrgAccountById,
} from './middlewares/validateSoldTo'
import { validateShipTo } from './middlewares/validateShipTo'
import { validate } from './middlewares/validate'
import { validateSimulation } from './middlewares/validateSimulation'
import { simulate } from './middlewares/simulate'
import { validatePunchoutData } from './middlewares/validatePunchoutData'
import { simulateAndValidatePunchoutOrder } from './middlewares/simulateAndValidatePunchoutOrder'
import {
  removeCustomData,
  setShippingInformation,
  validateItems,
  updateItemMetadata,
} from './middlewares/checkout'
import {
  validateOrderFormIdExistence,
  validateRemoveCustomData,
  validateSessionTokenExistence,
} from './middlewares/checkout/validate'
import { book } from './resolvers/book'
import { books } from './resolvers/books'
import { deleteBook } from './resolvers/delete'
import { editBook } from './resolvers/editBook'
import { newBook } from './resolvers/newBook'
import { source } from './resolvers/source'
import { total } from './resolvers/total'
import { getItemMetadata } from './resolvers/itemMetadata'
import { orderInvoice } from './handlers/orderInvoice'
import { taxSimulation } from './handlers/taxSimulation'
import { handleOrderCreate } from './handlers/createOrder'
import { validateCheckoutAuthorization } from './handlers/validateCheckoutAuthorization'
import { getTaxConfiguration } from './resolvers/getTaxConfiguration'
import { setTaxConfiguration } from './resolvers/setTaxConfiguration'
import {
  updateUnitOfMeasurement as updateUnitOfMeasurementMutation,
  orderForm,
} from './resolvers/checkout'
import {
  assignedSoldToAccounts,
  getOrderSoldToAccount,
  setOrderSoldToAccount,
  invalidateSimulation,
} from './resolvers/soldToAccounts'
import { validate as validateShippingInformation } from './middlewares/validateShippingInformation'
import { schemaDirectives } from './directives'
import type { SandboxResponseType } from './typings/common'
import type { OrgAccount } from './typings/vtexShipping'
import { validateAuth } from './middlewares/validateAuth'
import { getAvailabilityInfo } from './resolvers/getEcomLogic'
import { setSoldToAccount } from './resolvers/setSoldToAccount'
import type { OrderForm } from './typings/orderForm'

const TIMEOUT_MS = 80000

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  interface CustomIOContext extends IOContext {
    segment?: SegmentData
    orderFormId?: string
    storeUserSessionToken?: string
  }

  interface CustomContext extends ParamsContext {
    cookie: string
    originalPath: string
    vtex: CustomIOContext
    graphql: {
      cacheControl: {
        noStore: boolean
        noCache: boolean
      }
    }
  }

  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State, CustomContext>

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    code: number
    userProfileId: string
    soldTo: string
    sandboxResponseType: SandboxResponseType
    isSandboxMode: boolean
    orderFormId: string
    refreshOutdatedData: boolean
    appId: string
    fieldName: string
    shipTo: string
    shipToCustomerNumber: string
    shipToAccount: OrgAccount
    poNumber: string
    requiredDeliveryDate: string
    orgAccountId: string
    punchoutOrderValidationRequest: OrderForm
    storeUserSessionToken: string
  }

  interface StatusChangeContext extends EventContext<Clients> {
    body: {
      domain: string
      orderId: string
      currentState: string
      lastState: string
      currentChangeDate: string
      lastChangeDate: string
    }
  }
}

// Export a service that defines route handlers and client options.
export default new Service<Clients, State, CustomContext>({
  clients,
  events: {
    handleOrderCreate,
  },
  routes: {
    // `status` is the route ID from service.json. It maps to an array of middlewares (or a single handler).
    status: method({
      GET: [validate, status],
    }),
    healthCheck: method({
      GET: [health],
    }),
    orgAccount: method({
      GET: [validateAuth, validateOrgAccountById, orgAccount],
    }),
    soldToAccounts: method({
      GET: [validateAuth, validateSoldTo, soldToAccounts],
    }),
    shipToAccounts: method({
      GET: [validateAuth, validateShipTo, shipToAccounts],
    }),
    simulate: method({
      POST: [
        validateAuth,
        validateSimulation,
        validateSessionTokenExistence,
        simulate,
      ],
    }),
    punchoutOrderDataValidation: method({
      POST: [validatePunchoutData, simulateAndValidatePunchoutOrder],
    }),
    removeCustomData: method({
      DELETE: [validateAuth, validateRemoveCustomData, removeCustomData],
    }),
    setShippingInformation: method({
      POST: [validateAuth, validateShippingInformation, setShippingInformation],
    }),
    updateItemMetadata: method({
      POST: [validateAuth, validateOrderFormIdExistence, updateItemMetadata],
    }),
    orderInvoice: [orderInvoice],
    taxSimulation: [validateCheckoutAuthorization, taxSimulation],
    validateOrderFormItems: [validateOrderFormIdExistence, validateItems],
  },
  graphql: {
    resolvers: {
      Book: {
        cacheId: prop('id'),
      },
      SoldToAccount: {
        cacheId: (sa: OrgAccount) => sa.id,
        fullAddress: (sa: OrgAccount) =>
          [sa.street, sa.city, sa.state, sa.postalCode, sa.country]
            .filter(addressPart => addressPart && addressPart.length > 0)
            .join(', '),
      },
      Mutation: {
        delete: deleteBook,
        editBook,
        newBook,
        setTaxConfiguration,
        setOrderSoldToAccount,
        updateUnitOfMeasurement: updateUnitOfMeasurementMutation,
        invalidateSimulation,
        setSoldToAccount,
      },
      Query: {
        book,
        books,
        source,
        total,
        getTaxConfiguration,
        assignedSoldToAccounts,
        getOrderSoldToAccount,
        itemMetadata: getItemMetadata,
        orderForm,
        getAvailabilityInfo,
      },
    },
    schemaDirectives,
  },
})
