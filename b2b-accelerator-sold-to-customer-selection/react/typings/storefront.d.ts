import type { FC } from 'react'

declare global {
  interface StorefrontFunctionComponent<P = Record<string, unknown>>
    extends FC<P> {
    getSchema?(props: P): Record<string, unknown>
    schema?: Record<string, unknown>
  }

  interface StorefrontComponent<
    P = Record<string, unknown>,
    S = Record<string, unknown>
  > extends Component<P, S> {
    getSchema?(props: P): Record<string, unknown>
    schema?: Record<string, unknown>
  }
}
