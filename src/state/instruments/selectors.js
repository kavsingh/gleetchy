import { identity, propEq } from 'ramda'
import { createSelector } from 'reselect'
import { audioFilesSelector } from '../audioFiles/selectors'
import { INS_LOOP } from '../../constants/nodeTypes'

const instrumentsStateSelector = state => state.instruments

export const instrumentsSelector = createSelector(
  instrumentsStateSelector,
  identity,
)

export const loopsSelector = createSelector(
  instrumentsSelector,
  audioFilesSelector,
  (instruments, files) =>
    instruments.filter(propEq('type', INS_LOOP)).map(ins => ({
      ...ins,
      props: { ...ins.props, ...(files[ins.id] || {}) },
    })),
)
