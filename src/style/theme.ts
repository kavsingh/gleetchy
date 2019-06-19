export type ThemeName = 'dark' | 'light'

export interface UITheme {
  name: ThemeName
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

export const themes: UITheme[] = [
  {
    ...common,
    name: 'dark',
    colorPage: '#101010',
    colorBody: '#efefef',
    colorEmphasis: '#fff',
    colorKeyline: '#195555',
    colorError: '#ec6764',
  },
  {
    ...common,
    name: 'light',
    colorPage: '#fff',
    colorBody: '#222',
    colorEmphasis: '#000',
    colorKeyline: '#e8e8e8',
    colorError: '#ec6764',
  },
]

export default themes[0]
