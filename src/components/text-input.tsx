import React, { useCallback, memo } from 'react'
import AutosizeInput from 'react-input-autosize'
import styled from '@emotion/styled'
import type { ChangeEventHandler } from 'react'

import { cancelReactEvent, noop } from '~/lib/util'
import type { ThemeProps } from '~/style/theme'
import type { FunctionComponentWithoutChildren } from '~/types'

const TextInput: FunctionComponentWithoutChildren<{
  value: string | number
  placeholder?: string
  onChange?(value: string): unknown
}> = ({ value, placeholder = '', onChange = noop }) => {
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
      />
    </Container>
  )
}

export default memo(TextInput)

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
