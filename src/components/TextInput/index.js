import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AutosizeInput from 'react-input-autosize'
import { cancelEvent } from '../../util'

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
      <div className="textInput">
        <AutosizeInput
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          type={type}
        />
        <style jsx>{`
          .textInput :global(input) {
            transition: border-color 0.2s ease-out;
            font: inherit;
            color: currentColor;
            border: none;
            border-bottom: 1px solid transparent;
            cursor: initial;
            background-color: transparent;
          }

          .textInput :global(input:focus) {
            border-bottom-color: currentColor;
          }
        `}</style>
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
  onChange: () => {},
}

export default TextInput
