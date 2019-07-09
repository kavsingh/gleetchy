import { useSelector } from 'react-redux'

import {
  orderedInstrumentsMetaSelector,
  orderedAudioEffectsMetaSelector,
  mainOutMetaSelector,
} from '~/state/audioNodes/selectors'

const useAudioNodesMeta = () => {
  const instruments = useSelector(orderedInstrumentsMetaSelector)
  const audioEffects = useSelector(orderedAudioEffectsMetaSelector)
  const mainOut = useSelector(mainOutMetaSelector)

  return { instruments, audioEffects, mainOut }
}

export default useAudioNodesMeta
