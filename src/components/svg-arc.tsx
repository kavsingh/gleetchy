import { memo } from 'react'

import type { FCWithoutChildren } from '~/types'

// Adapted from https://codepen.io/JMChristensen/pen/Ablch
const SVGArc: FCWithoutChildren<{
  endRatio: number
  strokeColor: string
  strokeWidth?: number
  backgroundStrokeColor?: string
  backgroundStrokeWidth?: number
}> = ({
  endRatio,
  strokeColor,
  strokeWidth = 4,
  backgroundStrokeColor = 'transparent',
  backgroundStrokeWidth = 1,
}) => {
  const radius = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        strokeWidth={backgroundStrokeWidth}
        stroke={backgroundStrokeColor}
      />
      <circle
        transform="rotate(-90, 50, 50)"
        cx="50"
        cy="50"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={(1 - endRatio) * circumference}
        fill="transparent"
        strokeWidth={strokeWidth}
        stroke={strokeColor}
      />
    </svg>
  )
}

export default memo(SVGArc)
