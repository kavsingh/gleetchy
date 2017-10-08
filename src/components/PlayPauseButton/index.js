import React from 'react'
import PropTypes from 'prop-types'

const PlayPauseButton = ({ isPlaying, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    className="playPauseButton"
    onKeyDown={({ key }) => {
      if (key === 'Enter') onClick()
    }}
  >
    {isPlaying ? 'Stop' : 'Play'}
    <style jsx>{`
      .playPauseButton {
        cursor: pointer;
      }
    `}</style>
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
