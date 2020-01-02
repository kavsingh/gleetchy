export const defaultProps = Object.freeze({
  highGain: 0,
  lowGain: 0,
  midGain: 0,
})

export type Props = Mutable<typeof defaultProps>
