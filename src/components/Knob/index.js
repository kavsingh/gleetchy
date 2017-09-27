import React from 'react'
import PropTypes from 'prop-types'
import SVGArc from '../SVGArc'

const Knob = ({ value, radius }) => (
  <div className="root">
    <div className="trackContainer">
      <SVGArc radius={radius} startAngle={0} endAngle={360} strokeWidth={1} />
    </div>
    <div className="barContainer">
      <SVGArc
        radius={1}
        startAngle={0}
        endAngle={value * 360}
        strokeWidth={2}
      />
    </div>
    <style jsx>{`
      .root {
        cursor: ew-resize;
        position: relative;
        width: 100%;
        height: 100%;
      }

      .root :global(svg) {
        width: 100%;
        height: 100%;
        fill: transparent;
      }

      .trackContainer,
      .barContainer {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      .trackContainer {
        z-index: 1;
      }

      .trackContainer :global(svg) {
        stroke: rgba(0, 0, 0, 0.1);
      }

      .trackContainer {
        z-index: 2;
      }

      .barContainer :global(svg) {
        stroke: #000;
      }
    `}</style>
  </div>
)

Knob.propTypes = {
  value: PropTypes.number,
  radius: PropTypes.number,
}

Knob.defaultProps = {
  value: 0.5,
  radius: 1,
}

export default Knob
