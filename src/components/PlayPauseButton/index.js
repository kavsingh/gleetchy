import React from 'react'
import PropTypes from 'prop-types'
import classNames from './PlayPauseButton.css'

const PlayPauseButton = ({ isPlaying, onClick }) => (
  <div role="button" tabIndex={0} onClick={onClick} className={classNames.root}>
    {isPlaying ? 'Stop' : 'Play'}
  </div>
)

PlayPauseButton.propTypes = {
  isPlaying: PropTypes.bool,
  onClick: PropTypes.func,
}

PlayPauseButton.defaultProps = {
  isPlaying: false,
  onClick: () => {},
}

export default PlayPauseButton
