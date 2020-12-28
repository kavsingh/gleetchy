import type { UITheme } from '~/style/theme'

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends UITheme {}
}
