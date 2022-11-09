import {
  MAP_DATA_ACRONYM,
  MAP_DATA_FIELDS,
  MAP_DATA_SCHEMA,
} from '../utils/const'

export const getMapPoints = async (
  _: any,
  { pageSize, page, where }: SearchArgs,
  { clients: { masterdata: mdClient } }: Context
) => {
  let firstCall = false

  // eslint-disable-next-line no-console
  console.log(`where : ${where} ${where?.length}`)

  if ((where?.length ?? 0) > 6) {
    const phrase = where?.substr(0, 6)

    // eslint-disable-next-line no-console
    console.log('sub str : ', phrase)
    if (phrase === 'time=1') {
      firstCall = true
      where = where?.replace('time=1', '')
    }

    // eslint-disable-next-line no-console
    console.log('First Call : ', firstCall)
    // eslint-disable-next-line no-console
    console.log(`where : ${where}`)
  }

  const mapdata = await mdClient.searchDocumentsWithPaginationInfo({
    dataEntity: MAP_DATA_ACRONYM,
    fields: MAP_DATA_FIELDS,
    pagination: { pageSize, page },
    schema: MAP_DATA_SCHEMA,
    where,
  })

  // eslint-disable-next-line no-console
  console.log('Map points : ', mapdata)

  return {
    Points: mapdata.data,
    pagination: mapdata.pagination,
  }
}
