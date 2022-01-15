import { isFiniteNumber } from '~/lib/util/predicate'
import useAudioNodeSubscriptionData from '~/state/hooks/use-audio-node-subscription-data'
import Sample from '~/components/sample'

import type { VoidFunctionComponent } from 'react'
import type { SampleProps } from '~/components/sample'

const LoopSample: VoidFunctionComponent<SampleProps & { nodeId: string }> = ({
  nodeId,
  ...props
}) => {
  const { positionRatio } = useAudioNodeSubscriptionData(nodeId)

  return (
    <Sample
      {...props}
      positionRatio={isFiniteNumber(positionRatio) ? positionRatio : undefined}
    />
  )
}

export default LoopSample
