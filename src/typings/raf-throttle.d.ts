declare module 'raf-throttle' {
  const throttled: <T extends (...args: any[]) => unknown>(
    fn: T,
  ) => T & { cancel: () => void }

  export default throttled
}
