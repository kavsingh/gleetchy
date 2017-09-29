/* eslint-disable no-console */
export const log = console.log.bind(console)

export const warn = console.warn.bind(console)
/* eslint-enable */

export const cancelEvent = event => {
  event.preventDefault()
  event.stopPropagation()
  return false
}

export const docReady = (eventName = 'complete') =>
  new Promise(resolve => {
    document.onreadystatechange = () => {
      if (document.readyState === eventName) resolve()
    }
  })
