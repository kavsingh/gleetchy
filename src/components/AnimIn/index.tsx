import React, { PureComponent } from 'react'
import posed from 'react-pose'

import { cssLabeled } from '~/util/style'

const classNames = cssLabeled('animIn', {
  root: {
    height: '100%',
    width: '100%',
  },
})

const Root = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
})

export default class AnimIn extends PureComponent<{}, { isVisible: boolean }> {
  public state = { isVisible: false }

  private visibleTimeout?: NodeJS.Timeout

  public componentDidMount() {
    this.visibleTimeout = setTimeout(
      () => this.setState({ isVisible: true }),
      0,
    )
  }

  public componentWillUnmount() {
    if (this.visibleTimeout) {
      clearTimeout(this.visibleTimeout)
    }
  }

  public render() {
    const { isVisible } = this.state
    const { children = null } = this.props

    return (
      <Root className={classNames.root} pose={isVisible ? 'visible' : 'hidden'}>
        {children}
      </Root>
    )
  }
}
