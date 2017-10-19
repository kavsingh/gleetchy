import PropTypes from 'prop-types'

export const connection = PropTypes.shape({
  from: PropTypes.string,
  to: PropTypes.string,
  color: PropTypes.string,
})

export const nodeOrFunction = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
])
