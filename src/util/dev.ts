/* tslint:disable no-console */
import { noop } from './function'

const isDev = process.env.NODE_ENV !== 'production'
const cLog = console.log.bind(console)
const cWarn = console.warn.bind(console)
const cError = console.warn.bind(console)

export const log = isDev ? cLog : noop
export const warn = isDev ? cWarn : noop
export const error = isDev ? cError : noop
export const prodLog = cLog
export const prodWarn = cWarn
export const prodError = cError
