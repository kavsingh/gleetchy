import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { getAudioContext } from '~/apis/audio'

import type { FC, ReactNode } from 'react'

const AudioContextContext = createContext<AudioContextContextValue>({
  initAudioContext: () => undefined,
})

export const AudioContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [audioContext, setAudioContext] = useState<AudioContext>()

  const initAudioContext = useCallback(() => {
    setAudioContext((current) => {
      if (current?.state === 'running') return current

      if (current?.state === 'suspended') {
        void current.resume()

        return current
      }

      return getAudioContext()
    })
  }, [])

  const contextValue = useMemo(
    () => ({ audioContext, initAudioContext }),
    [audioContext, initAudioContext],
  )

  return (
    <AudioContextContext.Provider value={contextValue}>
      {children}
    </AudioContextContext.Provider>
  )
}

export const useAudioContext = () => useContext(AudioContextContext)

interface AudioContextContextValue {
  audioContext?: AudioContext
  initAudioContext: () => void
}
