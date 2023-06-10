/* eslint-disable no-console */

const logError = console.error.bind(console);
let logInfo: typeof console.log = () => undefined;
let logWarn: typeof console.warn = () => undefined;
let logTime: typeof console.time = () => undefined;
let logTimeLog: typeof console.timeLog = () => undefined;
let logTimeEnd: typeof console.timeEnd = () => undefined;
let logTimeStamp: typeof console.timeStamp = () => undefined;

if (import.meta.env.DEV) {
	logInfo = console.log.bind(console);
	logWarn = console.warn.bind(console);
	logTime = console.time.bind(console);
	logTimeLog = console.timeLog.bind(console);
	logTimeEnd = console.timeEnd.bind(console);
	logTimeStamp = console.timeStamp.bind(console);
}

export {
	logError,
	logInfo,
	logWarn,
	logTime,
	logTimeLog,
	logTimeEnd,
	logTimeStamp,
};
