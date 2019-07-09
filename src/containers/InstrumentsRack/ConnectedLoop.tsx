import React, { FunctionComponent, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { nodeType, NodeProps, defaultProps, UI } from '~/nodes/instruments/loop'
import {
  receiveAudioFileAction,
  selectAudioFileAction,
} from '~/state/audioFiles/actions'
import useAudioNode from '~/hooks/useAudioNode'

const ConnectedLoop: FunctionComponent<{ id: string }> = ({ id }) => {
  const {
    label,
    connections,
    audioProps,
    isActive,
    updateAudioProps,
    updateLabel,
    remove,
  } = useAudioNode<NodeProps>(id, node => node.type === nodeType, defaultProps)

  const dispatch = useDispatch()

  const receiveAudioFile = useCallback(
    (file: File) => dispatch(receiveAudioFileAction(id, file)),
    [id, dispatch],
  )

  const selectAudioFile = useCallback(
    () => dispatch(selectAudioFileAction(id)),
    [id, dispatch],
  )

  return (
    <UI
      loopStart={audioProps.loopStart}
      loopEnd={audioProps.loopEnd}
      label={label}
      fileName={audioProps.fileName}
      connections={connections}
      isActive={isActive}
      highGain={audioProps.highGain}
      midGain={audioProps.midGain}
      lowGain={audioProps.lowGain}
      playbackRate={audioProps.playbackRate}
      gain={audioProps.gain}
      audioBuffer={audioProps.audioBuffer}
      onGainChange={gain => updateAudioProps({ gain })}
      onPlaybackRateChange={playbackRate => updateAudioProps({ playbackRate })}
      onEqChange={eqProps => updateAudioProps(eqProps)}
      selectAudioFile={selectAudioFile}
      receiveAudioFile={receiveAudioFile}
      onLoopRegionChange={(loopStart, loopEnd) =>
        updateAudioProps({ loopStart, loopEnd })
      }
      onLabelChange={updateLabel}
      remove={remove}
    />
  )
}

export default ConnectedLoop
