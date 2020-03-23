import React from 'react'

import { FunctionComponentWithoutChildren } from '~/types'
import { isFiniteNumber } from '~/lib/util/predicate'
import useAudioNodeSubscriptionData from '~/state/hooks/use-audio-node-subscription-data'
import Sample, { SampleProps } from '~/components/sample'

const LoopSample: FunctionComponentWithoutChildren<
  SampleProps & { nodeId: string }
> = ({ nodeId, ...props }) => {
  const { positionRatio } = useAudioNodeSubscriptionData(nodeId)

  return (
    <Sample
      {...props}
      positionRatio={isFiniteNumber(positionRatio) ? positionRatio : undefined}
    />
  )
}

export default LoopSample
