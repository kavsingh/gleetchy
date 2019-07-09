import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { AudioNodeMeta } from '~/types'
import {
  orderedInstrumentsMetaSelector,
  orderedAudioEffectsMetaSelector,
  mainOutMetaSelector,
} from '~/state/audioNodes/selectors'
import { connectionsSelector } from '~/state/connections/selectors'
import { toggleConnectionAction } from '~/state/connections/actions'

const useConnections = () => {
  const dispatch = useDispatch()

  const instruments = useSelector(orderedInstrumentsMetaSelector)
  const audioEffects = useSelector(orderedAudioEffectsMetaSelector)
  const mainOut = useSelector(mainOutMetaSelector)
  const connections = useSelector(connectionsSelector)

  const [sources, setSources] = useState<AudioNodeMeta[]>([])
  const [targets, setTargets] = useState<AudioNodeMeta[]>([])

  useEffect(() => {
    setSources([...instruments, ...audioEffects])
  }, [instruments, audioEffects])

  useEffect(() => {
    setTargets(audioEffects.concat(mainOut))
  }, [audioEffects, mainOut])

  const toggleConnection = useCallback(
    ({ id: from }: AudioNodeMeta, { id: to }: AudioNodeMeta) =>
      dispatch(toggleConnectionAction(from, to)),
    [dispatch],
  )

  return {
    connections,
    sources,
    targets,
    toggleConnection,
  }
}

export default useConnections
