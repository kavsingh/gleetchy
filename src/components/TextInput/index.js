import React, { PureComponent } from 'react'
import AutosizeInput from 'react-input-autosize'

import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import { cancelEvent } from '~/util/event'

const classes = cssLabeled('textInput', {
  root: {
    '& input': {
      transition: 'border-color 0.2s ease-out',
      font: 'inherit',
      color: 'currentColor',
      border: 'none',
      borderBottom: '1px solid transparent',
      cursor: 'initial',
      backgroundColor: 'transparent',

      '&:focus': {
        borderBottomColor: 'currentColor',
      },
    },
  },
})

class TextInput extends PureComponent {
  constructor(...args) {
    super(...args)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    cancelEvent(event)
    this.props.onChange(event.currentTarget.value)
  }

  render() {
    const { value, placeholder, type } = this.props

    return (
      <div className={classes.root}>
        <AutosizeInput
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          type={type}
        />
      </div>
    )
  }
}

TextInput.propTypes = {
  type: PropTypes.oneOf(['text', 'number']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
}

TextInput.defaultProps = {
  type: 'text',
  value: '',
  placeholder: '',
  onChange: noop,
}

export default TextInput
