import React, { FunctionComponent, useRef, useEffect, memo } from 'react'
import { css } from '@emotion/core'
import colorFn from 'color'
import { map } from 'ramda'

import { requireWindowWith } from '~/util/env'
import theme from '~/style/theme'

const normaliseChannel = map((v: number) => (v + 0.5) * 0.5)

const rootStyle = css({
  height: '100%',
  overflow: 'hidden',
  width: '100%',
})

const canvasStyle = css({
  height: '100%',
  width: '100%',
})

export interface WaveformProps {
  color?: string
  timeRegions?: number
  buffer?: AudioBuffer
}

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

const drawWaveForm = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  buffer: AudioBuffer,
) => {
  const halfHeight = height / 2
  const leftChannel = normaliseChannel(buffer.getChannelData(0))
  const rightChannel =
    buffer.numberOfChannels > 1
      ? normaliseChannel(buffer.getChannelData(1))
      : leftChannel
  const buffStep = buffer.length / width

  for (let i = 0; i < width; i += 1) {
    const index = Math.floor(i * buffStep)
    const leftVal = leftChannel[index] * halfHeight
    const rightVal = rightChannel[index] * halfHeight

    context.fillRect(i, halfHeight - leftVal, 1, leftVal + rightVal)
  }
}

const updateWaveForm = (
  canvasNode: HTMLCanvasElement,
  {
    color = theme.colorEmphasis,
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
  context.strokeStyle = colorFn(theme.colorKeyline)
    .darken(0.06)
    .hex()

  if (buffer) {
    drawTimeRegions(context, width, height, timeRegions)
    drawWaveForm(context, width, height, buffer)
  } else {
    drawTempWaveform(context, width, height)
  }
}

const WaveForm: FunctionComponent<WaveformProps> = ({
  color,
  timeRegions,
  buffer,
}) => {
  const canvasNodeRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const WINDOW = requireWindowWith()

    if (!WINDOW) return

    const handleResize = () => {
      if (canvasNodeRef.current) {
        updateWaveForm(canvasNodeRef.current, {
          color,
          timeRegions,
          buffer,
          pixelRatio: WINDOW.devicePixelRatio || 1,
        })
      }
    }

    handleResize()
    WINDOW.addEventListener('resize', handleResize)

    return () => WINDOW.removeEventListener('resize', handleResize)
  }, [color, timeRegions, buffer])

  return (
    <div css={rootStyle}>
      <canvas css={canvasStyle} ref={canvasNodeRef} />
    </div>
  )
}

export default memo(WaveForm)
