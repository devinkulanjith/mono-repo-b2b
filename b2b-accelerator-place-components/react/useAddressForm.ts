import { useState, useCallback, useMemo } from 'react'
import { defineMessages, MessageDescriptor } from 'react-intl'
import { AddressFields } from 'vtex.address-context/types'
import Utils from 'vtex.address-context/Utils'
import AddressContext from 'vtex.address-context/AddressContext'
import { Address } from 'vtex.checkout-graphql'

import { useCountry } from './useCountry'

const { createEmptyAddress, validateAddress } = Utils
const { useAddressContext } = AddressContext

interface FieldMeta {
  blurred: boolean
  errorMessage?: MessageDescriptor
}

export type FieldName = Exclude<
  AddressFields,
  'addressId' | 'addressType' | 'isDisposable'
>

export type FieldsMeta = {
  [field in FieldName]?: FieldMeta
}

interface FormOptions {
  initialAddress?: Address | null
  onAddressChange?: (address: Address) => void
}

const messages = defineMessages({
  fieldRequired: {
    defaultMessage: '',
    id: 'place-components.error.fieldRequired',
  },
})

export function useAddressForm({
  initialAddress,
  onAddressChange,
}: FormOptions = {}) {
  const { rules: addressRules } = useAddressContext()
  const [address, setAddress] = useState(initialAddress ?? createEmptyAddress())
  const country = useCountry()

  const { isValid, invalidFields } = useMemo(
    () => validateAddress(address, addressRules),
    [address, addressRules]
  )

  const [fieldsMeta, setFieldsMeta] = useState<FieldsMeta>(
    Object.fromEntries(
      invalidFields.map((field) => [
        field,
        { errorMessage: messages.fieldRequired },
      ])
    )
  )

  const updateFieldMeta = useCallback(
    (fieldName: FieldName, meta: Partial<FieldMeta>) => {
      setFieldsMeta((prevMeta) => ({
        ...prevMeta,
        [fieldName]: {
          ...prevMeta[fieldName],
          ...meta,
        },
      }))
    },
    []
  )

  const onFieldBlur = useCallback(
    (fieldName: FieldName) => {
      updateFieldMeta(fieldName, { blurred: true })
    },
    [updateFieldMeta]
  )

  const executeFieldValidation = useCallback(
    (name: string, value?: string | boolean | null | Array<number | null>) => {
      const countryRules = addressRules[country]

      if (!countryRules) {
        return
      }

      const fieldName = name in countryRules.fields ? (name as FieldName) : null

      if (!fieldName) {
        return
      }

      const fieldRule = countryRules.fields[fieldName]

      let errorMessage

      if (
        fieldRule?.required &&
        typeof value === 'string' &&
        value.length === 0
      ) {
        errorMessage = messages.fieldRequired
      }

      updateFieldMeta(fieldName as FieldName, { errorMessage })
    },
    [country, addressRules, updateFieldMeta]
  )

  const onFieldChange = useCallback(
    (fieldName: FieldName, value: string) => {
      const updatedAddress = { ...address, [fieldName]: value }

      executeFieldValidation(fieldName, value)

      setAddress(updatedAddress)
      onAddressChange?.(updatedAddress)
    },
    [address, onAddressChange, executeFieldValidation]
  )

  const updateAddress = useCallback(
    (update: React.SetStateAction<Address>) => {
      setAddress((prevAddress) => {
        let updatedAddress

        if (typeof update === 'function') {
          updatedAddress = update(prevAddress)
        } else {
          updatedAddress = update
        }

        Object.entries(updatedAddress).forEach(([fieldName, fieldValue]) => {
          executeFieldValidation(fieldName, fieldValue)
        })

        return updatedAddress
      })
    },
    [executeFieldValidation]
  )

  return {
    address,
    setAddress: updateAddress,
    isValid,
    invalidFields,
    meta: fieldsMeta,
    onFieldBlur,
    onFieldChange,
  }
}

export default useAddressForm
