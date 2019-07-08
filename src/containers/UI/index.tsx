import React, { FunctionComponent } from 'react'

import UI from './UI'
import useUITheme from '~/hooks/useUITheme'
import useGlobalPlayback from '~/hooks/useGlobalPlayback'

const ConnectedUI: FunctionComponent = () => {
  const { isPlaying, togglePlayBack } = useGlobalPlayback()
  const { theme, toggleTheme } = useUITheme()

  return (
    <UI
      theme={theme}
      changeTheme={toggleTheme}
      isPlaying={isPlaying}
      togglePlayback={togglePlayBack}
    />
  )
}

export default ConnectedUI
