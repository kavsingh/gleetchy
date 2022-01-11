import { useRef, useEffect, memo } from 'react'
import styled from '@emotion/styled'
import colorFn from 'color'
import { range } from 'ramda'

import { requireWindowWith } from '~/lib/env'

import type { FCWithoutChildren } from '~/types'

const drawTempWaveform = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  context.fillRect(0, height / 2, width, 1)
}

const drawTimeRegions = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  timeRegions: number,
) => {
  for (let i = 0; i < timeRegions; i += 1) {
    const x = Math.round(i * 0.25 * width)

    context.moveTo(x, 0)
    context.lineTo(x, height)
  }

  context.stroke()
}

const drawWaveform = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  buffer: AudioBuffer,
) => {
  const buffStep = buffer.length / width
  const channels = range(0, buffer.numberOfChannels).map((channel) =>
    buffer.getChannelData(channel),
  )
  const channelHeight = height / channels.length
  const mids = channels.map((_, i) => (i + 0.5) * channelHeight)
  const valueMult = channelHeight / 2

  for (let x = 0; x < width; x++) {
    const sampleIndex = Math.floor(x * buffStep)

    for (let c = 0; c < channels.length; c++) {
      const val = (channels[c]?.[sampleIndex] ?? 0) * valueMult
      const mid = mids[c] ?? 0

      context.fillRect(x, mid - val, 1, val * 2)
    }
  }
}

const updateWaveform = (
  canvasNode: HTMLCanvasElement,
  {
    color,
    baselineColor,
    pixelRatio = 1,
    timeRegions = 4,
    buffer,
  }: WaveformProps & { pixelRatio: number },
) => {
  const context = canvasNode.getContext('2d')

  if (!context) return

  const width = canvasNode.offsetWidth
  const height = canvasNode.offsetHeight

  canvasNode.width = width * pixelRatio
  canvasNode.height = height * pixelRatio

  context.scale(pixelRatio, pixelRatio)
  context.clearRect(0, 0, width, height)
  context.fillStyle = color
  context.strokeStyle = colorFn(baselineColor).darken(0.06).hex()

  if (buffer) {
    drawTimeRegions(context, width, height, timeRegions)
    drawWaveform(context, width, height, buffer)
  } else {
    drawTempWaveform(context, width, height)
  }
}

const Waveform: FCWithoutChildren<WaveformProps> = ({
  color,
  baselineColor,
  timeRegions,
  buffer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const WINDOW = requireWindowWith()

    if (!WINDOW) return

    const handleResize = () => {
      if (canvasRef.current) {
        updateWaveform(canvasRef.current, {
          color,
          baselineColor,
          timeRegions,
          buffer,
          pixelRatio: WINDOW.devicePixelRatio || 1,
        })
      }
    }

    handleResize()
    WINDOW.addEventListener('resize', handleResize)

    return () => WINDOW.removeEventListener('resize', handleResize)
  }, [color, baselineColor, timeRegions, buffer])

  return (
    <Container>
      <Canvas ref={canvasRef} />
    </Container>
  )
}

export default memo(Waveform)

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

export interface WaveformProps {
  color: string
  baselineColor: string
  buffer: Nullable<AudioBuffer>
  timeRegions?: number
}
