import { memo, useEffect } from 'react'
import Favicon from 'react-favicon'
import styled from '@emotion/styled'

import { requireWindowWith } from '~/lib/env'
import useModifierKeys from '~/state/hooks/use-modifier-keys'
import favicon from '~/assets/icons/48x48.png'
import type { ThemeProps } from '~/style/theme'
import type { FCWithoutChildren } from '~/types'

import AudioEffectsRack from './audio-effects-rack'
import InstrumentsRack from './instruments-rack'
import PatchBay from './patch-bay'
import Masthead from './masthead'

const UI: FCWithoutChildren = () => {
  const { registerKeyPress, registerKeyRelease } = useModifierKeys()

  useEffect(() => {
    const WINDOW = requireWindowWith([
      'addEventListener',
      'removeEventListener',
    ])

    if (!WINDOW) return undefined

    WINDOW.addEventListener('keydown', registerKeyPress, true)
    WINDOW.addEventListener('keyup', registerKeyRelease, true)

    return () => {
      WINDOW.removeEventListener('keydown', registerKeyPress, true)
      WINDOW.removeEventListener('keyup', registerKeyRelease, true)
    }
  }, [registerKeyPress, registerKeyRelease])

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
