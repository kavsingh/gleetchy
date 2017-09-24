import Inferno from 'inferno'
import Component from 'inferno-component'
import { clamp } from 'ramda'
import classNames from './Slider.css'

class Slider extends Component {
  constructor(...args) {
    super(...args)

    this.state = { isDragging: false }

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleMouseDown() {
    this.setState({ isDragging: true })

    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseMove(event) {
    const { orient, value } = this.props
    const vert = orient === 'vertical'
    const movement = vert ? event.movementY : event.movementX
    const dim = vert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    this.props.onChange(clamp(0, 1, movement / -dim + value))
  }

  handleMouseUp() {
    this.setState({ isDragging: false })

    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleClick(event) {
    if (this.state.isDragging) return

    const { orient } = this.props
    const vert = orient === 'vertical'
    const offset = vert ? event.offsetY : event.offsetX
    const dim = vert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    this.props.onChange(clamp(0, 1, 1 - offset / dim))
  }

  componentWillUnmount() {
    this.handleMouseUp()
  }

  render() {
    const { orient, value, renderLabel, renderValue } = this.props
    const isVert = orient === 'vertical'
    const offVal = `${(1 - value) * 100}%`

    return (
      <div
        className={isVert ? classNames.rootVertical : classNames.rootHorizontal}
      >
        <div className={classNames.label}>{renderLabel()}</div>
        <div
          className={classNames.barContainer}
          onMouseDown={this.handleMouseDown}
          onClick={this.handleClick}
          ref={c => {
            this.barContainer = c
          }}
        >
          <div className={classNames.track} />
          <div
            className={classNames.bar}
            style={isVert ? { top: offVal } : { right: offVal }}
          />
        </div>
        <div className={classNames.value}>{renderValue()}</div>
      </div>
    )
  }
}

Slider.defaultProps = {
  orient: 'vertical',
  onSlide: () => {},
}

export default Slider
