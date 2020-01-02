import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { equals } from 'ramda'

import { AudioNodeState, AudioNodeConnection } from '~/types'
import {
  updateAudioNodeAudioPropsAction,
  updateAudioNodeLabelAction,
  duplicateAudioNodeAction,
  removeAudioNodeAction,
} from '~/state/audio-nodes/actions'
import { getConnectionsFor } from '~/util/audio'

import useAudioNodes from './use-audio-nodes'
import useConnections from './use-connections'

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

  const duplicate = useCallback(() => dispatch(duplicateAudioNodeAction(id)), [
    id,
    dispatch,
  ])

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAudioProps(node.audioProps as any)
    setLabel(node.label)
  }, [id, nodes, isValid])

  useEffect(() => {
    setIsActive(activeIds.includes(id))
  }, [id, activeIds])

  useEffect(() => {
    setConnections(current => {
      const next = getConnectionsFor(id, allConnections)

      return equals(current, next) ? current : next
    })
  }, [id, allConnections])

  return [
    { label, audioProps, connections, isActive },
    { updateAudioProps, updateLabel, duplicate, remove },
  ] as const
}

export default useAudioNode
