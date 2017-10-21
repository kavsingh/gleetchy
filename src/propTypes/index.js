import PropTypes from 'prop-types'

export const nodeOrFunction = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
])

export const audioNodeLight = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
})

export const connection = PropTypes.shape({
  from: audioNodeLight,
  to: audioNodeLight,
  color: PropTypes.string,
})
