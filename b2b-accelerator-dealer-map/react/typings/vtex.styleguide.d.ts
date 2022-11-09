declare module 'vtex.styleguide' {
  import { ComponentType, FunctionComponent } from 'react'

  export const Button: ComponentType<InputProps>
  export const Input: ComponentType<InputProps>
  export const Tooltip: ComponentType<InputProps>
  export const NumericStepper: ComponentType<InputProps>
  export const Checkbox: ComponentType<InputProps>
  export const Spinner: ComponentType<InputProps>
  export const Modal: ComponentType<InputProps>
  export const Dropdown: ComponentType<InputProps>
  export const ToastContext: Context<{ showToast: any }>

  export const withToast

  interface InputProps {
    [key: string]: any
  }
}
