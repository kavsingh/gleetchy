export interface NodeProps {
  delayTime: number
  wetDryRatio: number
}

const props: NodeProps = {
  delayTime: 0.6,
  wetDryRatio: 0.5,
}

export default Object.freeze(props)
