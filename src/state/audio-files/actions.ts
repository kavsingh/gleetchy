import { createAsyncThunk } from '@reduxjs/toolkit'
import { head, pick } from 'ramda'

import {
  readFileToArrayBuffer,
  loadAudioFilesToArrayBuffers,
} from '~/apis/file'
import { getAudioContext } from '~/apis/audio'

import type { AudioFileData, DecodedAudioFileData } from '~/types'

export const selectAudioFile = createAsyncThunk(
  'audioFiles/select',
  async ({ id }: { id: string }, { dispatch }) => {
    try {
      const file = head(await loadAudioFilesToArrayBuffers())

      if (!file) throw new Error('No file loaded')
      const result = { id, file }

      void dispatch(decodeAudioFile(result))

      return result
    } catch (e) {
      throw errorFrom(e)
    }
  },
)

export const receiveAudioFile = createAsyncThunk(
  'audioFiles/receive',
  async ({ id, file }: { id: string; file: File }, { dispatch }) => {
    try {
      const fileData = await readFileToArrayBuffer(file)
      const result = { id, file: fileData }

      void dispatch(decodeAudioFile(result))

      return result
    } catch (e) {
      throw errorFrom(e)
    }
  },
)

export const decodeAudioFile = createAsyncThunk(
  'audioFiles/decode',
  async ({
    id,
    file,
  }: {
    id: string
    file: AudioFileData
  }): Promise<{ id: string; file: DecodedAudioFileData }> => {
    try {
      const audioBuffer = await getAudioContext().decodeAudioData(file.buffer)

      return {
        id,
        file: { ...pick(['fileName', 'fileType'], file), audioBuffer },
      }
    } catch (e) {
      throw errorFrom(e)
    }
  },
)

const errorFrom = (value: unknown) =>
  value instanceof Error ? value : new Error(String(value))
