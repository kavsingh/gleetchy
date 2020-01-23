import { useSelector } from 'react-redux'
import { equals } from 'ramda'

import {
  instrumentsIdentifierMetaSelector,
  audioEffectsIdentifierMetaSelector,
} from '~/state/audio-nodes/selectors'

const useAudioNodesMeta = () => {
  const instruments = useSelector(instrumentsIdentifierMetaSelector, equals)
  const audioEffects = useSelector(audioEffectsIdentifierMetaSelector, equals)

  return [{ instruments, audioEffects }] as const
}

export default useAudioNodesMeta
