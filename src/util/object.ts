import { pick, isNil, pipe, not } from 'ramda'

export const pickObjectKeys = (obj: { [key: string]: unknown }) =>
  pick(Object.keys(obj))

export const isNotNil = pipe(
  isNil,
  not,
)
