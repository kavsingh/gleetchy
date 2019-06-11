export interface UITheme {
  colorPage: string
  colorBody: string
  colorEmphasis: string
  colorKeyline: string
  colorError: string
  fontBody: string
}

const common: Pick<UITheme, 'fontBody'> = {
  fontBody: '-apple-system, BlinkMacSystemFont, sans-serif',
}

export const themeDark: UITheme = {
  ...common,
  colorPage: '#101010',
  colorBody: '#efefef',
  colorEmphasis: '#fff',
  colorKeyline: '#195555',
  colorError: '#ec6764',
}

export const themeLight: UITheme = {
  ...common,
  colorPage: '#fefefe',
  colorBody: '#222',
  colorEmphasis: '#000',
  colorKeyline: '#eee',
  colorError: '#ec6764',
}

export default themeDark
