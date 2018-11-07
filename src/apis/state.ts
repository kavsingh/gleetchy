export const sendJsonString = (json: string) => prompt('copy and keep', json)

export const consumeJsonString = () =>
  new Promise<string>((resolve, reject) => {
    const json = prompt('Paste state json', '')

    if (json) {
      resolve(json)
    } else {
      reject(new Error('No state provided'))
    }
  })
