import PropTypes from 'prop-types'
import { getWindow } from '../util/env'

const WINDOW = getWindow()

const audioNodeLight = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
})

export default {
  ...PropTypes,

  audioNodeLight,

  audioBuffer: WINDOW
    ? PropTypes.instanceOf(WINDOW.AudioBuffer)
    : PropTypes.any,

  nodeOrFunction: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  connection: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
    color: PropTypes.string,
  }),

  connectionExpanded: PropTypes.shape({
    from: audioNodeLight,
    to: audioNodeLight,
    color: PropTypes.string,
  }),
}
