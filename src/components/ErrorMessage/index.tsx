import { memo } from 'react'
import styled from '@emotion/styled'
import { withTheme } from 'emotion-theming'

import { UITheme } from '~/style/theme'

const ErrorMessage = styled.div`
  width: 100%;
  padding: 2em;
  color: ${props => (props.theme as UITheme).colorEmphasis};
  font-size: 0.9em;
  background-color: ${props => (props.theme as UITheme).colorError};
`

export default memo(withTheme(ErrorMessage))
