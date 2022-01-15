import { memo, useCallback } from 'react'

import { nodeType, UI } from '~/nodes/audio-effects/delay'
import useAudioNode, { validateNodeType } from '~/state/hooks/use-audio-node'

import type { VoidFunctionComponent } from 'react'
import type { NodeProps } from '~/nodes/audio-effects/delay'

const ConnectedReverb: VoidFunctionComponent<{ id: string }> = ({ id }) => {
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
    (delayTime: number) => updateAudioProps({ delayTime }),
    [updateAudioProps],
  )

  const handleWetDryRatioChange = useCallback(
    (wetDryRatio: number) => updateAudioProps({ wetDryRatio }),
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
