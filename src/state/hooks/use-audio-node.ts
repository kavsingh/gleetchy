import { useCallback, useEffect, useState } from 'react'
import { equals } from 'ramda'

import {
  updateAudioNodeAudioPropsAction,
  updateAudioNodeLabelAction,
  duplicateAudioNodeAction,
  removeAudioNodeAction,
} from '~/state/audio-nodes/actions'
import { getConnectionsFor } from '~/lib/audio'

import {
  selectAudioNodes,
  selectActiveAudioNodeIds,
} from '../audio-nodes/selectors'
import { selectConnections } from '../connections/selectors'
import { useAppDispatch, useAppSelector } from './base'

import type { AudioNodeState, AudioNodeConnection } from '~/types'

const useAudioNode = <T extends Record<string, unknown>>(
  id: string,
  isValid: AudioNodeStateValidator,
) => {
  const node = useAppSelector(
    (state) => selectAudioNodes(state)[id] as AudioNodeState<T>,
    equals,
  )
  const isActive = useAppSelector((state) =>
    selectActiveAudioNodeIds(state).includes(node.id),
  )
  const allConnections = useAppSelector(selectConnections)
  const dispatch = useAppDispatch()

  const [connections, setConnections] = useState<AudioNodeConnection[]>([])

  const duplicate = useCallback(
    () => dispatch(duplicateAudioNodeAction(id)),
    [id, dispatch],
  )

  const remove = useCallback(
    () => dispatch(removeAudioNodeAction(id)),
    [id, dispatch],
  )

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
    if (!node) throw new Error(`Audio node not found at id ${id}`)
    if (!isValid(node)) throw new Error(`Audio node is invalid for ${id}`)
  }, [id, isValid, node])

  useEffect(() => {
    setConnections((current) => {
      const next = getConnectionsFor(id, allConnections)

      return equals(current, next) ? current : next
    })
  }, [id, allConnections])

  return {
    label: node.label,
    audioProps: node.audioProps,
    connections,
    isActive,
    updateAudioProps,
    updateLabel,
    duplicate,
    remove,
  } as const
}

export default useAudioNode

export type AudioNodeStateValidator = (
  node: AudioNodeState<Record<string, unknown>>,
) => boolean

export const validateNodeType =
  (
    type: AudioNodeState<Record<string, unknown>>['type'],
  ): AudioNodeStateValidator =>
  (node: AudioNodeState<Record<string, unknown>>) =>
    node.type === type
