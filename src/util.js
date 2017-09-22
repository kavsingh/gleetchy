import { curry } from 'ramda'

/* eslint-disable */
export const log = console.log.bind(console)

export const inspect = (instance, groupName, predicate = () => true) => {
  const name = groupName || `${typeof instance} instance`

  console.groupCollapsed(name)

  for (let key in instance) {
    if (predicate(key)) {
      console.log(`${key} :: ${typeof instance[key]} :: ${instance[key]}`)
    }
  }

  console.groupEnd(name)
}
/* eslint-enable */

export const once = fn => {
  let returnVal
  let hasCalled = false

  return (...args) => {
    if (!hasCalled) {
      hasCalled = true
      returnVal = fn(...args)
    }

    return returnVal
  }
}

export const loadSample = url =>
  fetch(url).then(response => response.arrayBuffer())

export const decodeAudioDataP = (audioContext, buffer) =>
  new Promise((resolve, reject) =>
    audioContext.decodeAudioData(buffer, resolve, reject))

export const loadAudioToBuffer = curry(async (audioContext, url) => {
  const buffer = await loadSample(url)
  return decodeAudioDataP(audioContext, buffer)
})

export const docReady = (eventName = 'complete') =>
  new Promise(resolve => {
    document.onreadystatechange = () => {
      if (document.readyState === eventName) resolve()
    }
  })
