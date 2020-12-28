import { memo, useCallback } from 'react'

import { nodeType, NodeProps, UI } from '~/nodes/audio-effects/delay'
import useAudioNode, { validateNodeType } from '~/state/hooks/use-audio-node'
import type { FCWithoutChildren } from '~/types'

const ConnectedReverb: FCWithoutChildren<{ id: string }> = ({ id }) => {
  const {
    connections,
    isActive,
    label,
    audioProps,
    updateLabel,
    updateAudioProps,
    remove,
  } = useAudioNode<NodeProps>(id, validateNodeType(nodeType))

  const handleDelayTimeChange = useCallback(
    (delayTime) => updateAudioProps({ delayTime }),
    [updateAudioProps],
  )

  const handleWetDryRatioChange = useCallback(
    (wetDryRatio) => updateAudioProps({ wetDryRatio }),
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
