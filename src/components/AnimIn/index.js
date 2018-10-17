import React, { PureComponent } from 'react'
import posed from 'react-pose'

import PropTypes from '~/PropTypes'
import { cssLabeled } from '~/util/style'

const classNames = cssLabeled('animIn', {
  root: {
    width: '100%',
    height: '100%',
  },
})

const Root = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
})

export default class AnimIn extends PureComponent {
  propTypes = {
    children: PropTypes.node,
  }

  defaultProps = {
    children: [],
  }

  state = {
    isVisible: false,
  }

  componentDidMount() {
    this.visibleTimeout = setTimeout(
      () => this.setState({ isVisible: true }),
      0,
    )
  }

  componentWillUnmount() {
    if (this.visibleTimeout) {
      clearTimeout(this.visibleTimeout)
    }
  }

  render() {
    const { isVisible } = this.state
    const { children } = this.props

    return (
      <Root className={classNames.root} pose={isVisible ? 'visible' : 'hidden'}>
        {children}
      </Root>
    )
  }
}
