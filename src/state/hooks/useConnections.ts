import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { AudioNodeMeta } from '~/types'
import {
  connectableSourcesSelector,
  connectableTargetsSelector,
} from '~/state/audioNodes/selectors'
import { connectionsSelector } from '~/state/connections/selectors'
import { toggleConnectionAction } from '~/state/connections/actions'

const useConnections = () => {
  const dispatch = useDispatch()

  const sources = useSelector(connectableSourcesSelector)
  const targets = useSelector(connectableTargetsSelector)
  const connections = useSelector(connectionsSelector)

  const toggleConnection = useCallback(
    ({ id: from }: AudioNodeMeta, { id: to }: AudioNodeMeta) =>
      dispatch(toggleConnectionAction(from, to)),
    [dispatch],
  )

  return [{ connections, sources, targets }, { toggleConnection }] as const
}

export default useConnections
