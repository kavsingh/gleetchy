import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useDispatch } from 'react-redux'

import useInstrumentNodes from '~/hooks/useInstrumentNodes'
import { nodeType, nodeProps, UI as Loop } from '~/nodes/instruments/loop'
import { AudioNodeConnection } from '~/types'
import useConnections from '~/hooks/useConnections'
import { getConnectionsFor } from '~/util/audio'
import {
  updateInstrumentPropsAction,
  updateInstrumentLabelAction,
  removeInstrumentAction,
} from '~/state/instruments/actions'
import {
  receiveAudioFileAction,
  selectAudioFileAction,
} from '~/state/audioFiles/actions'

type LoopNodeProps = typeof nodeProps

const ConnectedLoop: FunctionComponent<{ id: string }> = ({ id }) => {
  const dispatch = useDispatch()

  const { nodes, activeIds } = useInstrumentNodes()
  const { connections: allConnections } = useConnections()

  const [label, setLabel] = useState('')
  const [props, setProps] = useState<LoopNodeProps>(nodeProps)
  const [connections, setConnections] = useState<AudioNodeConnection[]>([])
  const [isActive, setIsActive] = useState(false)

  const dispatchPropsUpdate = useCallback(
    (props: Partial<LoopNodeProps>) =>
      dispatch(updateInstrumentPropsAction(id, props)),
    [id, dispatch],
  )

  const changeLabel = useCallback(
    (label: string) => dispatch(updateInstrumentLabelAction(id, label)),
    [id, dispatch],
  )

  const remove = useCallback(() => dispatch(removeInstrumentAction(id)), [
    id,
    dispatch,
  ])

  const receiveAudioFile = useCallback(
    (file: File) => dispatch(receiveAudioFileAction(id, file)),
    [id, dispatch],
  )

  const selectAudioFile = useCallback(
    () => dispatch(selectAudioFileAction(id)),
    [id, dispatch],
  )

  useEffect(() => {
    const node = nodes[id]

    if (!node) throw new Error(`Loop not found at id ${id}`)

    if (node.type !== nodeType) {
      throw new Error(
        `Unexpected instrument type for ${id}, expected ${nodeType}, got ${node.type}`,
      )
    }

    setProps(node.props)
    setLabel(node.label)
  }, [id, nodes])

  useEffect(() => {
    setIsActive(activeIds.includes(id))
  }, [id, activeIds])

  useEffect(() => {
    setConnections(getConnectionsFor(id, allConnections))
  }, [id, allConnections])

  return (
    <Loop
      loopStart={props.loopStart}
      loopEnd={props.loopEnd}
      label={label}
      fileName={props.fileName}
      connections={connections}
      isActive={isActive}
      highGain={props.highGain}
      midGain={props.midGain}
      lowGain={props.lowGain}
      playbackRate={props.playbackRate}
      gain={props.gain}
      audioBuffer={props.audioBuffer}
      onGainChange={gain => dispatchPropsUpdate({ gain })}
      onPlaybackRateChange={playbackRate =>
        dispatchPropsUpdate({ playbackRate })
      }
      onEqChange={eqProps => dispatchPropsUpdate(eqProps)}
      selectAudioFile={selectAudioFile}
      receiveAudioFile={receiveAudioFile}
      onLoopRegionChange={(loopStart, loopEnd) =>
        dispatchPropsUpdate({ loopStart, loopEnd })
      }
      onLabelChange={changeLabel}
      remove={remove}
    />
  )
}

export default ConnectedLoop
