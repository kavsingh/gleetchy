export const loadAudioFiles = () => {
  let input = document.createElement('input')

  input.setAttribute('type', 'file')
  input.setAttribute('accept', '.wav, .mp3, .ogg, .aiff, .m4a')

  return new Promise(resolve => {
    input.onchange = () => {
      const { files } = input

      resolve([...files].filter(({ type }) => type.startsWith('audio/')))
      input = null
    }

    input.click()
  })
}

export const readFileToArrayBuffer = file => {
  let fileReader = new FileReader()

  return new Promise((resolve, reject) => {
    fileReader.onerror = error => {
      reject(error)
      fileReader = null
    }

    fileReader.onloadend = () => {
      resolve({
        name: file.name,
        type: file.type,
        buffer: fileReader.result,
      })

      fileReader = null
    }

    fileReader.readAsArrayBuffer(file)
  })
}

export const readFilesToArrayBuffer = files =>
  Promise.all(files.map(readFileToArrayBuffer))

export const loadAudioFilesToArrayBuffers = () =>
  loadAudioFiles().then(readFilesToArrayBuffer)
