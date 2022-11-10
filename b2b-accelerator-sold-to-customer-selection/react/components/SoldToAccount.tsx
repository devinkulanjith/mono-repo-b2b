import type { Dispatch, FC, SetStateAction } from 'react'
import React from 'react'
import { Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import { SoldToAccount } from '../SoldToAccountSelector'
import SET_ORDER_SOLD_TO_ACCOUNT_MUTATION from '../mutations/setOrderSoldToAccount.graphql'
import ORDER_SOLD_TO_ACCOUNT_QUERY from '../queries/orderSoldToAccount.graphql'
import { useSoldToAccounts } from '../SoldToAccountListContext'

type Props = {
  soldToAccount: SoldToAccount
  setError: Dispatch<SetStateAction<string | undefined>>
}

const CSS_HANDLES = [
  'soldToAccountWrapper',
  'customerNumber',
  'customerAddress',
  'selectButton',
]

const SoldToAccount: FC<Props> = ({ soldToAccount, setError }) => {
  const [setOrderSoldToAccount, { loading }] = useMutation(
    SET_ORDER_SOLD_TO_ACCOUNT_MUTATION,
    {
      refetchQueries: [{ query: ORDER_SOLD_TO_ACCOUNT_QUERY }],
    }
  )

  const { toggleModal, selectedSoldToAccount } = useSoldToAccounts()
  const { handles } = useCssHandles(CSS_HANDLES)
  const intl = useIntl()

  return (
    <div
      className={`flex flex-wrap justify-between items-center bb b--light-gray pa3 ${handles.soldToAccountWrapper}`}
    >
      <div className={`${handles.customerNumber}`}>
        {soldToAccount.customerNumber}
      </div>

      <div className={`w-100 w-20-ns w-60-m pl4-m ${handles.customerAddress}`}>
        {soldToAccount.corporateName ? `${soldToAccount.corporateName}, ` : ''}
        {soldToAccount.fullAddress}
      </div>

      <div className={`${handles.selectButton}`}>
        <Button
          disabled={
            !soldToAccount.accountExists ||
            soldToAccount.cacheId === selectedSoldToAccount
          }
          isLoading={loading}
          onClick={() => {
            setOrderSoldToAccount({
              variables: {
                soldToAccount: soldToAccount.cacheId,
              },
            })
              .then(_result => {
                if (toggleModal) {
                  toggleModal()
                }

                window.location.reload()
              })
              .catch(e => {
                setError(
                  e.graphQLErrors.find((graphQlError: any) => graphQlError)
                    ?.message ?? 'Something went wrong!'
                )
              })
          }}
        >
          {intl.formatMessage(
            {
              id: 'store/checkout-simulation.sold-to-account-selector.selectAccount',
            },
            { available: soldToAccount.accountExists }
          )}
        </Button>
      </div>
    </div>
  )
}



export default SoldToAccount
