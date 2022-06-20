import { memo, useCallback } from 'react'

import { nodeType, UI } from '~/nodes/audio-effects/reverb'
import useAudioNode, {
  validateNodeType,
} from '~/app-store/hooks/use-audio-node'

import type { FC } from 'react'
import type { NodeProps } from '~/nodes/audio-effects/reverb'

const ConnectedReverb: FC<{ id: string }> = ({ id }) => {
  const {
    connections,
    isActive,
    label,
    audioProps,
    updateLabel,
    updateAudioProps,
    remove,
  } = useAudioNode<NodeProps>(id, validateNodeType(nodeType))

  const handleWetDryRatioChange = useCallback(
    (wetDryRatio: number) => updateAudioProps({ wetDryRatio }),
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
