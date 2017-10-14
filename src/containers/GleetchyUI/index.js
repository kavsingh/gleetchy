import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals, head } from 'ramda'
import GithubIcon from 'react-icons/lib/go/mark-github'
import { playbackToggle, connectionToggle } from '../../state/gleetchy/actions'
import {
  isPlayingSelector,
  connectionsSelector,
} from '../../state/gleetchy/selectors'
import Panel from '../../components/Panel'
import PlayPauseButton from '../../components/PlayPauseButton'
import PatchBay from '../../components/PatchBay'
import Instruments from '../Instruments'
import FX from '../FX'

const checkActiveNode = (from, to, connections) => {
  const [fromId, toId] = [from, to].map(({ id }) => id)

  return !!connections.find(equals([fromId, toId]))
}

const GleetchyUI = ({
  loopers,
  isPlaying,
  connections,
  togglePlayback,
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
      <Panel style={{ flexGrow: 1, flexShrink: 0 }}>
        <FX />
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
          checkActiveNode={(from, to) => checkActiveNode(from, to, connections)}
        />
      </Panel>
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
  loopers: PropTypes.arrayOf(PropTypes.shape({})),
  isPlaying: PropTypes.bool,
  connections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  togglePlayback: PropTypes.func,
  toggleConnection: PropTypes.func,
}

GleetchyUI.defaultProps = {
  loopers: [],
  isPlaying: false,
  connections: [],
  togglePlayback: () => {},
  toggleConnection: () => {},
}

export default connect(
  state => ({
    isPlaying: isPlayingSelector(state),
    connections: connectionsSelector(state),
  }),
  dispatch => ({
    togglePlayback: () => dispatch(playbackToggle()),
    toggleConnection: (fromId, toId) =>
      dispatch(connectionToggle(fromId, toId)),
  }),
)(GleetchyUI)
