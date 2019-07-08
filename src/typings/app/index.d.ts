declare module '*.png' {
  const filePath: string
  export default filePath
}

declare module '*.wav' {
  const filePath: string
  export default filePath
}

declare type Mutable<T extends { [key: string]: any }, K = keyof T> = {
  [P in K]: T[P]
}
