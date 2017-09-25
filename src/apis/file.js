let fileInput

const getFileInput = () => {
  if (typeof window === 'undefined') return undefined

  if (!fileInput) {
    fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.setAttribute('accept', '.wav, .mp3, .ogg')
    document.body.appendChild(fileInput)
    fileInput.style.display = 'none'
  }

  return fileInput
}

export const loadAudioFiles = () => {
  const input = getFileInput()

  return new Promise((resolve, reject) => {
    input.onchange = () => {
      const { files } = input

      resolve([...files].filter(({ type }) => type.startsWith('audio/')))
      input.value = null
    }

    input.onerror = error => {
      reject(error)
      input.value = null
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
