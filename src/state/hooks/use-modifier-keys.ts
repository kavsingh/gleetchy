import { useCallback } from 'react'

import { selectModifierKeys } from '../ui/selectors'
import { registerKeyPressAction, registerKeyReleaseAction } from '../ui/actions'
import { useAppDispatch, useAppSelector } from './base'

const useModifierKeys = () => {
  const dispatch = useAppDispatch()
  const activeKeys = useAppSelector(selectModifierKeys)
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

  return { activeKeys, registerKeyPress, registerKeyRelease } as const
}

export default useModifierKeys
