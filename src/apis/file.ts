import { requireWindowWith } from '~/lib/env'
import type { AudioFileData } from '~/types'

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

    input.onerror = (error) => {
      reject(error)

      input.value = ''
    }

    input.click()
  })
}

export const readFileToArrayBuffer = (file: File): Promise<AudioFileData> =>
  file
    .arrayBuffer()
    .then((buffer) => ({ buffer, fileName: file.name, fileType: file.type }))

export const readFilesToArrayBuffer = (files: File[]) =>
  Promise.all(files.map(readFileToArrayBuffer))

export const loadAudioFilesToArrayBuffers = () =>
  loadAudioFiles().then(readFilesToArrayBuffer)
