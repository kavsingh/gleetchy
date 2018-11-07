// Courtesy of https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30054#issuecomment-435248775 until update is ready
export {}

declare module 'react' {
  export interface ExoticComponent<P = {}> {
    /**
     * # WARNING
     *
     * Exotic components are not actually callable
     *
     * @deprecated Exotic components are not callable
     */
    (props: P): ReactElement<any> | null
    readonly $$typeof: symbol
  }

  export interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
    displayName?: string
  }

  export interface Context<T> {
    displayName?: string
  }

  export type ComponentProps<
    T extends ComponentType<any>
  > = T extends ComponentType<infer P> ? P : {}
  export type ComponentPropsWithRef<
    T extends ComponentType<any>
  > = T extends ComponentClass<infer P>
    ? P & ClassAttributes<InstanceType<T>>
    : T extends SFC<infer P>
    ? P
    : {}

  export function memo<P extends object>(
    Component: SFC<P>,
    propsAreEqual?: (
      prevProps: Readonly<P & { children?: ReactNode }>,
      nextProps: Readonly<P & { children?: ReactNode }>,
    ) => boolean,
  ): NamedExoticComponent<P>
  export function memo<T extends ComponentType<any>>(
    Component: T,
    propsAreEqual?: (
      prevProps: Readonly<ComponentProps<T>>,
      nextProps: Readonly<ComponentProps<T>>,
    ) => boolean,
  ): NamedExoticComponent<ComponentPropsWithRef<T>>

  /**
   * This feature is not yet available for server-side rendering.
   * Suspense support will be added in a later release.
   */
  export const Suspense: ExoticComponent<{
    children?: ReactNode

    /** A fallback react tree to show when a Suspense child (like React.lazy) suspends */
    fallback: ReactNode | null

    // I tried looking at the code but I have no idea what it does.
    // https://github.com/facebook/react/issues/13206#issuecomment-432489986
    /**
     * Not implemented yet, requires unstable_ConcurrentMode
     */
    // maxDuration?: number
  }>

  export function lazy<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
  ): ExoticComponent<ComponentPropsWithRef<T>>
}
