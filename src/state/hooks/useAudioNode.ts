import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { AudioNodeState, AudioNodeConnection } from '~/types'
import {
  updateAudioNodeAudioPropsAction,
  updateAudioNodeLabelAction,
  removeAudioNodeAction,
} from '~/state/audioNodes/actions'
import { getConnectionsFor } from '~/util/audio'

import useAudioNodes from './useAudioNodes'
import useConnections from './useConnections'

const useAudioNode = <T>(
  id: string,
  isValid: (node: AudioNodeState) => boolean,
  defaultAudioProps: T,
) => {
  const dispatch = useDispatch()

  const [{ nodes, activeIds }] = useAudioNodes()
  const [{ connections: allConnections }] = useConnections()

  const [label, setLabel] = useState('')
  const [audioProps, setAudioProps] = useState<T>(defaultAudioProps)
  const [connections, setConnections] = useState<AudioNodeConnection[]>([])
  const [isActive, setIsActive] = useState(false)

  const remove = useCallback(() => dispatch(removeAudioNodeAction(id)), [
    id,
    dispatch,
  ])

  const updateAudioProps = useCallback(
    (audioProps: Partial<T>) =>
      dispatch(updateAudioNodeAudioPropsAction(id, audioProps)),
    [id, dispatch],
  )

  const updateLabel = useCallback(
    (label: string) => dispatch(updateAudioNodeLabelAction(id, label)),
    [id, dispatch],
  )

  useEffect(() => {
    const node = nodes[id]

    if (!node) throw new Error(`Audio node not found at id ${id}`)
    if (!isValid(node)) throw new Error(`Audio node is invalid for ${id}`)

    setAudioProps(node.audioProps as any) // eslint-disable-line
    setLabel(node.label)
  }, [id, nodes, isValid])

  useEffect(() => {
    setIsActive(activeIds.includes(id))
  }, [id, activeIds])

  useEffect(() => {
    setConnections(getConnectionsFor(id, allConnections))
  }, [id, allConnections])

  return {
    label,
    audioProps,
    updateAudioProps,
    updateLabel,
    connections,
    isActive,
    remove,
  }
}

export default useAudioNode
