import createAudioNode from "./create-audio-node";
import UI from "./eq3";
import { defaultProps } from "./node-props";
import nodeType from "./node-type";

import type { Props } from "./node-props";

export type NodeProps = Props;
export { UI, nodeType, defaultProps, createAudioNode };
