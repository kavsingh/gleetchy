import React, { FunctionComponent, useMemo, memo } from 'react'
import styled from '@emotion/styled'

import TitleBar from '~/components/TitleBar'
import Button from '~/components/Button'

import { LoopUIProps } from './types'

const LoopTitleBar: FunctionComponent<Pick<
  LoopUIProps,
  | 'fileName'
  | 'selectAudioFile'
  | 'audioBuffer'
  | 'label'
  | 'onLabelChange'
  | 'duplicate'
  | 'remove'
  | 'connections'
>> = ({
  label,
  onLabelChange,
  duplicate,
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

  const loadButton = useMemo(
    () => (
      <Button
        handler={selectAudioFile}
        label={`${audioBuffer ? 'Replace' : 'Load'} audio file`}
      />
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
        {title}
        {loadButton}
        <Button handler={duplicate} label="Copy" />
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
