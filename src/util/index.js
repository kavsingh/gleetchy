/* eslint-disable no-console */
export const log = console.log.bind(console)

export const warn = console.warn.bind(console)

export const inspect = (instance, groupName, predicate = () => true) => {
  const name = groupName || `${typeof instance} instance`

  console.groupCollapsed(name)

  /* eslint-disable no-restricted-syntax */
  for (const key in instance) {
    if (predicate(key)) {
      console.log(`${key} :: ${typeof instance[key]} :: ${instance[key]}`)
    }
  }
  /* eslint-enable no-restricted-syntax */

  console.groupEnd(name)
}
/* eslint-enable */

export const docReady = (eventName = 'complete') =>
  new Promise(resolve => {
    document.onreadystatechange = () => {
      if (document.readyState === eventName) resolve()
    }
  })
