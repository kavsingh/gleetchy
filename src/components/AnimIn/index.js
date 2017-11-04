import React, { PureComponent } from 'react'
import { tween } from 'popmotion'
import PropTypes from '../../PropTypes'

class AnimIn extends PureComponent {
  constructor(...args) {
    super(...args)
    this.state = { visibility: 0 }
  }

  componentDidMount() {
    this.visibilityTween = tween({
      from: this.state.visibility,
      to: 1,
      duration: this.props.duration,
      onUpdate: visibility => this.setState(() => ({ visibility })),
    })

    this.visibilityTween.start()
  }

  componentWillUnmount() {
    if (this.visibilityTween) this.visibilityTween.stop()
  }

  render() {
    const { visibility } = this.state

    return (
      <div
        className="AnimIn"
        style={{
          opacity: visibility,
          pointerEvents: visibility >= 1 ? 'all' : 'none',
        }}
      >
        {this.props.children}
        <style jsx>{`
          .AnimIn {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    )
  }
}

AnimIn.propTypes = {
  duration: PropTypes.number,
  children: PropTypes.node,
}

AnimIn.defaultProps = {
  duration: 600,
  children: [],
}

export default AnimIn
