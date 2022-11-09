/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

declare module 'vtex.styleguide' {
  export const Button: React.FC<any>

  export const Input: React.FC<any>

  export const IconClear: React.FC<any>

  export const IconWarning: React.FC<any>

  export const InputButton: React.FC<any>

  export const Spinner: React.FC<any>

  export const IconLocation: React.FC<any>

  export const Checkbox: React.FC<any>

  interface DropdownProps {
    value?: string
    label?: React.ReactNode
    placeholder?: string
    options: Array<{ label: string; value: string }>
    onChange?: React.ChangeEventHandler<HTMLSelectElement>
    disabled?: boolean
    name?: string
  }

  export const Dropdown: React.FC<DropdownProps>

  export const IconSearch: React.FC<any>

  export const IconCaretDown: React.FC<any>

  export const IconEdit: React.FC<any>
}
