import { curry } from 'ramda'

export interface Point {
  x: number
  y: number
}

const degreesToRadians = (angle: number) => (Math.PI / 180) * angle

export const polarToCartesian = curry(
  (origin: Point, radius: number, angle: number): Point => ({
    x: radius * Math.cos(degreesToRadians(angle)) + (origin.x || 0),
    y: radius * Math.sin(degreesToRadians(angle)) + (origin.y || 0),
  }),
)
