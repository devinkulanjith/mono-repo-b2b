import React from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { Table } from 'vtex.styleguide'

import GET_MAP_POINTS from '../query/getMappoints.graphql'
import REMOVE_MAP_POINT from '../mutations/removeMapPoints.graphql'

const MapPointData = () => {
  const [removeMapPoint] = useMutation(REMOVE_MAP_POINT)

  const handleOnChange = (deleteId: any) => {
    // eslint-disable-next-line no-console
    console.log('Row Data : ', deleteId)

    removeMapPoint({
      variables: {
        id: deleteId,
      },
    })
      .then((r: any) => alert(`Success Result : , ${JSON.stringify(r)}`))
      .catch((e: any) => alert(`error : ', ${JSON.stringify(e)}`))
  }

  let points: any = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schema = {
    properties: {
      id: {
        title: 'ID',
        hidden: true,
      },
      pointName: {
        title: 'Marker Name',
        width: 300,
      },
      brand: {
        title: 'Brand',
        minWidth: 350,
      },
      country: {
        title: 'Country',
        // default is 200px
        minWidth: 100,
      },
      lat: {
        title: 'Latitude',
        // default is 200px
        minWidth: 100,
      },
      lng: {
        title: 'Longitude',
        // default is 200px
        minWidth: 100,
      },
    },
  }

  const lineActions = [
    {
      label: ({ rowData }: any) => `Remove ${rowData.pointName}`,
      isDangerous: true,
      onClick: ({ rowData }: any) => handleOnChange(rowData.id),
    },
  ]

  const {
    data: mapPoints,
    loading: mapPointLoading,
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    error: mapPointError,
  } = useQuery(GET_MAP_POINTS, {
    ssr: false,
  })

  if (!mapPointLoading) {
    // eslint-disable-next-line no-console
    console.log('DATA : ', mapPoints)

    points = mapPoints?.getMapPoints?.Points
  }

  return (
    <div>
      <h2> System Map points</h2>
      <Table
        items={points}
        loading={mapPointLoading}
        schema={schema}
        lineActions={lineActions}
      />
    </div>
  )
}

export default MapPointData
