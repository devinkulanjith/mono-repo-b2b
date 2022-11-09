import { MetricsAccumulator } from '@vtex/api'

if (!global.metrics) {
  console.error('No global.metrics at require time')
  global.metrics = new MetricsAccumulator()
}

declare global {
  // type Context = ServiceContext<Clients, void, CustomContext>
  interface SearchArgs {
    pageSize: number
    page: number
    where?: string
    skuId: string
    soc?: string
    skuRefId: string
  }

  interface MapData {
    id: string
    pointName: string
    phoneNumber: string
    brand: string
    website: string
    address: string
    zipcode: string
    country: string
    lng: number
    lat: number
    // installments: number[]
  }

  interface MapPointInput {
    id: string
    pointName: string
    phoneNumber: string
    brand: string
    website: string
    address: string
    zipcode: string
    country: string
    lng: number
    lat: number
    // installments: number[]
  }

  interface ClientBrand {
    brand: string
    client: string
    targetSystem: string
  }

  interface MoqUM {
    unitMultiplier: string
    minOrderQuantity: string
  }

  interface Pagination {
    pageSize: number
    page: number
    total: number
  }

  interface MapDataList {
    pagination: Pagination
    data: MapData[]
  }
  interface BrandForClients {
    pagination: Pagination
    data: ClientBrand[]
  }
  interface UnitMultiplierMoQ {
    pagination: Pagination
    data: MoqUM
  }
  interface RemovePoint {
    id: string
  }
}
