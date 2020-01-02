import { slug } from 'cuid'

export const prefixedId = (prefix: string) => `${prefix}-${slug()}`
