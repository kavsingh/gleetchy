import React, { FunctionComponent, memo } from 'react'
import { css } from '@emotion/core'

import Button from '../Button'

const addNodeButtonsContainerStyle = css({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '5em',
  padding: '1em 0',
  width: '100%',
  fontSize: '0.8em',
})

const AddNodeButtons: FunctionComponent<{
  buttons: [string, () => unknown][]
}> = ({ buttons }) => (
  <div css={addNodeButtonsContainerStyle}>
    {buttons.map(([name, handler]) => (
      <Button handler={handler} label={`Add ${name}`} key={name} />
    ))}
  </div>
)

export default memo(AddNodeButtons)
