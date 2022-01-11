import styled from '@emotion/styled'

import type { ThemeProps } from '~/style/theme'

const ErrorMessage = styled.div<ThemeProps>`
  width: 100%;
  padding: 2em;
  color: ${({ theme }) => theme.colors.emphasis};
  font-size: 0.9em;
  background-color: ${({ theme }) => theme.colors.error};
`

export default ErrorMessage
