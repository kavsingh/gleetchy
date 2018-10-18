import { curry } from 'ramda'

export const degreesToRadians = angle => (Math.PI / 180) * angle

export const polarToCartesian = curry((origin, radius, angle) => ({
  x: radius * Math.cos(degreesToRadians(angle)) + (origin.x || 0),
  y: radius * Math.sin(degreesToRadians(angle)) + (origin.y || 0),
}))
