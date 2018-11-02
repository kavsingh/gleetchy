import { hasWindow } from '~/util/env'

let fileInput: HTMLInputElement

const getFileInput = () => {
  if (!hasWindow()) {
    return undefined
  }

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

export interface DecodedAudioFileData {
  buffer: ArrayBuffer | string | null
  fileName: string
  fileType: string
}

export const readFileToArrayBuffer = (file: File) => {
  let fileReader: FileReader | null = new FileReader()

  return new Promise<DecodedAudioFileData>((resolve, reject) => {
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
