declare type Mutable<T extends { [key: string]: any }, K = keyof T> = {
  [P in K]: T[P]
}

declare type Nullable<T> = T | null | undefined
