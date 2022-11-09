import React from 'react'
import { render, screen, waitFor } from '@vtex/test-tools/react'
import { MockedResponse } from '@apollo/react-testing'
import { Address } from 'vtex.checkout-graphql'
import { AddressRules, CountryRules, Field } from 'vtex.address-context/types'
import { AddressContextProvider } from 'vtex.address-context/AddressContext'
import userEvent from '@testing-library/user-event'

import LocationInput from '../LocationInput'
import { validPostalCode } from '../__fixtures__/graphql/getAddressFromPostalCode.fixture'

interface SetupProps {
  address?: Address | null
  countries?: string[]
  rules?: AddressRules
  graphqlMocks?: MockedResponse[]
}

interface RenderComponentProps extends SetupProps {
  locationInputProps?: React.ComponentProps<typeof LocationInput>
}

const defaultGraphqlMocks: MockedResponse[] = []

describe('LocationInput', () => {
  const renderComponent = ({
    locationInputProps = {},
    address = { country: 'BRA' },
    countries = [],
    rules = {
      BRA: {
        fields: {
          postalCode: {
            mask: '99999-999',
            pattern: '^(\\d){5}-?(\\d){3}$',
            additionalData: {
              forgottenURL:
                'https://buscacepinter.correios.com.br/app/endereco/',
            },
          } as Field,
        },
      } as CountryRules,
    },
    graphqlMocks = [],
  }: RenderComponentProps) => {
    return render(
      <AddressContextProvider
        address={address}
        countries={countries}
        rules={rules}
      >
        <LocationInput {...locationInputProps} />
      </AddressContextProvider>,
      {
        graphql: {
          mocks: [...defaultGraphqlMocks, ...graphqlMocks],
          addTypename: false,
        },
      }
    )
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should format and submit a valid postal code', async () => {
    const mockedOnSuccess = jest.fn()

    renderComponent({
      locationInputProps: { onSuccess: mockedOnSuccess },
      graphqlMocks: [validPostalCode],
    })

    const input = screen.getByRole('textbox', {
      name: /postal code/i,
    })

    userEvent.type(input, '22250040')
    userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockedOnSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('should format and submit a valid postal code after fixing an invalid postal code', async () => {
    const mockedOnSuccess = jest.fn()

    renderComponent({
      locationInputProps: { onSuccess: mockedOnSuccess },
      graphqlMocks: [validPostalCode],
    })

    const input = screen.getByRole('textbox', {
      name: /postal code/i,
    })

    // it's missing the last digit
    userEvent.type(input, '2225004')
    userEvent.click(screen.getByRole('button'))

    expect(
      screen.getByText(/inform a valid postal code\./i)
    ).toBeInTheDocument()

    userEvent.type(input, '{selectall}22250040')
    userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockedOnSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('should apply the postal code mask when the input lose focus', () => {
    renderComponent({})
    const input = screen.getByRole('textbox', {
      name: /postal code/i,
    })

    userEvent.type(input, '222500')
    expect(input).toHaveValue('222500')

    userEvent.type(input, '4')
    expect(input).toHaveValue('2225004')

    userEvent.click(screen.getByRole('button'))
    expect(input).toHaveValue('22250-04')

    userEvent.type(input, '{selectall}2225004')
    expect(input).toHaveValue('2225004')

    userEvent.type(input, '{enter}')
    expect(input).toHaveValue('22250-04')
  })
})
