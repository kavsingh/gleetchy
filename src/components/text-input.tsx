import React, {
  FunctionComponent,
  useCallback,
  ChangeEventHandler,
} from 'react'
import AutosizeInput from 'react-input-autosize'
import styled from '@emotion/styled'
import { withTheme } from 'emotion-theming'

import { cancelReactEvent, noop } from '~/lib/util'
import { ThemeProps } from '~/style/theme'

const Container = styled.div<ThemeProps>`
  input {
    border: none;
    border-bottom: 1px solid transparent;
    color: currentColor;
    font: inherit;
    background-color: transparent;
    cursor: initial;
    transition: color 0.2s ease-out, border-color 0.2s ease-out;

    &:hover,
    &:active,
    &:focus {
      color: ${({ theme }) => theme.colors.emphasis};
    }

    &:focus {
      border-bottom-color: currentColor;
    }
  }
`

export interface TextInputProps {
  value: string | number
  placeholder?: string
  type?: 'text' | 'number'
  onChange?(value: string | number): unknown
}

const TextInput: FunctionComponent<TextInputProps> = ({
  value,
  placeholder = '',
  type = 'text',
  onChange = noop,
}) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      cancelReactEvent(event)
      onChange(event.currentTarget.value)
    },
    [onChange],
  )

  return (
    <Container>
      <AutosizeInput
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        type={type}
      />
    </Container>
  )
}

export default withTheme(TextInput)
