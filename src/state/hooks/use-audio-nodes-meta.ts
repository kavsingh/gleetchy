import { useSelector } from 'react-redux'

import {
  instrumentsIdentifierMetaSelector,
  audioEffectsIdentifierMetaSelector,
} from '~/state/audio-nodes/selectors'

const useAudioNodesMeta = () => {
  const instruments = useSelector(instrumentsIdentifierMetaSelector)
  const audioEffects = useSelector(audioEffectsIdentifierMetaSelector)

  return [{ instruments, audioEffects }] as const
}

export default useAudioNodesMeta
