import React, { FunctionComponent, useState, useEffect, memo } from 'react'
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

const AnimIn: FunctionComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let visibleTimeout: NodeJS.Timeout = setTimeout(() => setIsVisible(true), 0)

    return () => visibleTimeout && clearTimeout(visibleTimeout)
  }, [])

  return (
    <Root className={classNames.root} pose={isVisible ? 'visible' : 'hidden'}>
      {children}
    </Root>
  )
}

export default memo(AnimIn)
