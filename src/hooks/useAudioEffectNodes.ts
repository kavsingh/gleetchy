import { useSelector } from 'react-redux'

import {
  audioEffectsSelector,
  orderedAudioEffectsSelector,
  activeAudioEffectsSelector,
} from '~/state/audioEffects/selectors'

const useAudioEffectNodes = () => {
  const nodes = useSelector(audioEffectsSelector)
  const orderedIdentifiers = useSelector(orderedAudioEffectsSelector)
  const activeIds = useSelector(activeAudioEffectsSelector)

  return { nodes, orderedIdentifiers, activeIds }
}

export default useAudioEffectNodes
