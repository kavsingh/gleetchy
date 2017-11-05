import color from 'color'

const mod = col =>
  color(col)
    .negate()
    .lighten(4)
    .hex()

export const COLOR_PAGE = mod('#fff')
export const COLOR_BODY = mod('#444')
export const COLOR_EMPHASIS = mod('#000')
export const COLOR_KEYLINE = mod('#faeeee')
export const COLOR_ERROR = '#ec6764'
