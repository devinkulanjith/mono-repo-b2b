import {
  MAP_DATA_ACRONYM,
  MAP_DATA_FIELDS,
  MAP_DATA_SCHEMA,
} from '../utils/const'

export const getMapPoints = async (
  _: any,
  { pageSize, page }: SearchArgs,
  { clients: { masterdata: mdClient } }: Context
) => {
  const mapdata = await mdClient.searchDocumentsWithPaginationInfo({
    dataEntity: MAP_DATA_ACRONYM,
    schema: MAP_DATA_SCHEMA,
    fields: MAP_DATA_FIELDS,
    pagination: { pageSize, page },
  })

  return {
    Points: mapdata.data,
    pagination: mapdata.pagination,
  }
}

export const createMapPoint = async (
  _: any,
  { mapPoint }: { mapPoint: MapPointInput },
  { clients: { masterdata: mdClient } }: Context
) => {
  let result: any = {}

  // eslint-disable-next-line no-console
  console.log('Map point : ', mapPoint)

  const saveMapPoint = await mdClient.createDocument({
    dataEntity: MAP_DATA_ACRONYM,
    schema: MAP_DATA_SCHEMA,
    fields: mapPoint,
  })

  if (saveMapPoint?.DocumentId) {
    result = await mdClient.getDocument({
      dataEntity: MAP_DATA_ACRONYM,
      id: saveMapPoint.DocumentId,
      fields: MAP_DATA_FIELDS,
    })
  } else {
    result = saveMapPoint
  }

  return result
}

export const removePoint = async (
  _: any,
  { id }: RemovePoint,
  { clients: { masterdata: mdClient } }: Context
) => {
  // eslint-disable-next-line no-console
  console.log('Id : ', id)
  const removeResponse = await mdClient.deleteDocument({
    dataEntity: MAP_DATA_ACRONYM,
    id,
  })

  return removeResponse.status === 204
}
