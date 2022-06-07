import { equals } from 'ramda'

import { useAppSelector } from './base'

const useAudioNodeSubscriptionData = (id: string) =>
  useAppSelector(
    (state) => state.audioEngine.subscriptionData[id] ?? {},
    equals,
  )

export default useAudioNodeSubscriptionData
