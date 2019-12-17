import { useSelector } from 'react-redux'
import { equals } from 'ramda'

import {
  immutableInstrumentsMetaSelector,
  immutableAudioEffectsMetaSelector,
} from '~/state/audioNodes/selectors'

const useAudioNodesMeta = () => {
  const instruments = useSelector(immutableInstrumentsMetaSelector, equals)
  const audioEffects = useSelector(immutableAudioEffectsMetaSelector, equals)

  return [{ instruments, audioEffects }] as const
}

export default useAudioNodesMeta
