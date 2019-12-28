import React, { FunctionComponent, useMemo, memo } from 'react'
import styled from '@emotion/styled'

import TitleBar from '~/components/TitleBar'
import Button from '~/components/Button'

import { LoopProps } from './types'

const LoopTitleBar: FunctionComponent<Pick<
  LoopProps,
  | 'fileName'
  | 'selectAudioFile'
  | 'audioBuffer'
  | 'label'
  | 'onLabelChange'
  | 'remove'
  | 'connections'
>> = ({
  label,
  onLabelChange,
  remove,
  connections,
  fileName,
  audioBuffer,
  selectAudioFile,
}) => {
  const title = useMemo(
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

  return (
    <TitleBar
      type="Loop"
      label={label}
      onLabelChange={onLabelChange}
      onRemoveClick={remove}
      connections={connections}
    >
      <Title>
        {title}
        <Button handler={selectAudioFile} label="Load audio file" />
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
