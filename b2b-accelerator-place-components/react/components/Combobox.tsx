import {
  Combobox as ReachCombobox,
  ComboboxInput as ReachComboboxInput,
  ComboboxPopover as ReachComboboxPopover,
  ComboboxPopoverProps as ReachComboboxPopoverProps,
  ComboboxList as ReachComboboxList,
  ComboboxListProps as ReachComboboxListProps,
  ComboboxOption as ReachComboboxOption,
  ComboboxOptionProps as ReachComboboxOptionProps,
  ComboboxOptionText as ReachComboboxOptionText,
} from '@reach/combobox'
import { PopoverProps } from '@reach/popover'
import React, { forwardRef } from 'react'
import classNames from 'classnames'

import styles from './Combobox.css'

export const Combobox = ReachCombobox

export const ComboboxInput = ReachComboboxInput

export const ComboboxPopover = forwardRef<
  HTMLDivElement,
  ReachComboboxPopoverProps &
    Partial<PopoverProps> &
    React.RefAttributes<HTMLDivElement>
>(function ComboboxPopover({ className, ...props }, ref) {
  return (
    <ReachComboboxPopover
      {...props}
      ref={ref}
      className={classNames(
        className,
        styles.popover,
        'bg-base pv3 mt2 br2 ba bw1 b--muted-4 absolute outline-0'
      )}
    />
  )
})

export const ComboboxList: React.FC<ReachComboboxListProps & {
  className?: string
}> = ({ className, ...props }) => (
  <ReachComboboxList
    {...props}
    className={classNames(className, 'bg-base list ma0 pa0 outline-0')}
  />
)

export const ComboboxOption: React.FC<ReachComboboxOptionProps & {
  className?: string
}> = ({ className, children, ...props }) => (
  <ReachComboboxOption
    {...props}
    className={classNames(
      className,
      styles.option,
      'flex items-center pv3 ph5 pointer bg-action-secondary hover-bg-action-secondary active-bg-action-secondary'
    )}
  >
    {children ?? <ReachComboboxOptionText />}
  </ReachComboboxOption>
)

export default {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
}
