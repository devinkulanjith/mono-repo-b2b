import classnames from 'classnames'
import React, { useState, useMemo, useRef } from 'react'
import { Input, Dropdown } from 'vtex.styleguide'
import { DisplayDefinition } from 'vtex.country-data-settings'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { AddressFields, Field } from 'vtex.address-context/types'
import { useIntl, defineMessages } from 'react-intl'

import { useAddressForm, FieldName, FieldsMeta } from './useAddressForm'
import { styleRules } from './countries/rules'
import PlaceDetails from './PlaceDetails'
import NumberOption from './components/NumberOption'
import { useCountry } from './useCountry'

const messages = defineMessages({
  receiverName: {
    id: 'place-components.label.receiverName',
    defaultMessage: 'Receiver',
  },
  country: {
    defaultMessage: '',
    id: 'place-components.label.country',
  },
  state: {
    defaultMessage: '',
    id: 'place-components.label.state',
  },
  city: {
    defaultMessage: '',
    id: 'place-components.label.city',
  },
  neighborhood: {
    defaultMessage: '',
    id: 'place-components.label.neighborhood',
  },
  streetRoadAvenue: {
    defaultMessage: '',
    id: 'place-components.label.streetRoadAvenue',
  },
  numberOption: {
    defaultMessage: '',
    id: 'place-components.label.numberOption',
  },
  complement: {
    defaultMessage: '',
    id: 'place-components.label.complement',
  },
  stateAbbreviation: {
    defaultMessage: '',
    id: 'place-components.label.stateAbbreviation',
  },
  postalCode: {
    defaultMessage: '',
    id: 'place-components.label.postalCode',
  },
})

/**
 * This utility serves to create a "diff" for the fields we will
 * show to the user.
 *
 * For example if the address form is not in a  editing state, we will
 * render a place details with the "extended" display and we will only
 * show the fields that are *not* in the compact mode. This works by ignoring
 * all fields from the compact mode that are in the extended mode.
 */
const getExcludedFields = (
  summary: DisplayDefinition[][],
  includedFields: string[] = []
) => {
  const excludedFields = new Set<string>()

  summary.forEach((line) => {
    line.forEach((fragment) => {
      if (includedFields.includes(fragment.name)) {
        return
      }

      excludedFields.add(fragment.name)
    })
  })

  return excludedFields
}

interface AddressFormProps {
  hiddenFields?: AddressFields[]
  mandatoryEditableFields?: AddressFields[]
  onResetAddress?: () => void
  form?: ReturnType<typeof useAddressForm>
  expanded?: boolean
  onExpandForm?: () => void
}

const AddressForm: React.FC<AddressFormProps> = ({
  hiddenFields = [],
  mandatoryEditableFields = [],
  onResetAddress,
  form: propsForm,
  expanded: propsExpanded,
  onExpandForm,
}) => {
  const intl = useIntl()
  const addressContext = useAddressContext()
  const localForm = useAddressForm({
    initialAddress: addressContext.address,
    onAddressChange: addressContext.setAddress,
  })

  const [localExpanded, setLocalExpanded] = useState(false)

  const expanded = propsExpanded ?? localExpanded

  const form = propsForm ?? localForm
  const address = propsForm?.address ?? addressContext.address

  const country = useCountry()
  const countryRules = addressContext.rules[country]

  const { fields: countryRulesFields, display } = countryRules ?? {}
  const summary = display?.extended

  const handleEditButtonClick = () => {
    if (expanded) {
      onResetAddress?.()
    } else if (onExpandForm != null) {
      onExpandForm()
    } else {
      setLocalExpanded(true)
    }
  }

  const displayMode = expanded ? 'minimal' : 'compact'

  // The use of `useRef` is to prevent the fields from suddenly disappearing
  // from the form while typing the value
  //
  // For example: if the form is missing the number from the address and the user
  // starts typing the number, since the only validation we do on numbers is to check
  // if the value _exists_, as soon as the first character is typed the field will no
  // longer be invalid causing it to suddenly "disappear" from the screen if we don't use
  // the `useRef` hook.
  const initialInvalidFields = useRef([
    ...form.invalidFields,
    ...mandatoryEditableFields,
  ])

  const ignoredFields = useMemo(
    () =>
      getExcludedFields(
        display?.[displayMode] ?? [],
        initialInvalidFields.current
      ),
    [display, displayMode]
  )

  const handleFieldBlur: React.FocusEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (evt) => {
    const fieldName = evt.target.name

    if (!(fieldName in address)) {
      return
    }

    form.onFieldBlur(fieldName as FieldName)
  }

  return (
    <div>
      <div className="mb6 flex items-baseline lh-copy">
        <PlaceDetails
          display={displayMode}
          hiddenFields={initialInvalidFields.current as AddressFields[]}
          onEdit={handleEditButtonClick}
        />
      </div>
      <div>
        {summary
          ?.map((line) =>
            line.filter((fragment) => {
              const field = countryRulesFields?.[fragment.name as FieldName]

              if (
                !field ||
                ignoredFields.has(fragment.name) ||
                hiddenFields.includes(fragment.name as AddressFields)
              ) {
                return false
              }

              return true
            })
          )
          .filter((line) => line.length > 0)
          .map((line, index, renderedSummary) => (
            <div className="flex flex-wrap" key={index}>
              {line.map((fragment, fragmentIndex) => {
                const field = countryRulesFields?.[
                  fragment.name as FieldName
                ] as Field

                const style = styleRules[field.label]

                let fragmentElement = null

                const { maxLength, autoComplete, label } = field

                const handleChange = (value: string) => {
                  form.onFieldChange(fragment.name as FieldName, value)
                }

                const handleInputChange: React.ChangeEventHandler<
                  HTMLInputElement | HTMLSelectElement
                > = (evt) => {
                  handleChange(evt.target.value)
                }

                const value = address[fragment.name as FieldName] ?? ''

                const fragmentMeta =
                  form.meta[fragment.name as keyof FieldsMeta]

                const commonProps = {
                  label: intl.formatMessage(
                    messages[label as keyof typeof messages]
                  ),
                  value,
                  name: fragment.name,
                  onBlur: handleFieldBlur,
                  ...(maxLength && { maxLength }),
                  ...(autoComplete && { autoComplete }),
                  ...(fragmentMeta?.blurred && fragmentMeta.errorMessage
                    ? {
                        errorMessage: intl.formatMessage(
                          fragmentMeta.errorMessage
                        ),
                      }
                    : null),
                }

                fragmentElement =
                  fragment.name === 'number' ? (
                    <NumberOption
                      {...commonProps}
                      onChange={handleChange}
                      showCheckbox
                    />
                  ) : field.options ? (
                    <Dropdown
                      {...commonProps}
                      onChange={handleInputChange}
                      options={field.options}
                    />
                  ) : (
                    <Input {...commonProps} onChange={handleInputChange} />
                  )

                return (
                  <div
                    className={classnames('flex-auto', {
                      mb5: index < renderedSummary.length - 1,
                      mr5: fragmentIndex < line.length - 1,
                    })}
                    style={style}
                    key={fragment.name}
                  >
                    {fragmentElement}
                  </div>
                )
              })}
            </div>
          ))}
      </div>
    </div>
  )
}

export default AddressForm
