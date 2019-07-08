import React, { useCallback, FunctionComponent } from 'react'

import { getConnectionBetween, canConnectNodes } from '~/util/audio'
import useConnections from '~/hooks/useConnections'
import useAllNodes from '~/hooks/useAllNodes'

import PatchBay from './PatchBay'

const PatchBayContainer: FunctionComponent = () => {
  const { allNodes } = useAllNodes()
  const { sources, targets, connections, toggleConnection } = useConnections()

  const canConnect = useCallback(canConnectNodes(connections), [connections])
  const getConnection = useCallback(getConnectionBetween(connections), [
    connections,
  ])
  const getNodeLabel = useCallback((id: string) => allNodes[id].label, [
    allNodes,
  ])

  return (
    <PatchBay
      getNodeLabel={getNodeLabel}
      canConnect={canConnect}
      getConnection={getConnection}
      fromNodes={sources}
      toNodes={targets}
      onNodeClick={toggleConnection}
    />
  )
}

export default PatchBayContainer
