import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { equals } from 'ramda'

import { AudioNodeMeta } from '~/types'
import {
  connectableSourcesSelector,
  connectableTargetsSelector,
} from '~/state/audio-nodes/selectors'
import { connectionsSelector } from '~/state/connections/selectors'
import { toggleConnectionAction } from '~/state/connections/actions'

const useConnections = () => {
  const dispatch = useDispatch()

  const sources = useSelector(connectableSourcesSelector, equals)
  const targets = useSelector(connectableTargetsSelector, equals)
  const connections = useSelector(connectionsSelector, equals)

  const toggleConnection = useCallback(
    ({ id: from }: AudioNodeMeta, { id: to }: AudioNodeMeta) =>
      dispatch(toggleConnectionAction(from, to)),
    [dispatch],
  )

  return [{ connections, sources, targets }, { toggleConnection }] as const
}

export default useConnections
