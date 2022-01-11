import styled from '@emotion/styled'

import Button from './button'

import type { ButtonProps } from './button'
import type { ReactElement } from 'react'

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

export default ButtonSet
