import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { defineMessages, useIntl } from 'react-intl'
import { Pagination, FilterBar, Input, Alert } from 'vtex.styleguide'

import {
  useSoldToAccounts,
  useSoldToAccountsDispatch,
} from './SoldToAccountListContext'
import SoldToAccount from './components/SoldToAccount'

type Props = {
  name: string
}

export type SoldToAccount = {
  cacheId: string
  customerNumber: string
  receiverName: string
  corporateName: string
  fullAddress: string
  accountExists: boolean
}

export type Pagination = {
  page: number
  pageSize: number
  total: number
}

export type SoldToAccountResponse = {
  assignedSoldToAccounts: {
    data: SoldToAccount[]
    pagination: Pagination
    performanceData: KeyValue[]
  }
}

export type FilterStatement = {
  object: string
  subject: string
  verb: string
}

const CSS_HANDLES = [
  'tableWrapper',
  'soldToAccountSelectorContainer',
  'soldToAccountSelectorSubContainer',
  'soldToAccountTitle',
  'soldToAccountFilters',
  'soldToAccountList',
  'soldToAccountPagination',
  'tableControls',
] as const

const messages = defineMessages({
  chooseSoldToAccount: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.chooseSoldToAccount',
  },
  customerNumber: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.customerNumber',
  },
  clearAllFiltersButtonLabel: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.clearAllFiltersButtonLabel',
  },
  textShowRows: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.textShowRows',
  },
  textOf: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.textOf',
  },
  selectAccount: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.selectAccount',
  },
  columnId: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.columnId',
  },
  columnCustomerNumber: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.columnCustomerNumber',
  },
  sortOption_is: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.sortOption_is',
  },
  sortOption_contains: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-selector.sortOption_contains',
  },
})

const SoldToAccountSelector: StorefrontFunctionComponent<Props> = () => {
  const { soldToAccounts, pageSize, currentPage, total, filterStatements } =
    useSoldToAccounts()

  const intl = useIntl()

  const dispatch = useSoldToAccountsDispatch()
  const { handles } = useCssHandles(CSS_HANDLES)
  const [error, setError] = useState<string | undefined>(undefined)

  // const inputSearch = {
  //   value: tableSearchTerm,
  //   placeholder: 'Try dealer email here',
  //   onChange: (e: any) => {
  //     setTableSearchTerm(e.target.value)
  //   },
  //   onClear: () => dispatch({ type: 'SET_TERM', args: { term: '' } }),
  //   onSubmit: (e: any) =>
  //     dispatch({
  //       type: 'SET_TERM',
  //       args: { term: e.target.value },
  //     }),
  // }

  const pagination = {
    onNextClick: () => {
      dispatch({
        type: 'SET_CURRENT_PAGE',
        args: { currentPage: currentPage + 1 },
      })
    },
    onPrevClick: () => {
      if (currentPage === 1) {
        return
      }

      dispatch({
        type: 'SET_CURRENT_PAGE',
        args: { currentPage: currentPage - 1 },
      })
    },
    currentItemFrom: (currentPage - 1) * (pageSize ?? 5) + 1,
    currentItemTo: (currentPage - 1) * (pageSize ?? 5) + (pageSize ?? 5),
    onRowsChange: (_: any, value: string) => {
      dispatch({
        type: 'SET_PAGE_SIZE',
        args: { pageSize: parseInt(value, 10) },
      })
    },
    selectedOption: pageSize,
    textShowRows: intl.formatMessage(messages.textShowRows),
    textOf: intl.formatMessage(messages.textOf),
    totalItems: total ?? 0,
    rowsOptions: [5, 10, 15],
  }

  function simpleInputObject({
    values,
    onChangeObjectCallback,
  }: {
    values: any
    onChangeObjectCallback: any
  }) {
    return (
      <Input
        value={values || ''}
        onChange={(e: any) => onChangeObjectCallback(e.target.value)}
      />
    )
  }

  function simpleInputVerbsAndLabel() {
    return {
      renderFilterLabel: (st: any) => {
        if (!st || !st.object) {
          // you should treat empty object cases only for alwaysVisibleFilters
          return 'Any'
        }

        return `${
          st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains'
        } ${st.object}`
      },
      verbs: [
        {
          label: intl.formatMessage(messages.sortOption_is),
          value: '=',
          object: {
            renderFn: simpleInputObject,
            extraParams: {},
          },
        },
        {
          label: intl.formatMessage(messages.sortOption_contains),
          value: 'contains',
          object: {
            renderFn: simpleInputObject,
            extraParams: {},
          },
        },
      ],
    }
  }

  const filters = {
    alwaysVisibleFilters: ['soldToCustomerNumber'],
    statements: filterStatements,
    onChangeStatements: (statements: FilterStatement[] = []) => {
      dispatch({
        type: 'SET_FILTER_STATEMENTS',
        args: { statements },
      })
    },
    clearAllFiltersButtonLabel: intl.formatMessage(
      messages.clearAllFiltersButtonLabel
    ),
    collapseLeft: true,
    options: {
      // receiverName: {
      //   label: 'Receiver Name',
      //   ...simpleInputVerbsAndLabel(),
      // },
      soldToCustomerNumber: {
        label: intl.formatMessage(messages.customerNumber),
        ...simpleInputVerbsAndLabel(),
      },
    },
  }

  return (
    <div
      className={`flex items-center ${handles.soldToAccountSelectorContainer}`}
    >
      {/* Dealer */}
      <div className={`dark-gray ${handles.soldToAccountSelectorSubContainer}`}>
        <p className={`dark-gray ${handles.soldToAccountTitle}`}>
          {intl.formatMessage(messages.chooseSoldToAccount)}
        </p>
        <div className={`${handles.tableWrapper}`}>
          <div className={`${handles.tableControls}`}>
            <div className={`mb3 ${handles.soldToAccountFilters}`}>
              <FilterBar {...filters} />
            </div>
            <div className={`mb3 ${handles.soldToAccountList}`}>
              {(soldToAccounts ?? []).map(soldToAccount => (
                <SoldToAccount
                  key={`sold-to-account-${soldToAccount.cacheId}`}
                  soldToAccount={soldToAccount}
                  setError={setError}
                />
              ))}
            </div>
          </div>
          <div className={`${handles.soldToAccountPagination}`}>
            <Pagination {...pagination} />
          </div>
          {error && <Alert type="error">{error}</Alert>}
        </div>
      </div>
    </div>
  )
}

export default SoldToAccountSelector
