import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getConnectionBetween, canConnectNodes } from '~/lib/audio'
import type { AudioNodeMeta } from '~/types'

import { connectionsSelector } from '../connections/selectors'
import { toggleConnectionAction } from '../connections/actions'

const useConnection = (source: AudioNodeMeta, target: AudioNodeMeta) => {
  const dispatch = useDispatch()
  const connections = useSelector(connectionsSelector)
  const connection = getConnectionBetween(connections, source, target)
  const isBlocked = !canConnectNodes(connections, source, target)

  const toggleConnection = useCallback(() => {
    if (!isBlocked) dispatch(toggleConnectionAction(source.id, target.id))
  }, [isBlocked, dispatch, source.id, target.id])

  return { connection, isBlocked, toggleConnection }
}

export default useConnection
