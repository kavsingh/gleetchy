import { useCallback, memo } from 'react'

import { nodeType, UI } from '~/nodes/instruments/loop'
import {
  receiveAudioFile as receiveAudioFileAction,
  selectAudioFile as selectAudioFileAction,
} from '~/state/audio-files/actions'
import useAudioNode, { validateNodeType } from '~/state/hooks/use-audio-node'
import { useAppDispatch } from '~/state/hooks/base'
import { useAudioContext } from '~/contexts/audio-context-context'

import type { FC } from 'react'
import type { NodeProps as Eq3Props } from '~/nodes/audio-effects/eq3'
import type { NodeProps } from '~/nodes/instruments/loop'

const ConnectedLoop: FC<{ id: string }> = ({ id }) => {
  const {
    label,
    connections,
    audioProps,
    isActive,
    updateAudioProps,
    updateLabel,
    duplicate,
    remove,
  } = useAudioNode<NodeProps>(id, validateNodeType(nodeType))
  const { audioContext } = useAudioContext()

  const dispatch = useAppDispatch()

  const receiveAudioFile = useCallback(
    (file: File) => {
      if (!audioContext) return

      void dispatch(receiveAudioFileAction({ id, file, audioContext }))
    },
    [id, dispatch, audioContext],
  )

  const selectAudioFile = useCallback(() => {
    if (!audioContext) return

    void dispatch(selectAudioFileAction({ id, audioContext }))
  }, [id, dispatch, audioContext])

  const handleGainChange = useCallback(
    (gain: number) => updateAudioProps({ gain }),
    [updateAudioProps],
  )

  const handlePlaybackRateChange = useCallback(
    (playbackRate: number) => updateAudioProps({ playbackRate }),
    [updateAudioProps],
  )

  const handleEqChange = useCallback(
    (eqProps: Eq3Props) => updateAudioProps(eqProps),
    [updateAudioProps],
  )

  const handleLoopRegionChange = useCallback(
    (loopStart: number, loopEnd: number) =>
      updateAudioProps({ loopStart, loopEnd }),
    [updateAudioProps],
  )

  return (
    <UI
      nodeId={id}
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
