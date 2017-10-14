import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals, head } from 'ramda'
import GithubIcon from 'react-icons/lib/go/mark-github'
import {
  playbackToggle,
  nodeUpdateProps,
  connectionToggle,
} from '../../state/gleetchy/actions'
import {
  delaySelector,
  reverbSelector,
  isPlayingSelector,
  connectionsSelector,
  activeFXSelector,
} from '../../state/gleetchy/selectors'
import Panel from '../../components/Panel'
import PlayPauseButton from '../../components/PlayPauseButton'
import Delay from '../../components/Delay'
import Reverb from '../../components/Reverb'
import ErrorBoundary from '../../components/ErrorBoundary'
import PatchBay from '../../components/PatchBay'
import Instruments from '../Instruments'

const checkActiveNode = (from, to, connections) => {
  const [fromId, toId] = [from, to].map(({ id }) => id)

  return !!connections.find(equals([fromId, toId]))
}

const GleetchyUI = ({
  loopers,
  delay,
  reverb,
  isPlaying,
  activeFx,
  connections,
  togglePlayback,
  updateDelay,
  updateReverb,
  toggleConnection,
}) => (
  <div className="gleetchy">
    <Panel>
      <div className="gleetchy__masthead">
        <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayback} />
        <a
          href="https://www.github.com/kavsingh/gleetchy"
          target="_blank"
          rel="noopener noreferrer"
          title="view on github"
        >
          <GithubIcon />
        </a>
      </div>
    </Panel>
    <Panel>
      <Instruments />
    </Panel>
    <Panel
      style={{
        marginTop: '2em',
        borderTop: '1px solid #fee',
        padding: 0,
      }}
    >
      <ErrorBoundary silent>
        <Panel style={{ flexGrow: 1, flexShrink: 0 }}>
          <Delay
            isActive={activeFx.includes('delay')}
            wetDryRatio={delay.props.wetDryRatio}
            delayTime={delay.props.delayTime}
            onDelayTimeChange={delayTime => updateDelay({ delayTime })}
            onWetDryRatioChange={wetDryRatio => updateDelay({ wetDryRatio })}
          />
          <Reverb
            isActive={activeFx.includes('reverb')}
            wetDryRatio={reverb.props.wetDryRatio}
            onWetDryRatioChange={wetDryRatio => updateReverb({ wetDryRatio })}
          />
        </Panel>
        <Panel style={{ flexGrow: 0, flexShrink: 0 }}>
          <PatchBay
            fromNodes={[
              ...loopers.map(({ id, label }) => ({
                id,
                label: label
                  .split(' ')
                  .map(head)
                  .join(''),
                title: `${label} out`,
              })),
              { id: 'delay', label: 'D', title: 'Delay out' },
              { id: 'reverb', label: 'R', title: 'Reverb out' },
            ]}
            toNodes={[
              { id: 'reverb', label: 'R', title: 'Reverb in' },
              { id: 'delay', label: 'D', title: 'Delay in' },
              { id: 'mainOut', label: 'M', title: 'Main out' },
            ]}
            onNodeClick={(from, to) => toggleConnection(from.id, to.id)}
            checkActiveNode={(from, to) =>
              checkActiveNode(from, to, connections)}
          />
        </Panel>
      </ErrorBoundary>
    </Panel>
    <style jsx>{`
      .gleetchy {
        max-width: 92em;
        margin: 0 auto;
        padding: 0 2em;
        color: #555;
      }

      .gleetchy__masthead {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .gleetchy__masthead a {
        transition: opacity 0.2s ease-out, color 0.2s ease-out;
        color: #555;
        opacity: 0.4;
      }

      .gleetchy__masthead a:hover {
        color: #333;
        opacity: 1;
      }
    `}</style>
  </div>
)

GleetchyUI.propTypes = {
  delay: PropTypes.shape({}),
  reverb: PropTypes.shape({}),
  loopers: PropTypes.arrayOf(PropTypes.shape({})),
  isPlaying: PropTypes.bool,
  connections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  activeFx: PropTypes.arrayOf(PropTypes.string),
  togglePlayback: PropTypes.func,
  updateDelay: PropTypes.func,
  updateReverb: PropTypes.func,
  toggleConnection: PropTypes.func,
}

GleetchyUI.defaultProps = {
  delay: {},
  reverb: {},
  loopers: [],
  isPlaying: false,
  connections: [],
  activeFx: [],
  togglePlayback: () => {},
  updateDelay: () => {},
  updateReverb: () => {},
  toggleConnection: () => {},
}

export default connect(
  state => ({
    isPlaying: isPlayingSelector(state),
    delay: delaySelector(state),
    reverb: reverbSelector(state),
    connections: connectionsSelector(state),
    activeFx: activeFXSelector(state),
  }),
  dispatch => ({
    togglePlayback: () => dispatch(playbackToggle()),
    updateDelay: props => dispatch(nodeUpdateProps('delay', props)),
    updateReverb: props => dispatch(nodeUpdateProps('reverb', props)),
    toggleConnection: (fromId, toId) =>
      dispatch(connectionToggle(fromId, toId)),
  }),
)(GleetchyUI)
