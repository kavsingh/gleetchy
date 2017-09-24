import Inferno from 'inferno'
import classNames from './PlayPauseButton.css'

const PlayPauseButton = ({ isPlaying = false, onClick = () => {} }) => (
  <div onClick={onClick} className={classNames.root}>
    {isPlaying ? 'Stop' : 'Play'}
  </div>
)

export default PlayPauseButton
