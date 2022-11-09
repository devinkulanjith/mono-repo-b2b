import type { FC, PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Modal, Button } from 'vtex.styleguide'
import { useQuery, useMutation } from 'react-apollo'
import { defineMessages, useIntl } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

import { SoldToAccountListProvider } from './SoldToAccountListContext'
import ORDER_SOLD_TO_ACCOUNT_QUERY from './queries/orderSoldToAccount.graphql'
import SET_SOLD_TO_ACCOUNT_MUTATION from './mutations/setSoldToAccount.graphql'

type Props = {
  term?: string
  currentPage?: number
  from?: number
  to?: number
  sortBy?: string
  sortOrder?: string
  pageSize?: number
  isModalOpen?: boolean
  classes?: any
}

const CSS_HANDLES = [
  'soldToAccountListWrapper',
  'tagWrapper',
  'soldToAccountModal',
] as const

const messages = defineMessages({
  SelectSoldTo: {
    defaultMessage: '',
    id: 'store/checkout-simulation.sold-to-account-list-wrapper.SelectSoldTo',
  },
})

const SoldToAccountListWrapper: FC<PropsWithChildren<Props>> = ({
  children,
  currentPage = 1,
  term = '',
  sortBy = 'createdIn',
  sortOrder = 'DESC',
  pageSize = 5,
  classes,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const { loading, data, refetch } = useQuery(ORDER_SOLD_TO_ACCOUNT_QUERY, {
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  const { push } = usePixel()

  const selectedSoldAccount = data?.getOrderSoldToAccount
  const [isModalOpen, setModalOpen] = useState(false)
  const [setSoldToAccount] = useMutation(SET_SOLD_TO_ACCOUNT_MUTATION, {
    onCompleted: res => {
      if (res.setSoldToAccount.soldToAccountSet) {
        refetch()
        const pixelEvent = {
          id: 'sbdsef-set-sold-to',
          event: 'setSoldTo',
          soldTo: res.setSoldToAccount.selectedSoldTo,
        }

        push(pixelEvent)
      }

      setModalOpen(res.setSoldToAccount.hasMultipleSoldToAccounts)
    },
  })

  useEffect(() => {
    if (!loading && !selectedSoldAccount) {
      setSoldToAccount()
    }
  }, [loading, selectedSoldAccount])

  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }

  const intl = useIntl()

  return (
    <div className={`flex items-center ${handles.tagWrapper}`}>
      <span className="mr4">
        {data?.getOrderSoldToAccount ? (
          <Button variation="dark" onClick={() => setModalOpen(true)}>
            {!data?.getOrderSoldToAccount
              ? 'Fetching sold to account...'
              : `${data?.getOrderSoldToAccount.customerNumber}`}
          </Button>
        ) : (
          <Button variation="dark" onClick={() => setModalOpen(true)}>
            {intl.formatMessage(messages.SelectSoldTo)}
          </Button>
        )}
      </span>
      <Modal centered isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className={handles.soldToAccountModal}>
          <SoldToAccountListProvider
            term={term}
            sortBy={sortBy}
            sortOrder={sortOrder}
            currentPage={currentPage}
            pageSize={pageSize}
            selectedSoldToAccount={data?.getOrderSoldToAccount}
            toggleModal={toggleModal}
          >
            <div
              className={`mw9 center flex justify-center items-center ${handles.soldToAccountListWrapper}`}
            >
              {children}
            </div>
          </SoldToAccountListProvider>
        </div>
      </Modal>
    </div>
  )
}

export default SoldToAccountListWrapper
