import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { AudioNodeMeta } from '~/types'
import { connectionsSelector } from '~/state/connections/selectors'
import { toggleConnectionAction } from '~/state/connections/actions'

import useAudioNodesMeta from './useAudioNodesMeta'

const useConnections = () => {
  const { instruments, audioEffects, mainOut } = useAudioNodesMeta()

  const dispatch = useDispatch()
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
