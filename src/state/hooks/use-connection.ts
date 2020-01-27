import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AudioNodeMeta } from '~/types'
import { getConnectionBetween, canConnectNodes } from '~/lib/audio'

import { connectionsSelector } from '../connections/selectors'
import { toggleConnectionAction } from '../connections/actions'

const useConnection = (source: AudioNodeMeta, target: AudioNodeMeta) => {
  const dispatch = useDispatch()
  const connections = useSelector(connectionsSelector)
  const connection = getConnectionBetween(connections, source, target)
  const blocked = !canConnectNodes(connections, source, target)

  const toggleConnection = useCallback(() => {
    if (!blocked) dispatch(toggleConnectionAction(source.id, target.id))
  }, [blocked, dispatch, source.id, target.id])

  return [{ connection, blocked }, { toggleConnection }] as const
}

export default useConnection
