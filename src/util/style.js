/* global process */
import { css as emo } from 'emotion'
import { identity, mapObjIndexed } from 'ramda'

let cssLabeledFn = (rootLabel, styles) =>
  mapObjIndexed(decs => emo(decs), styles)

if (process.env.NODE_ENV !== 'production') {
  cssLabeledFn = (rootLabel, styles) => {
    const label = rootLabel ? key => `${rootLabel}__${key}` : identity

    return mapObjIndexed(
      (decs, key) => emo({ label: label(key), ...decs }),
      styles,
    )
  }
}

export const cssLabeled = cssLabeledFn
