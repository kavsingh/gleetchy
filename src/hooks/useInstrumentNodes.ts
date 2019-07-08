import { useSelector, useDispatch } from 'react-redux'

import {
  instrumentsSelector,
  orderedInstrumentsSelector,
  activeInstrumentsSelector,
} from '~/state/instruments/selectors'
import { addLoopAction } from '~/state/instruments/actions'

const useInstrumentNodes = () => {
  const dispatch = useDispatch()
  const nodes = useSelector(instrumentsSelector)
  const orderedIdentifiers = useSelector(orderedInstrumentsSelector)
  const activeIds = useSelector(activeInstrumentsSelector)
  const addLoop = () => dispatch(addLoopAction())

  return { nodes, orderedIdentifiers, activeIds, addLoop }
}

export default useInstrumentNodes
