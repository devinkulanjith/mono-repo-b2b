import React from 'react'
import { fireEvent, screen, render } from '@vtex/test-tools/react'
import { AddressContextProvider } from 'vtex.address-context/AddressContext'
import { createEmptyAddress } from 'vtex.address-context/Utils'

import AddressForm from '../AddressForm'
import { useAddressForm, FieldName } from '../useAddressForm'
import { braRules } from '../__fixtures__/addressRules.fixture'

describe('AddressForm', () => {
  it('should read address from context', () => {
    render(
      <AddressContextProvider
        address={{ ...createEmptyAddress(), country: 'BRA' }}
        rules={braRules}
        countries={['BRA']}
      >
        <AddressForm />
      </AddressContextProvider>
    )

    const numberInput = screen.getByLabelText(/^number$/i)

    expect(numberInput).toBeInTheDocument()

    fireEvent.change(numberInput, { target: { value: '300' } })

    expect(numberInput).toHaveValue('300')
  })

  it('should be able to act as controlled component', () => {
    const changes: any[] = []

    const Component: React.VFC = () => {
      const form = useAddressForm({
        initialAddress: { ...createEmptyAddress(), country: 'BRA' },
        onAddressChange: (address) => changes.push(address),
      })

      return (
        <>
          <AddressForm form={form} />
          <button
            onClick={() => {
              form.invalidFields.map((field) =>
                form.onFieldBlur(field as FieldName)
              )
            }}
          >
            blur fields
          </button>
        </>
      )
    }

    render(
      <AddressContextProvider
        address={{
          // this won't be used
          ...createEmptyAddress(),
          number: '123',
          country: 'BRA',
        }}
        rules={braRules}
        countries={['BRA']}
      >
        <Component />
      </AddressContextProvider>
    )

    const numberInput = screen.getByLabelText(/^number$/i)

    expect(numberInput).toBeInTheDocument()
    expect(numberInput).not.toHaveValue('123')

    fireEvent.change(numberInput, { target: { value: '321' } })

    expect(numberInput).toHaveValue('321')
    expect(changes).toStrictEqual([
      expect.objectContaining({
        number: '321',
      }),
    ])

    fireEvent.click(screen.getByText('blur fields'))

    expect(
      screen.getAllByText(/this field is required/i).length
    ).toBeGreaterThan(0)
  })
})
