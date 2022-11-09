import React from 'react'
import { fireEvent, render, screen, waitFor } from '@vtex/test-tools/react'
import { MockedProvider, MockedResponse } from '@apollo/react-testing'
import { Address } from 'vtex.checkout-graphql'
import { AddressRules } from 'vtex.address-context/types'
import { AddressContextProvider } from 'vtex.address-context/AddressContext'

import DeviceCoordinates, { GeolocationPosition } from '../DeviceCoordinates'
import { reverseGeocode } from '../__fixtures__/graphql/reverseGeocode.fixture'
import { vtexOfficeAddress } from '../__fixtures__/address.fixture'

interface RenderComponentProps {
  deviceCoordinatesProps?: React.ComponentProps<typeof DeviceCoordinates>
  address?: Address | null
  countries?: string[]
  rules?: AddressRules
  graphqlMocks?: MockedResponse[]
}

const defaultGraphqlMocks = [] as MockedResponse[]

describe('Device Coordinates', () => {
  const renderComponent = ({
    deviceCoordinatesProps,
    address = { country: 'BRA' },
    countries = [],
    rules = {},
    graphqlMocks = [],
  }: RenderComponentProps) => {
    return render(
      <MockedProvider
        addTypename={false}
        mocks={[...defaultGraphqlMocks, ...graphqlMocks]}
      >
        <AddressContextProvider
          address={address}
          countries={countries}
          rules={rules}
        >
          <DeviceCoordinates {...deviceCoordinatesProps} />
        </AddressContextProvider>
      </MockedProvider>
    )
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('when geolocation is granted', () => {
    it('should get an address from coordinates', async () => {
      const callOrder: string[] = []

      const { query } = navigator.permissions
      const mockedPermissionsQuery = query as jest.MockedFunction<typeof query>

      mockedPermissionsQuery.mockImplementation((_permission) => {
        callOrder.push('permissions')

        return Promise.resolve({ state: 'granted' } as PermissionStatus)
      })

      Object.defineProperty(navigator, 'permissions', {
        get() {
          return { query: mockedPermissionsQuery }
        },
      })

      const { getCurrentPosition } = navigator.geolocation
      const mockedGetCurrentPosition = getCurrentPosition as jest.MockedFunction<
        typeof getCurrentPosition
      >

      mockedGetCurrentPosition.mockImplementation((success) => {
        callOrder.push('geolocation')

        return Promise.resolve(
          success({
            coords: {
              latitude: vtexOfficeAddress.geoCoordinates[0],
              longitude: vtexOfficeAddress.geoCoordinates[1],
            },
          } as GeolocationPosition)
        )
      })

      Object.defineProperty(navigator, 'geolocation', {
        get() {
          return { getCurrentPosition: mockedGetCurrentPosition }
        },
      })

      const mockedOnSuccess = jest.fn()

      renderComponent({
        deviceCoordinatesProps: { onSuccess: mockedOnSuccess },
        graphqlMocks: [reverseGeocode],
      })

      const button = screen.getByRole('button')

      fireEvent.click(button)

      expect(mockedPermissionsQuery).toHaveBeenCalledTimes(1)
      expect(mockedGetCurrentPosition).toHaveBeenCalledTimes(1)
      expect(callOrder).toEqual(['permissions', 'geolocation'])
      await waitFor(() => {
        expect(mockedOnSuccess).toHaveBeenCalledTimes(1)
      })
    })

    it("should get an address from coordinates on a browser that doesn't support navigator.permissions", async () => {
      Object.defineProperty(navigator, 'permissions', {
        get() {
          return undefined
        },
      })

      const { getCurrentPosition } = navigator.geolocation
      const mockedGetCurrentPosition = getCurrentPosition as jest.MockedFunction<
        typeof getCurrentPosition
      >

      mockedGetCurrentPosition.mockImplementation((success) =>
        Promise.resolve(
          success({
            coords: {
              latitude: vtexOfficeAddress.geoCoordinates[0],
              longitude: vtexOfficeAddress.geoCoordinates[1],
            },
          } as GeolocationPosition)
        )
      )

      Object.defineProperty(navigator, 'geolocation', {
        get() {
          return { getCurrentPosition: mockedGetCurrentPosition }
        },
      })

      const mockedOnSuccess = jest.fn()

      renderComponent({
        deviceCoordinatesProps: { onSuccess: mockedOnSuccess },
        graphqlMocks: [reverseGeocode],
      })

      const button = screen.getByRole('button')

      fireEvent.click(button)

      expect(mockedGetCurrentPosition).toHaveBeenCalledTimes(1)
      await waitFor(() => {
        expect(mockedOnSuccess).toHaveBeenCalledTimes(1)
      })
    })
  })

  // TODO
  describe('when geolocation is blocked', () => {})

  // TODO
  describe('when geolocation is prompt', () => {})
})
