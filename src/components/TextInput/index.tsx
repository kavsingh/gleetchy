import React, { PureComponent } from 'react'
import AutosizeInput from 'react-input-autosize'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'

import { cancelReactEvent } from '~/util/event'
import { noop } from '~/util/function'
import { UITheme } from '~/style/theme'

const rootStyle = (theme: UITheme) =>
  css({
    '& input': {
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '1px solid transparent',
      color: 'currentColor',
      cursor: 'initial',
      font: 'inherit',
      transition: 'border-color 0.2s ease-out',

      '&:hover, &:active, &:focus': {
        color: theme.colorEmphasis,
      },

      '&:focus': {
        borderBottomColor: 'currentColor',
      },
    },
  })

export interface TextInputProps {
  value: string | number
  placeholder?: string
  type?: 'text' | 'number'
  onChange?(value: string | number): unknown
}

class TextInput extends PureComponent<TextInputProps> {
  public render() {
    const { value, placeholder = '', type = 'text' } = this.props

    return (
      <div css={rootStyle}>
        <AutosizeInput
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          type={type}
        />
      </div>
    )
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange = noop } = this.props

    cancelReactEvent(event)
    onChange(event.currentTarget.value)
  }
}

export default withTheme(TextInput)
