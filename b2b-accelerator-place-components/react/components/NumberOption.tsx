import React, { useState, useRef, useMemo } from 'react'
import { Input, Checkbox } from 'vtex.styleguide'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  wn: {
    defaultMessage: '',
    id: 'place-components.label.wn',
  },
  numberOption: {
    defaultMessage: '',
    id: 'place-components.label.numberOption',
  },
  fieldRequired: {
    defaultMessage: '',
    id: 'place-components.error.fieldRequired',
  },
  withoutNumber: {
    defaultMessage: '',
    id: 'place-components.label.withoutNumber',
  },
})

interface Props {
  showCheckbox: boolean
  name: string
  label: React.ReactNode
  value: string
  onChange?: (value: string) => void
  disabled?: boolean
  maxLength?: number
  autoComplete?: string
}

const NumberOption: React.FC<Props> = ({
  showCheckbox,
  onChange,
  ...props
}) => {
  const intl = useIntl()
  const inputRef = useRef<HTMLInputElement>(null)
  const withoutNumberMessage = useMemo(() => intl.formatMessage(messages.wn), [
    intl,
  ])

  const [disabled, setDisabled] = useState(
    showCheckbox && props.value === withoutNumberMessage
  )

  const onCheckboxChange = () => {
    onChange?.(disabled ? '' : intl.formatMessage(messages.wn))
    setDisabled(!disabled)

    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const checkboxProps = {
    id: 'number-checkbox',
    name: 'number-checkbox',
    label: <FormattedMessage {...messages.withoutNumber} />,
    onChange: onCheckboxChange,
    checked: disabled,
  }

  return (
    <div className="flex">
      <div className="flex-auto">
        <Input
          ref={inputRef}
          {...props}
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) => onChange?.(value)}
          disabled={disabled || props.disabled}
        />
      </div>
      {showCheckbox && (
        <div className="flex-none h-regular ml5 mt7 flex items-center">
          <Checkbox {...checkboxProps} />
        </div>
      )}
    </div>
  )
}

export default NumberOption
