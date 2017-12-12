import React, { PureComponent } from 'react'
import Animated from 'animated'
import PropTypes from '~/PropTypes'

class AnimIn extends PureComponent {
  constructor(...args) {
    super(...args)
    this.state = { visibility: new Animated.Value(0) }
  }

  componentDidMount() {
    Animated.spring(this.state.visibility, { toValue: 1 }).start()
  }

  render() {
    const { visibility } = this.state

    return (
      <Animated.div className="animIn" style={{ opacity: visibility }}>
        {this.props.children}
        <style jsx>{`
          .AnimIn {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </Animated.div>
    )
  }
}

AnimIn.propTypes = {
  children: PropTypes.node,
}

AnimIn.defaultProps = {
  children: [],
}

export default AnimIn
