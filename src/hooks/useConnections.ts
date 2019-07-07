import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { AudioNodeIdentifier } from '~/types'
import { connectionsSelector } from '~/state/connections/selectors'
import { toggleConnectionAction } from '~/state/connections/actions'

import useInstrumentNodes from './useInstrumentNodes'
import useAudioEffectNodes from './useAudioEffectNodes'
import useAudioContextNodes from './useAudioContextNodes'

const useConnections = () => {
  const dispatch = useDispatch()

  const connections = useSelector(connectionsSelector)
  const { orderedIdentifiers: instrumentIdentifiers } = useInstrumentNodes()
  const { orderedIdentifiers: audioEffectIdentifiers } = useAudioEffectNodes()
  const { mainOut } = useAudioContextNodes()

  const [sources, setSources] = useState<AudioNodeIdentifier[]>([])
  const [targets, setTargets] = useState<AudioNodeIdentifier[]>([])

  useEffect(() => {
    setSources([...instrumentIdentifiers, ...audioEffectIdentifiers])
  }, [instrumentIdentifiers, audioEffectIdentifiers])

  useEffect(() => {
    setTargets(
      audioEffectIdentifiers.concat({ id: mainOut.id, type: mainOut.type }),
    )
  }, [audioEffectIdentifiers, mainOut])

  const toggleConnection = (
    { id: from }: AudioNodeIdentifier,
    { id: to }: AudioNodeIdentifier,
  ) => dispatch(toggleConnectionAction(from, to))

  return {
    connections,
    sources,
    targets,
    toggleConnection,
  }
}

export default useConnections
