import React from 'react'
import PropTypes from 'prop-types'

const PatchBay = ({ fromNodes, checkActiveNode, toNodes, onNodeClick }) => (
  <div className="patchBay">
    {toNodes.map(toNode => (
      <div className="patchBay__row" key={toNode.id}>
        {fromNodes.map(fromNode => (
          <div
            key={fromNode.id}
            className={`patchBay__node ${checkActiveNode(fromNode, toNode)
              ? ' patchBay__node_active'
              : ''}`}
            onClick={() => onNodeClick(fromNode, toNode)}
            role="button"
            tabIndex={0}
            onKeyUp={e => {
              if (e.key === 'Enter') onNodeClick(fromNode, toNode)
            }}
          />
        ))}
      </div>
    ))}
    <style jsx>{`
      .patchBay {
        width: 100%;
        height: 100%;
      }

      .patchBay__row {
        display: flex;
        align-items: center;
      }

      .patchBay__node {
        width: 1em;
        height: 1em;
        border-radius: 50%;
        border: 1px solid #eee;
        margin: 1em;
        cursor: pointer;
        background-color: transparent;
      }

      .patchBay__node_active {
        border-color: #000;
        background-color: #000;
      }
    `}</style>
  </div>
)

PatchBay.propTypes = {
  fromNodes: PropTypes.arrayOf(PropTypes.shape({})),
  toNodes: PropTypes.arrayOf(PropTypes.shape({})),
  checkActiveNode: PropTypes.func,
  onNodeClick: PropTypes.func,
}

PatchBay.defaultProps = {
  fromNodes: [],
  toNodes: [],
  checkActiveNode: () => false,
  onNodeClick: () => {},
}

export default PatchBay
