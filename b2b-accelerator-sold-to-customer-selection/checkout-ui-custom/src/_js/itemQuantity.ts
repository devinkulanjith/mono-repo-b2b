export const normalizeMin = (min: number) => (min == null ? -Infinity : min)
export const normalizeMax = (max: number) => (max == null ? Infinity : max)

export const validateValue = (
  value: string | null,
  min: number,
  max: number,
  defaultValue: number,
  unitMultiplier: number,
  isTyping: boolean
) => {
  // This function always return a valid numeric value from the current input.
  // Compare with the function validateDisplayValue
  min = normalizeMin(min)
  max = normalizeMax(max)

  if ((typeof value === 'number' && Number.isNaN(value)) || value == null) {
    if (defaultValue < min) return min
    if (defaultValue > max) return max

    return defaultValue
  }

  const parsedValue = parseFloat(value)
  const normalizedValue = isTyping
    ? Math.round(parsedValue / unitMultiplier)
    : parsedValue

  return Math.max(min, Math.min(max, normalizedValue))
}

export const formattedDisplayValue = (
  value: number,
  unitMultiplier: number,
  suffix: string,
  isTyping: boolean
) => {
  const parsedSuffix = suffix ? ` ${suffix}` : suffix

  if (!isTyping) {
    const multipliedValue = Math.round(value * unitMultiplier * 100) / 100

    return `${multipliedValue}${parsedSuffix}`
  }

  return `${value}${parsedSuffix}`
}

export const validateDisplayValue = (
  value: string,
  min: number,
  max: number,
  suffix: string,
  unitMultiplier: number,
  isTyping: boolean
) => {
  // This function validates the input as the user types
  // It allows for temporarily invalid values (namely, empty string and minus sign without a number following it)
  // However, it prevents values out of boundaries, and invalid characters, e.g. letters

  const boundaryMultiplier = isTyping ? unitMultiplier : 1

  min = normalizeMin(min) * boundaryMultiplier
  max = normalizeMax(max) * boundaryMultiplier

  const parsedValue = parseFloat(value)

  if (value === '') {
    return formattedDisplayValue(
      parseFloat(value),
      unitMultiplier,
      suffix,
      isTyping
    )
  }

  // Only allows typing the negative sign if negative values are allowed
  if (typeof value === 'string' && value.startsWith('-') && min < 0) {
    return formattedDisplayValue(
      parseFloat(value),
      unitMultiplier,
      suffix,
      isTyping
    )
  }

  if (Number.isNaN(parsedValue)) {
    return ''
  }

  // Only limit by lower bounds if the min value is 1
  // Otherwise, it could prevent typing, for example, 10 if the min value is 2
  if (parsedValue < min && min === 1) {
    return formattedDisplayValue(min, unitMultiplier, suffix, isTyping)
  }

  if (parsedValue > max) {
    return formattedDisplayValue(max, unitMultiplier, suffix, isTyping)
  }

  return formattedDisplayValue(parsedValue, unitMultiplier, suffix, isTyping)
}

export const changeValue = (
  value: string,
  event: any,
  minValue: number,
  maxValue: number,
  defaultValue: number,
  suffix: string,
  unitMultiplier: number,
  isTyping: boolean
) => {
  // const parsedValue = parseFloat(value)

  const validatedValue = validateValue(
    value,
    minValue,
    maxValue,
    defaultValue,
    unitMultiplier,
    isTyping
  )

  const displayValue = validateDisplayValue(
    isTyping ? value : validatedValue.toString(),
    minValue,
    maxValue,
    suffix,
    unitMultiplier,
    isTyping
  )

  return [validatedValue, displayValue]
}
