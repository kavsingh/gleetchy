import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectModifierKeys } from '../ui/selectors'
import { registerKeyPressAction, registerKeyReleaseAction } from '../ui/actions'

const useModifierKeys = () => {
  const dispatch = useDispatch()
  const activeKeys = useSelector(selectModifierKeys)
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
