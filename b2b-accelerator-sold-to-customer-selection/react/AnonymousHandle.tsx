import type { FC } from 'react'
import { useEffect } from 'react'
import { useMutation, useQuery } from 'react-apollo'

import INVALIDATE_SIMULATION from './mutations/invalidateSimulation.graphql'
import ORDER_FORM from './queries/orderForm.graphql'
import SELECTED_SOLD_TO from './queries/orderSoldToAccount.graphql'

const AnonymousHandle: FC = () => {
  const { data, loading, error } = useQuery<{ orderForm: OrderForm }>(
    ORDER_FORM,
    { ssr: false }
  )

  const { refetch } = useQuery(SELECTED_SOLD_TO)

  const [invalidateSimulation] = useMutation<{
    invalidateSimulation: OrderForm
  }>(INVALIDATE_SIMULATION)

  useEffect(() => {
    if (
      (data?.orderForm.items ?? []).length > 0 ||
      (data?.orderForm.customData?.customApps ?? []).find(
        app => app.id === 'checkout-simulation'
      )?.fields
    ) {
      invalidateSimulation().then(invalidatedOrderForm => {
        if (invalidatedOrderForm.data?.invalidateSimulation) {
          refetch()
        }
      })
    }
  }, [data, invalidateSimulation, refetch])

  if (loading || error) {
    return null
  }

  return null
}

export default AnonymousHandle
