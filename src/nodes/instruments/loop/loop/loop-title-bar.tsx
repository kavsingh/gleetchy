import { useMemo, memo } from 'react'
import styled from '@emotion/styled'

import TitleBar from '~/components/title-bar'
import Button from '~/components/button'

import type { FC } from 'react'
import type { LoopUIProps } from './types'

const LoopTitleBar: FC<
  Pick<
    LoopUIProps,
    | 'fileName'
    | 'selectAudioFile'
    | 'audioBuffer'
    | 'label'
    | 'onLabelChange'
    | 'duplicate'
    | 'remove'
    | 'connections'
  >
> = ({
  label,
  onLabelChange,
  duplicate,
  remove,
  connections,
  fileName,
  audioBuffer,
  selectAudioFile,
}) => {
  const fileInfo = useMemo(
    () => (
      <>
        {fileName ? <span>{fileName}</span> : null}
        {fileName && audioBuffer ? (
          <span> - {audioBuffer.duration.toFixed(2)}s</span>
        ) : null}
        {fileName ? <span>/</span> : null}
      </>
    ),
    [audioBuffer, fileName],
  )

  const loadButton = useMemo(
    () => (
      <Button handler={selectAudioFile}>
        {`${audioBuffer ? 'Replace' : 'Load'}`} audio file
      </Button>
    ),
    [audioBuffer, selectAudioFile],
  )

  return (
    <TitleBar
      type="Loop"
      label={label}
      onLabelChange={onLabelChange}
      onRemoveClick={remove}
      connections={connections}
    >
      <Title>
        {fileInfo}
        {loadButton}
        {audioBuffer ? <Button handler={duplicate}>Clone</Button> : null}
      </Title>
    </TitleBar>
  )
}

export default memo(LoopTitleBar)

const Title = styled.div`
  display: flex;

  & span {
    margin-right: 0.3em;
  }
`
