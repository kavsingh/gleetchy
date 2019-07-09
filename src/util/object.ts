import { pick } from 'ramda'

export const pickObjectKeys = (obj: { [key: string]: unknown }) =>
  pick(Object.keys(obj))
