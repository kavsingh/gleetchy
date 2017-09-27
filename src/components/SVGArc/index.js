import React from 'react'
import PropTypes from 'prop-types'
import { map, clamp } from 'ramda'
import { polarToCartesian } from '../../util/math'

const describeSVGArc = (origin, radius, startAngle, endAngle) => {
  const [sa, ea] = map(clamp(0, 359.9), [startAngle, endAngle])
  const toPoint = polarToCartesian(origin, radius)

  const { x: startX, y: startY } = toPoint(ea - 90)
  const { x: endX, y: endY } = toPoint(sa - 90)
  const arcSweep = endAngle - startAngle <= 180 ? 0 : 1

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${arcSweep} 0 ${endX} ${endY}`
}

const SVGArc = ({ startAngle, endAngle, radius, strokeWidth }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`0 0 ${radius * 2} ${radius * 2}`}
  >
    <defs>
      <clipPath id="stroke-mask">
        <circle cx={radius} cy={radius} r={radius} />
      </clipPath>
    </defs>
    <path
      id="stroke"
      d={describeSVGArc({ x: radius, y: radius }, radius, startAngle, endAngle)}
      clipPath="url(#stroke-mask)"
      vectorEffect="non-scaling-stroke"
      strokeWidth={strokeWidth * 2}
    />
  </svg>
)

SVGArc.propTypes = {
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  radius: PropTypes.number,
  strokeWidth: PropTypes.number,
}

SVGArc.defaultProps = {
  startAngle: 0,
  endAngle: 360,
  radius: 1,
  strokeWidth: 1,
}

export default SVGArc

// export const renderSVGArc = (renderProps = {}) => {
//   const {
//     className = '',
//     startAngle = 0,
//     endAngle = 180,
//     radius = 1,
//     strokeWidth = 1,
//   } = renderProps

//   const origin = renderProps.origin || { x: radius, y: radius }

//   return html`
//     <svg xmlns="http://www.w3.org/2000/svg"
//       class="${className}"
//       viewBox="0 0 ${radius * 2} ${radius * 2}"
//     >
//       <defs>
//         ${/*
//           Strokes are drawn centered on the outline, and
//           are therefore displayed clipped by the view box. This clip path
//           is used to ensure a consistent round edge.
//         */ ''}
//         <clipPath id="stroke-mask">
//         <circle cx="${radius}" cy="${radius}" r="${radius}" />
//       </clipPath>
//     </defs>
//     <path
//       id="stroke"
//       d="${describeSVGArc(origin, radius, startAngle, endAngle)}"
//       clip-path="url(#stroke-mask)"
//       ${/*
//         Try not to scale the stroke if possible, to ensure consistent
//         line width. Draw double the line width since the half the stroke
//         will be taken out by the clip path above.
//       */ ''}
//       ${Modernizr.testProp('vectorEffect')
//         ? oneLine`
//           vector-effect="non-scaling-stroke"
//           stroke-width="${strokeWidth * 2}"
//         `
//         : // TODO: Proper stroke width estimation
//           `stroke-width="${strokeWidth * 0.1}"`}
//     />
//   </svg>
// `
// }
