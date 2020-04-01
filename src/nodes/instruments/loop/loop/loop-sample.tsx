import React from 'react'

import { isFiniteNumber } from '~/lib/util/predicate'
import useAudioNodeSubscriptionData from '~/state/hooks/use-audio-node-subscription-data'
import Sample from '~/components/sample'
import type { SampleProps } from '~/components/sample'
import type { FunctionComponentWithoutChildren } from '~/types'

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
