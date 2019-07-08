import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { AudioNodeConnection, AudioNodeState } from '~/types'
import {
  updateInstrumentPropsAction,
  updateInstrumentLabelAction,
  removeInstrumentAction,
} from '~/state/instruments/actions'
import { getConnectionsFor } from '~/util/audio'

import useInstrumentNodes from './useInstrumentNodes'
import useConnections from './useConnections'

const useInstrumentNode = <T>(
  id: string,
  isValid: (node: AudioNodeState) => boolean,
  defaultAudioProps: T,
) => {
  const dispatch = useDispatch()

  const { nodes, activeIds } = useInstrumentNodes()
  const { connections: allConnections } = useConnections()

  const [label, setLabel] = useState('')
  const [audioProps, setAudioProps] = useState<T>(defaultAudioProps)
  const [connections, setConnections] = useState<AudioNodeConnection[]>([])
  const [isActive, setIsActive] = useState(false)

  const updateAudioProps = useCallback(
    (props: Partial<T>) => dispatch(updateInstrumentPropsAction(id, props)),
    [id, dispatch],
  )

  const updateLabel = useCallback(
    (label: string) => dispatch(updateInstrumentLabelAction(id, label)),
    [id, dispatch],
  )

  const remove = useCallback(() => dispatch(removeInstrumentAction(id)), [
    id,
    dispatch,
  ])

  useEffect(() => {
    const node = nodes[id]

    if (!node) throw new Error(`Instrument not found at id ${id}`)
    if (!isValid(node)) throw new Error(`Unexpected node type for ${id}`)

    setAudioProps(node.props as any) // eslint-disable-line
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
    connections,
    isActive,
    updateAudioProps,
    updateLabel,
    remove,
  }
}

export default useInstrumentNode
