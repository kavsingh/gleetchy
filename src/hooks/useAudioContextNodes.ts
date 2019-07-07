import { useSelector } from 'react-redux'

import {
  audioContextsSelector,
  mainOutSelector,
} from '~/state/audioContexts/selectors'

const useAudioContextNodes = () => {
  const nodes = useSelector(audioContextsSelector)
  const mainOut = useSelector(mainOutSelector)

  return { nodes, mainOut }
}

export default useAudioContextNodes
