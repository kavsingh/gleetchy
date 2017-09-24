import Inferno from 'inferno'
import Component from 'inferno-component'
import classNames from './Slider.css'

class Slider extends Component {
  constructor(...args) {
    super(...args)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  handleMouseDown() {
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseMove(event) {
    const vert = this.props.orient === 'vertical'
    const movement = vert ? event.movementY : event.movementX
    const dim = vert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    this.props.onSlide(movement / -dim)
  }

  handleMouseUp() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
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
