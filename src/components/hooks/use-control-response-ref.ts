import { useRef, useEffect } from 'react'

import { ModifierKey } from '~/lib/constants'
import useModifierKeys from '~/state/hooks/use-modifier-keys'

export interface ControlResponseMultipliers {
  normal: number
  fine: number
}

const useControlResponseRef = ({
  normal,
  fine,
}: ControlResponseMultipliers) => {
  const { activeKeys } = useModifierKeys()
  const multiplierRef = useRef(normal)

  useEffect(() => {
    multiplierRef.current = activeKeys.includes(ModifierKey.Shift)
      ? fine
      : normal
  }, [activeKeys, normal, fine])

  return multiplierRef
}

export default useControlResponseRef
