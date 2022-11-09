import { UserInputError } from '@vtex/api'

import type { CL } from '../typings/vtexShipping'
import { acronymClient } from '../utils/masterdata'
import { performSimulation } from '../modules/simulation'

export async function simulateAndValidatePunchoutOrder(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    state: { punchoutOrderValidationRequest },
    clients: { masterdata: mdClient },
  } = ctx

  const appData = (
    punchoutOrderValidationRequest.customData?.customApps ?? []
  ).find(app => app.id === 'checkout-simulation')

  if (!appData) {
    throw new UserInputError('Customer information invalid!')
  }

  const { items } = punchoutOrderValidationRequest
  const originalItemMetadata: ItemMetadata[] = JSON.parse(
    appData.fields.itemMetadata
  )

  let itemMetadata = originalItemMetadata

  if (items.length !== originalItemMetadata.length) {
    itemMetadata = originalItemMetadata
      .filter(metadata =>
        items.some(item => item.uniqueId === metadata.uniqueId)
      )
      .map(metadata => {
        const itemIndex =
          items.findIndex(item => item.uniqueId === metadata.uniqueId) ?? -1

        return {
          ...metadata,
          itemIndex,
        }
      })
  }

  const clUsers = await mdClient.searchDocuments<CL>({
    dataEntity: acronymClient,
    where: `(email=${appData.fields.clientEmail})`,
    fields: ['email', 'firstName', 'lastName'],
    pagination: { page: 1, pageSize: 1 },
  })

  const clUser = clUsers.find(cl => cl)

  if (!clUser) {
    throw new UserInputError('User not found!')
  }

  const { simulationResponse, newSalesChannel } = await performSimulation(
    clUser,
    punchoutOrderValidationRequest,
    ctx,
    undefined
  )

  ctx.status = 200
  ctx.body = {
    itemMetadata,
    simulationResponse,
    newSalesChannel,
  }
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}
