export const gcd = (x: number, y: number) => {
  x = Math.abs(x)
  y = Math.abs(y)
  while (y) {
    const t = y

    y = x % y
    x = t
  }

  return x
}

export const lcm = (x: number, y: number) => {
  // if ((typeof x !== 'number') || (typeof y !== 'number'))
  //   return false
  return !x || !y ? 0 : Math.abs((x * y) / gcd(x, y))
}
