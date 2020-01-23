import { memo, ReactElement } from 'react'
import styled from '@emotion/styled'

import Button, { ButtonProps } from './button'

const ButtonSet = styled.div<{
  children: ReactElement<ButtonProps>[] | ReactElement<ButtonProps>
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 5em;
  padding: 0.8rem 0;
`

export { Button }

export default memo(ButtonSet)
