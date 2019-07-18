import { useSelector } from 'react-redux'

import {
  mainOutMetaSelector,
  immutableInstrumentsMetaSelector,
  immutableAudioEffectsMetaSelector,
} from '~/state/audioNodes/selectors'

const useAudioNodesMeta = () => {
  const instruments = useSelector(immutableInstrumentsMetaSelector)
  const audioEffects = useSelector(immutableAudioEffectsMetaSelector)
  // TODO: strip out label
  const mainOut = useSelector(mainOutMetaSelector)

  return { instruments, audioEffects, mainOut }
}

export default useAudioNodesMeta
