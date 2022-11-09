import type { FC, PropsWithChildren } from 'react'
import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages, useIntl } from 'react-intl'

import ASSIGNED_SOLD_TO_ACCOUNT_LIST_QUERY from './queries/assignedSoldToAccounts.graphql'
import ORDER_SOLD_TO_ACCOUNT_QUERY from './queries/orderSoldToAccount.graphql'
import type {
  SoldToAccountResponse,
  FilterStatement,
  SoldToAccount,
} from './SoldToAccountSelector'
import { keyValuePairsToString } from './utils/performanceDataProcessing'

export type SoldToAccountListState = {
  currentPage: number
  from?: number
  to?: number
  term?: string
  sortBy?: string
  sortOrder?: string
  soldToAccounts?: SoldToAccount[]
  selectedSoldToAccount?: string
  total?: number
  pageSize?: number
  filterStatements: FilterStatement[]
  toggleModal?: () => void
}

const messages = defineMessages({
  loading: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-list-provider.loading',
  },
  fetchError: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-list-provider.fetchError',
  },
})

const SoldToAccountListContext = createContext<
  SoldToAccountListState | undefined
>({
  currentPage: 1,
  from: 0,
  to: 5,
  term: '',
  sortBy: 'email',
  sortOrder: 'ASC',
  filterStatements: [],
  toggleModal: undefined,
})

type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V

export type Actions =
  | Action<'SET_TERM', { args: { term: string } }>
  | Action<'SET_CURRENT_PAGE', { args: { currentPage: number } }>
  | Action<'SET_FROM', { args: { from: number } }>
  | Action<'SET_TO', { args: { to: number } }>
  | Action<
      'SET_PAGINATION',
      { args: { currentPage: number; pageSize: number } }
    >
  | Action<'SET_PAGE_SIZE', { args: { pageSize: number } }>
  | Action<'SET_SORT_BY', { args: { sortBy: string } }>
  | Action<'SET_SORT_ORDER', { args: { sortOrder: string } }>
  | Action<'SET_SORT', { args: { sortBy: string; sortOrder: string } }>
  | Action<'SET_FILTER_STATEMENTS', { args: { statements: FilterStatement[] } }>
  | Action<
      'SET_SOLD_TO_ACCOUNTS',
      { args: { soldToAccounts: SoldToAccount[]; total: number } }
    >
  | Action<'SET_SELECTED_ITEM', { args: { selectedDealer: string } }>
  | Action<'SELECT_ITEM', { args: { id: string; quantity: number } }>
  | Action<'DESELECT_ITEM', { args: { id: string } }>

type Dispatch<A = Actions> = (action: A) => void

const SoldToAccountListDispatchContext = createContext<Dispatch | undefined>(
  undefined
)

const reducer = (
  state: SoldToAccountListState,
  action: Actions
): SoldToAccountListState => {
  switch (action.type) {
    case 'SET_TERM':
      return {
        ...state,
        term: action.args.term,
      }

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.args.currentPage,
      }

    case 'SET_FROM':
      return {
        ...state,
        from: action.args.from,
      }

    case 'SET_TO':
      return {
        ...state,
        to: action.args.to,
      }

    case 'SET_FILTER_STATEMENTS':
      return {
        ...state,
        filterStatements: action.args.statements,
      }

    case 'SET_PAGINATION':
      return {
        ...state,
        currentPage: action.args.currentPage,
        pageSize: action.args.pageSize,
      }

    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pageSize: action.args.pageSize,
        currentPage: 1,
      }

    case 'SET_SORT_BY':
      return {
        ...state,
        sortBy: action.args.sortBy,
      }

    case 'SET_SORT_ORDER':
      return {
        ...state,
        sortOrder: action.args.sortOrder,
      }

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.args.sortBy,
        sortOrder: action.args.sortOrder,
      }

    case 'SET_SELECTED_ITEM':
      return {
        ...state,
        selectedSoldToAccount: action.args.selectedDealer,
      }

    case 'SELECT_ITEM':
      // eslint-disable-next-line no-case-declarations
      const soldToAccount = (state.soldToAccounts ?? []).find(
        sa => sa.cacheId === action.args.id
      )

      return {
        ...state,
        soldToAccounts: [
          ...(state.soldToAccounts ?? []).filter(
            sa => sa.cacheId === action.args.id
          ),
          {
            ...soldToAccount!,
          },
        ],
      }

    case 'DESELECT_ITEM':
      // eslint-disable-next-line no-case-declarations
      const accountToRemove = (state.soldToAccounts ?? []).find(
        sa => sa.cacheId === action.args.id
      )

      return {
        ...state,
        soldToAccounts: [
          ...(state.soldToAccounts ?? []).filter(
            sa => sa.cacheId === action.args.id
          ),
          {
            ...accountToRemove!,
          },
        ],
      }

    case 'SET_SOLD_TO_ACCOUNTS':
      return {
        ...state,
        soldToAccounts: action.args.soldToAccounts,
        total: action.args.total,
        to:
          (state.from ?? 1) +
          Math.min(
            action.args.total % (state.pageSize ?? 5),
            state.pageSize ?? 5
          ) -
          1,
      }

    default:
      return state
  }
}

type Props = {
  currentPage: number
  term?: string
  sortBy?: string
  sortOrder?: string
  pageSize?: number
  selectedSoldToAccount?: string
  toggleModal: () => void
}

const SoldToAccountListProvider: FC<PropsWithChildren<Props>> = ({
  children,
  currentPage,
  term,
  pageSize,
  sortBy,
  sortOrder,
  selectedSoldToAccount,
  toggleModal,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    term,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    selectedSoldToAccount,
    filterStatements: [],
    toggleModal,
  })

  const intl = useIntl()

  const whereStatements = state.filterStatements.map(statement => {
    if (statement.verb === '=') {
      return `${statement.subject}=${statement.object}`
    }

    if (statement.verb === 'contains') {
      return `${statement.subject}=*${statement.object}*`
    }

    return `${statement.subject}=*${statement.object}*`
  })

  const {
    data: soldToAccountData,
    loading,
    error,
  } = useQuery<SoldToAccountResponse>(ASSIGNED_SOLD_TO_ACCOUNT_LIST_QUERY, {
    ssr: false,
    variables: {
      where: whereStatements.filter(st => st && st.length > 0).join(' OR '),
      page: state.currentPage,
      pageSize: state.pageSize,
      sortBy: `${state.sortBy} ${state.sortOrder}`,
    },
  })

  // TODO: Remove this line
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      keyValuePairsToString(
        soldToAccountData?.assignedSoldToAccounts?.performanceData
      ),
      null,
      2
    )
  )

  const { data } = useQuery(ORDER_SOLD_TO_ACCOUNT_QUERY, {
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    if (soldToAccountData) {
      dispatch({
        type: 'SET_SOLD_TO_ACCOUNTS',
        args: {
          soldToAccounts: (
            soldToAccountData.assignedSoldToAccounts.data ?? []
          ).map((soldToAccount: SoldToAccount) => ({
            ...soldToAccount,
            selected:
              soldToAccount.accountExists &&
              soldToAccount?.cacheId === data?.getOrderSoldToAccount?.cacheId,
          })),
          total: soldToAccountData.assignedSoldToAccounts.pagination.total,
        },
      })
    }
  }, [soldToAccountData, data])

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'SET_SELECTED_ITEM',
        args: {
          selectedDealer: data?.getOrderSoldToAccount?.cacheId,
        },
      })
    }
  }, [data])

  if (loading) {
    return <p>{intl.formatMessage(messages.loading)}</p>
  }

  if (
    error?.graphQLErrors.find(gE => gE)?.extensions?.exception.status === 401
  ) {
    return null
  }

  if (error?.graphQLErrors.find(gE => gE)?.message) {
    return <p>{error?.graphQLErrors.find(gE => gE)?.message}</p>
  }

  if (error) {
    return <p>{intl.formatMessage(messages.fetchError)}</p>
  }

  return (
    <SoldToAccountListContext.Provider value={state}>
      <SoldToAccountListDispatchContext.Provider value={dispatch}>
        {children}
      </SoldToAccountListDispatchContext.Provider>
    </SoldToAccountListContext.Provider>
  )
}

const useSoldToAccounts = () => {
  const context = useContext(SoldToAccountListContext)

  if (!context) {
    throw new Error('Use inside SoldToAccountListContext')
  }

  return context
}

const useSoldToAccountsDispatch = () => {
  const context = useContext(SoldToAccountListDispatchContext)

  if (!context) {
    throw new Error('Use inside SoldToAccountListDispatchContext')
  }

  return context
}

export {
  SoldToAccountListContext,
  SoldToAccountListDispatchContext,
  useSoldToAccounts,
  useSoldToAccountsDispatch,
  SoldToAccountListProvider,
}
