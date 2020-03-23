import { useSelector } from 'react-redux'
import { equals } from 'ramda'

// TODO: type only import
// eslint-disable-next-line import/no-cycle
import { ApplicationState } from '../configure-store'

const useAudioNodeSubscriptionData = (id: string) =>
  useSelector<ApplicationState, { [key: string]: unknown }>(
    (state) => state.audioEngine.subscriptionData[id] || {},
    equals,
  )

export default useAudioNodeSubscriptionData
