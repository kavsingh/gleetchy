import { AudioFileData } from '~/types'
import { requireWindowWith } from '~/util/env'

let fileInput: HTMLInputElement

const getFileInput = () => {
  const WINDOW = requireWindowWith(['document.createElement'])

  if (!WINDOW) {
    return undefined
  }

  if (!fileInput) {
    fileInput = WINDOW.document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.setAttribute('accept', '.wav, .mp3, .ogg')
    WINDOW.document.body.appendChild(fileInput)
    fileInput.style.display = 'none'
  }

  return fileInput
}

export const loadAudioFiles = () => {
  const input = getFileInput()

  if (!input) {
    return Promise.reject(new Error('Cannot load files'))
  }

  return new Promise<File[]>((resolve, reject) => {
    input.onchange = () => {
      const { files } = input

      resolve(
        Array.from(files || []).filter(({ type }) => type.startsWith('audio/')),
      )

      input.value = ''
    }

    input.onerror = error => {
      reject(error)

      input.value = ''
    }

    input.click()
  })
}

export const readFileToArrayBuffer = (file: File) => {
  let fileReader: FileReader | null = new FileReader()

  return new Promise<AudioFileData>((resolve, reject) => {
    if (!fileReader) {
      reject(new Error('Could not create FileReader'))
      return
    }

    fileReader.onerror = error => {
      reject(error)
      fileReader = null
    }

    fileReader.onloadend = () => {
      if (!fileReader) {
        reject(new Error('FileReader instance disposed'))
        return
      }

      if (!(fileReader.result instanceof ArrayBuffer)) {
        reject(new Error('Error reading file to ArrayBuffer'))
        fileReader = null
        return
      }

      resolve({
        buffer: fileReader.result,
        fileName: file.name,
        fileType: file.type,
      })

      fileReader = null
    }

    fileReader.readAsArrayBuffer(file)
  })
}

export const readFilesToArrayBuffer = (files: File[]) =>
  Promise.all(files.map(readFileToArrayBuffer))

export const loadAudioFilesToArrayBuffers = () =>
  loadAudioFiles().then(readFilesToArrayBuffer)
