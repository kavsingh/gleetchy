/* eslint-disable no-alert, no-prompt */

export const sendJsonString = json => prompt('copy and keep', json)

export const consumeJsonString = () =>
  new Promise((resolve, reject) => {
    const json = prompt('Paste state json', '')

    if (json) resolve(json)
    else reject(new Error('No state provided'))
  })
