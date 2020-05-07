import styled from '@emotion/styled'

import { ThemeProps } from '~/style/theme'

const ErrorMessage = styled.div<ThemeProps>`
  width: 100%;
  padding: 2em;
  color: white;
  font-size: 0.9em;
  background-color: red;
`

export default ErrorMessage
