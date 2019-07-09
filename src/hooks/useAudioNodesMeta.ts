import { useSelector } from 'react-redux'

import {
  orderedInstrumentsMetaSelector,
  orderedAudioEffectsMetaSelector,
  mainOutNodeSelector,
} from '~/state/audioNodes/selectors'
import { AudioNodeMeta } from '~/types'

const useAudioNodesMeta = () => {
  const instruments = useSelector(orderedInstrumentsMetaSelector)
  const audioEffects = useSelector(orderedAudioEffectsMetaSelector)
  const { id, type } = useSelector(mainOutNodeSelector)
  const mainOut: AudioNodeMeta = { id, type }

  return { instruments, audioEffects, mainOut }
}

export default useAudioNodesMeta
