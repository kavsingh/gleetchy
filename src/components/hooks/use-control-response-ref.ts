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
  const [keys] = useModifierKeys()
  const multiplierRef = useRef(normal)

  useEffect(() => {
    multiplierRef.current = keys.includes(ModifierKey.Shift) ? fine : normal
  }, [keys, normal, fine])

  return multiplierRef
}

export default useControlResponseRef
