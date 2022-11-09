import { Address } from 'vtex.places-graphql'

export const emptyAddress: Address = {
  street: '',
  number: '',
  complement: '',
  postalCode: '',
  city: '',
  state: '',
  addressId: '',
  addressType: null,
  country: '',
  geoCoordinates: [],
  neighborhood: '',
  receiverName: null,
  reference: null,
}

export const completeAddress: Address = {
  street: 'Av. Belgrano',
  number: '2248',
  complement: 'B',
  postalCode: '2000',
  city: 'Rosario',
  state: 'Santa Fé',
  addressId: '',
  addressType: null,
  country: 'ARG',
  geoCoordinates: [],
  neighborhood: 'Las Delicias',
  receiverName: null,
  reference: null,
}

export const incompleteAddress: Address = {
  street: 'Av. Belgrano',
  number: '2248',
  complement: '',
  postalCode: '2000',
  city: '',
  state: '',
  addressId: '',
  addressType: null,
  country: 'ARG',
  geoCoordinates: [],
  neighborhood: '',
  receiverName: null,
  reference: null,
}

export const sampleAddress: Address = {
  street: 'Rua Afonso Camargo',
  number: '805',
  complement: '',
  postalCode: '85070-200',
  city: 'Guarapuava',
  state: 'PR',
  addressId: '',
  addressType: null,
  country: 'BRA',
  geoCoordinates: [],
  neighborhood: 'Santana',
  receiverName: null,
  reference: null,
}

export const vtexOfficeAddress: Address = {
  addressId: '1',
  addressType: 'residential',
  city: 'Rio de Janeiro',
  complement: null,
  country: 'BRA',
  geoCoordinates: [-43.18037200000001, -22.9418474],
  neighborhood: 'Botafogo',
  number: '200',
  postalCode: '22250-145',
  receiverName: null,
  reference: null,
  state: 'RJ',
  street: 'Rua Praia de Botafogo',
}
