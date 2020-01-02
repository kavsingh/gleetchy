import React, { FunctionComponent, useCallback, memo } from 'react'
import { useDispatch } from 'react-redux'

import { nodeType, NodeProps, defaultProps, UI } from '~/nodes/instruments/loop'
import {
  receiveAudioFileAction,
  selectAudioFileAction,
} from '~/state/audioFiles/actions'
import useAudioNode from '~/state/hooks/useAudioNode'

const ConnectedLoop: FunctionComponent<{ id: string }> = ({ id }) => {
  const [
    { label, connections, audioProps, isActive },
    { updateAudioProps, updateLabel, duplicate, remove },
  ] = useAudioNode<NodeProps>(id, node => node.type === nodeType, defaultProps)

  const dispatch = useDispatch()

  const receiveAudioFile = useCallback(
    (file: File) => dispatch(receiveAudioFileAction(id, file)),
    [id, dispatch],
  )

  const selectAudioFile = useCallback(
    () => dispatch(selectAudioFileAction(id)),
    [id, dispatch],
  )

  const handleGainChange = useCallback(
    (gain: number) => updateAudioProps({ gain }),
    [updateAudioProps],
  )

  const handlePlaybackRateChange = useCallback(
    (playbackRate: number) => updateAudioProps({ playbackRate }),
    [updateAudioProps],
  )

  const handleEqChange = useCallback(eqProps => updateAudioProps(eqProps), [
    updateAudioProps,
  ])

  const handleLoopRegionChange = useCallback(
    (loopStart, loopEnd) => updateAudioProps({ loopStart, loopEnd }),
    [updateAudioProps],
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
      onGainChange={handleGainChange}
      onPlaybackRateChange={handlePlaybackRateChange}
      onEqChange={handleEqChange}
      selectAudioFile={selectAudioFile}
      receiveAudioFile={receiveAudioFile}
      onLoopRegionChange={handleLoopRegionChange}
      onLabelChange={updateLabel}
      duplicate={duplicate}
      remove={remove}
    />
  )
}

export default memo(ConnectedLoop)
