/* global process */
import { css, Interpolation } from 'emotion'
import { mapObjIndexed } from 'ramda'

let cssLabeledFn = (_: string, styles: { [key: string]: Interpolation }) =>
  mapObjIndexed((decs: Interpolation) => css(decs), styles)

if (process.env.NODE_ENV !== 'production') {
  cssLabeledFn = (rootLabel, styles) => {
    if (typeof styles !== 'object') {
      throw new Error('cssLabeled expects a root label and a style object')
    }

    if (rootLabel && typeof rootLabel !== 'string') {
      throw new Error('Expected a string for root label')
    }

    const label = (key: string) => {
      if (key === 'root') {
        return rootLabel || key
      }

      return rootLabel ? `${rootLabel}__${key}` : key
    }

    return Object.entries(styles).reduce(
      (acc: { [key: string]: Interpolation }, [key, decs]) => {
        acc[key] = css(Object.assign({ label: label(key) }, decs))

        return acc
      },
      {},
    )
  }
}

export const cssLabeled = cssLabeledFn
