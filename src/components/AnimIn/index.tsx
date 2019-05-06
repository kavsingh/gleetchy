import React, {
  FunctionComponent,
  useState,
  useEffect,
  memo,
  ReactNode,
} from 'react'
import posed from 'react-pose'
import { css } from '@emotion/core'

const rootStyle = css({
  height: '100%',
  width: '100%',
})

const Root = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
})

// For some reason memo does not expose children properly.
// TODO: kiv type updates
const AnimIn: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let visibleTimeout: NodeJS.Timeout = setTimeout(() => setIsVisible(true), 0)

    return () => visibleTimeout && clearTimeout(visibleTimeout)
  }, [])

  return (
    <Root css={rootStyle} pose={isVisible ? 'visible' : 'hidden'}>
      {children}
    </Root>
  )
}

export default memo(AnimIn)
