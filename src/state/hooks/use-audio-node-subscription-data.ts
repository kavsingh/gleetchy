import { useSelector } from 'react-redux'
import { equals } from 'ramda'

import type { ApplicationState } from '../configure-store'

const useAudioNodeSubscriptionData = (id: string) =>
  useSelector<ApplicationState, { [key: string]: unknown }>(
    (state) => state.audioEngine.subscriptionData[id] || {},
    equals,
  )

export default useAudioNodeSubscriptionData
