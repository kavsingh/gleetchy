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
    const { value, placeholder } = this.props

    return (
      <div className="textInput">
        <AutosizeInput
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
        <style jsx>{`
          .textInput :global(input) {
            font: inherit;
            color: currentColor;
            border: none;
            border-bottom: 1px solid #fefefe;
          }

          .textInput :global(input:focus) {
            border-bottom-color: #eee;
          }
        `}</style>
      </div>
    )
  }
}

TextInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
}

TextInput.defaultProps = {
  value: '',
  placeholder: '',
  onChange: () => {},
}

export default TextInput
