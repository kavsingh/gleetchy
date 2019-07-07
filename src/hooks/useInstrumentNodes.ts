import { useSelector } from 'react-redux'

import {
  instrumentsSelector,
  orderedInstrumentsSelector,
  activeInstrumentsSelector,
} from '~/state/instruments/selectors'

const useInstrumentNodes = () => {
  const nodes = useSelector(instrumentsSelector)
  const orderedIdentifiers = useSelector(orderedInstrumentsSelector)
  const activeIds = useSelector(activeInstrumentsSelector)

  return { nodes, orderedIdentifiers, activeIds }
}

export default useInstrumentNodes
