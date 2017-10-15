import React from 'react'
import PropTypes from 'prop-types'

const PatchBay = ({ fromNodes, checkActiveNode, toNodes, onNodeClick }) => (
  <div className="patchBay">
    <div className="patchBay__row" key="titles">
      <div className="patchBay__label patchBay__label_horizontal">
        In &nbsp;/ Out
      </div>
      {fromNodes.map(({ id, label }, i) => (
        <div
          className={`patchBay__label patchBay__label_vertical ${i ===
          fromNodes.length - 1
            ? ' patchBay__rowItem_last'
            : ''}`}
          key={id}
        >
          {label}
        </div>
      ))}
    </div>
    {toNodes.map(toNode => (
      <div className="patchBay__row" key={toNode.id}>
        <div className="patchBay__label patchBay__label_horizontal">
          {toNode.label}
        </div>
        {fromNodes.map(
          (fromNode, i) =>
            fromNode.id === toNode.id ? (
              <div
                key={fromNode.id}
                className={`patchBay__node patchBay__node_dummy ${i ===
                fromNodes.length - 1
                  ? ' patchBay__rowItem_last'
                  : ''}`}
              />
            ) : (
              <div
                key={fromNode.id}
                className={`patchBay__node ${checkActiveNode(fromNode, toNode)
                  ? ' patchBay__node_active'
                  : ''} ${i === fromNodes.length - 1
                  ? ' patchBay__rowItem_last'
                  : ''}`}
                onClick={() => onNodeClick(fromNode, toNode)}
                role="button"
                tabIndex={0}
                onKeyUp={e => {
                  if (e.key === 'Enter') onNodeClick(fromNode, toNode)
                }}
                title={`${fromNode.title} > ${toNode.title}`}
              />
            ),
        )}
      </div>
    ))}
    <style jsx>{`
      .patchBay {
        width: 100%;
        height: 100%;
      }

      .patchBay__label {
        font-size: 0.68em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .patchBay__label_horizontal {
        width: 4em;
      }

      .patchBay__label_vertical {
        width: 0.94rem;
        margin: 0 0.9rem;
        text-align: center;
      }

      .patchBay__row {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
      }

      .patchBay__node {
        width: 0.94rem;
        height: 0.94rem;
        border-radius: 50%;
        border: 1px solid black;
        margin: 0 0.9rem;
        cursor: pointer;
        background-color: transparent;
        opacity: 0.1;
        transition: opacity 0.2s ease-out;
      }

      .patchBay__node_active {
        background-color: black;
        opacity: 1;
      }

      .patchBay__node_dummy {
        background-color: black;
        cursor: default;
      }

      .patchBay__rowItem_last {
        margin-right: 0;
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
