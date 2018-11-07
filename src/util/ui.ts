import { clamp, map } from 'ramda'

import { Point, polarToCartesian } from './math'

export const describeSVGArc = (
  origin: Point,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const toPoint = polarToCartesian(origin, radius)
  const [sa, ea] = map(clamp(0, 359.9), [startAngle, endAngle])
  const { x: startX, y: startY } = toPoint(ea - 90)
  const { x: endX, y: endY } = toPoint(sa - 90)
  const arcSweep = endAngle - startAngle <= 180 ? 0 : 1

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${arcSweep} 0 ${endX} ${endY}`
}
