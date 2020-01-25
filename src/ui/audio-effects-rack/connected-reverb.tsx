import React, { FunctionComponent, memo, useCallback } from 'react'

import { nodeType, NodeProps, UI } from '~/nodes/audio-effects/reverb'
import useAudioNode, { validateNodeType } from '~/state/hooks/use-audio-node'

const ConnectedReverb: FunctionComponent<{ id: string }> = ({ id }) => {
  const [
    { connections, isActive, label, audioProps },
    { updateLabel, updateAudioProps, remove },
  ] = useAudioNode<NodeProps>(id, validateNodeType(nodeType))

  const handleWetDryRatioChange = useCallback(
    wetDryRatio => updateAudioProps({ wetDryRatio }),
    [updateAudioProps],
  )

  return (
    <UI
      connections={connections}
      isActive={isActive}
      label={label}
      wetDryRatio={audioProps.wetDryRatio}
      onLabelChange={updateLabel}
      onWetDryRatioChange={handleWetDryRatioChange}
      remove={remove}
    />
  )
}

export default memo(ConnectedReverb)
