import { useState, useEffect } from 'react'

import { AudioNodeState } from '~/types'

import useInstrumentNodes from './useInstrumentNodes'
import useAudioEffectNodes from './useAudioEffectNodes'
import useAudioContextNodes from './useAudioContextNodes'

const useAllNodes = () => {
  const [allNodes, setAllNodes] = useState<{
    [key: string]: AudioNodeState<any> // eslint-disable-line
  }>({})

  const { nodes: instrumentNodes } = useInstrumentNodes()
  const { nodes: audioEffectNodes } = useAudioEffectNodes()
  const { nodes: audioContextNodes } = useAudioContextNodes()

  useEffect(() => {
    setAllNodes({
      ...instrumentNodes,
      ...audioEffectNodes,
      ...audioContextNodes,
    })
  }, [instrumentNodes, audioEffectNodes, audioContextNodes])

  return { allNodes }
}

export default useAllNodes
