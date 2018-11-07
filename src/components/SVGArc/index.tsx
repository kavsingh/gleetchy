import React, { memo, StatelessComponent } from 'react'

import { describeSVGArc } from '~/util/ui'

export interface SVGArcProps {
  endAngle: number
  radius?: number
  startAngle?: number
  strokeWidth?: number
}

const SVGArc: StatelessComponent<SVGArcProps> = ({
  endAngle,
  startAngle = 0,
  radius = 1,
  strokeWidth = 1,
}) => (
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

export default memo<SVGArcProps>(SVGArc)
