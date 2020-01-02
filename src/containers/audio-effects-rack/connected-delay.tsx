import React, { FunctionComponent, memo, useCallback } from 'react'

import {
  nodeType,
  defaultProps,
  NodeProps,
  UI,
} from '~/nodes/audio-effects/delay'
import useAudioNode from '~/state/hooks/use-audio-node'

const ConnectedReverb: FunctionComponent<{ id: string }> = ({ id }) => {
  const [
    { connections, isActive, label, audioProps },
    { updateLabel, updateAudioProps, remove },
  ] = useAudioNode<NodeProps>(id, node => node.type === nodeType, defaultProps)

  const handleDelayTimeChange = useCallback(
    delayTime => updateAudioProps({ delayTime }),
    [updateAudioProps],
  )

  const handleWetDryRatioChange = useCallback(
    wetDryRatio => updateAudioProps({ wetDryRatio }),
    [updateAudioProps],
  )

  return (
    <UI
      connections={connections}
      isActive={isActive}
      label={label}
      delayTime={audioProps.delayTime}
      wetDryRatio={audioProps.wetDryRatio}
      onLabelChange={updateLabel}
      onDelayTimeChange={handleDelayTimeChange}
      onWetDryRatioChange={handleWetDryRatioChange}
      remove={remove}
    />
  )
}

export default memo(ConnectedReverb)
