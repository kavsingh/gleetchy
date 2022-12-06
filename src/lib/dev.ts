import { noop } from "lodash";

/* eslint-disable no-console */
const isDev = !import.meta.env.PROD;
const cLog = console.log.bind(console);
const cWarn = console.warn.bind(console);
const cError = console.error.bind(console);
/* eslint-enable */

export const log = isDev ? cLog : noop;
export const warn = isDev ? cWarn : noop;
export const error = isDev ? cError : noop;
export const prodLog = cLog;
export const prodWarn = cWarn;
export const prodError = cError;
