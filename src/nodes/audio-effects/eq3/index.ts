import createAudioNode from './create-audio-node'
import { defaultProps } from './node-props'
import nodeType from './node-type'
import UI from './eq3'

import type { Props } from './node-props'

export type NodeProps = Props
export { UI, nodeType, defaultProps, createAudioNode }
