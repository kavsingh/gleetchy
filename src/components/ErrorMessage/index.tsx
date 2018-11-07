import React, { memo, StatelessComponent } from 'react'

import { COLOR_EMPHASIS, COLOR_ERROR } from '~/constants/style'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('errorMessage', {
  root: {
    backgroundColor: COLOR_ERROR,
    color: COLOR_EMPHASIS,
    fontSize: '0.9em',
    padding: '2em',
    width: '100%',
  },
})

const ErrorMessage: StatelessComponent<{}> = ({ children }) => (
  <div className={classes.root}>{children}</div>
)

export default memo(ErrorMessage)
