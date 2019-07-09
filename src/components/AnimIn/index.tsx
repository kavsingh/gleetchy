import React, {
  FunctionComponent,
  useState,
  useEffect,
  memo,
  ReactNode,
} from 'react'
import { css } from '@emotion/core'

const rootStyle = css({
  height: '100%',
  width: '100%',
  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
})

const hiddenStyle = css({
  opacity: 0,
  transform: 'translate(0, -4%)',
})

const visibleStyle = css({
  opacity: 1,
  transform: 'translate(0, 0)',
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
    <div css={[rootStyle, isVisible ? visibleStyle : hiddenStyle]}>
      {children}
    </div>
  )
}

export default memo(AnimIn)
