import { pick, isNil } from 'ramda'

export const pickObjectKeys = (obj: { [key: string]: unknown }) =>
  pick(Object.keys(obj))

export const isNotNil = <T>(value: T): value is NonNullable<T> => !isNil(value)
