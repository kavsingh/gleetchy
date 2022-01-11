import { useSelector } from 'react-redux'

import {
  selectInstrumentsIdentifierMeta,
  selectAudioEffectsIdentifierMeta,
} from '~/state/audio-nodes/selectors'

const useAudioNodesMeta = () => {
  const instruments = useSelector(selectInstrumentsIdentifierMeta)
  const audioEffects = useSelector(selectAudioEffectsIdentifierMeta)

  return { instruments, audioEffects }
}

export default useAudioNodesMeta
