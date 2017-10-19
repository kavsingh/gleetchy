import { path, curry } from 'ramda'

export const pathString = curry((propPath, obj) =>
  path(propPath.split('.'), obj),
)
