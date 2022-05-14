import { memo, useEffect } from 'react'
import Favicon from 'react-favicon'
import styled from '@emotion/styled'

import { requireWindowWith } from '~/lib/env'
import useModifierKeys from '~/state/hooks/use-modifier-keys'
import favicon from '~/assets/icons/48x48.png'
import { useAudioContext } from '~/contexts/audio-context-context'

import AudioEffectsRack from './audio-effects-rack'
import InstrumentsRack from './instruments-rack'
import PatchBay from './patch-bay'
import Masthead from './masthead'

import type { FC } from 'react'
import type { ThemeProps } from '~/style/theme'

const UI: FC = () => {
  const { initAudioContext } = useAudioContext()
  const { registerKeyPress, registerKeyRelease } = useModifierKeys()

  useEffect(() => {
    const WINDOW = requireWindowWith([
      'addEventListener',
      'removeEventListener',
    ])

    if (!WINDOW) return undefined

    const clickHandler = () => initAudioContext()

    WINDOW.addEventListener('keydown', registerKeyPress, true)
    WINDOW.addEventListener('keyup', registerKeyRelease, true)
    WINDOW.addEventListener('click', clickHandler)

    return () => {
      WINDOW.removeEventListener('keydown', registerKeyPress, true)
      WINDOW.removeEventListener('keyup', registerKeyRelease, true)
      WINDOW.removeEventListener('click', clickHandler, true)
    }
  }, [registerKeyPress, registerKeyRelease, initAudioContext])

  return (
    <>
      <Favicon url={favicon} />
      <Container>
        <Masthead />
        <Divider />
        <InstrumentsRack />
        <Divider />
        <ModifiersContainer>
          <AudioEffectsRackContainer>
            <AudioEffectsRack />
          </AudioEffectsRackContainer>
          <PatchBayContainer>
            <PatchBay />
          </PatchBayContainer>
        </ModifiersContainer>
      </Container>
    </>
  )
}

export default memo(UI)

const Container = styled.div<ThemeProps>`
  max-width: 92em;
  margin: 0 auto;
  padding: 2em;
`

const Divider = styled.div<ThemeProps>`
  height: 1px;
  margin: 1em 0;
  background-color: ${({ theme }) => theme.colors.keyline};
`

const ModifiersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const AudioEffectsRackContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
`

const PatchBayContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
`
