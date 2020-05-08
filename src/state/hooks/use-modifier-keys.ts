import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { uiModifierKeysSelector } from '../ui/selectors'
import { registerKeyPressAction, registerKeyReleaseAction } from '../ui/actions'

const useModifierKeys = () => {
  const dispatch = useDispatch()
  const activeKeys = useSelector(uiModifierKeysSelector)
  const registerKeyPress = useCallback(
    (event: KeyboardEvent) => {
      dispatch(registerKeyPressAction(event.key))
    },
    [dispatch],
  )
  const registerKeyRelease = useCallback(
    (event: KeyboardEvent) => {
      dispatch(registerKeyReleaseAction(event.key))
    },
    [dispatch],
  )

  return { activeKeys, registerKeyPress, registerKeyRelease }
}

export default useModifierKeys
