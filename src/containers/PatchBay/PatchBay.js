import React from 'react'
import { always, T } from 'ramda'
import color from 'color'
import PropTypes from '../../PropTypes'
import { COLOR_EMPHASIS, COLOR_KEYLINE } from '../../constants/style'
import { noop } from '../../util/function'

const PatchBay = ({
  fromNodes,
  toNodes,
  canConnect,
  getConnection,
  onNodeClick,
}) => (
  <table className="patchBay">
    <tbody>
      <tr className="patchBay__row" key="titles">
        <th className="patchBay__label">To / From</th>
        {fromNodes.map(fromNode => (
          <th
            className="patchBay__label"
            title={`From ${fromNode.label} to ...`}
            key={fromNode.id}
          >
            {fromNode.label}
          </th>
        ))}
      </tr>
      {toNodes.map(toNode => (
        <tr className="patchBay__row" key={toNode.id}>
          <td
            className="patchBay__label"
            title={`From ... to ${toNode.label}`}
            key="rowLabel"
          >
            {toNode.label}
          </td>
          {fromNodes.map(fromNode => {
            const connection = getConnection(fromNode, toNode)
            const blockConnect = !connection && !canConnect(fromNode, toNode)
            const title = blockConnect
              ? 'This will cause a circular connection, big feedback, ear bleeding, much sadness'
              : `From ${fromNode.label} to ${toNode.label}`

            let modClassName = 'patchBay__node_inactive'
            if (blockConnect) modClassName = 'patchBay__node_blocked'
            else if (connection) modClassName = 'patchBay__node_active'

            const handleClick = blockConnect
              ? noop
              : () => onNodeClick(fromNode, toNode)

            return (
              <td key={fromNode.id}>
                <div
                  style={
                    connection
                      ? {
                          backgroundColor: connection.color,
                          borderColor: color(connection.color)
                            .darken(0.06)
                            .hex(),
                        }
                      : {}
                  }
                  className={`patchBay__node ${modClassName}`}
                  onClick={handleClick}
                  role="button"
                  tabIndex={0}
                  onKeyUp={e => {
                    if (e.key === 'Enter') handleClick()
                  }}
                  title={title}
                />
              </td>
            )
          })}
        </tr>
      ))}
    </tbody>
    <style jsx>{`
      .patchBay {
        width: 100%;
      }

      .patchBay__label {
        font-size: 0.68em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;
        max-width: 5.4em;
      }

      .patchBay__row td,
      .patchBay__row th {
        text-align: center;
      }

      .patchBay__row td:first-child,
      .patchBay__row th:first-child {
        text-align: left;
      }

      .patchBay__row th {
        padding: 0 0 0.6em;
      }

      .patchBay__row td {
        padding: 0.6em 0;
      }

      .patchBay__row td:not(:first-child) {
        padding: 0 0.6em;
      }

      .patchBay__node {
        transition: all 0.2s ease-out;
        width: 0.8em;
        height: 0.8em;
        border: 1px solid ${COLOR_KEYLINE};
        margin: 0 auto;
        cursor: pointer;
        background-color: transparent;
      }

      .patchBay__node_active {
        background-color: ${COLOR_EMPHASIS};
      }

      .patchBay__node_blocked {
        background-color: ${COLOR_KEYLINE};
        cursor: default;
        transform: rotate(45deg) scale(0.5);
      }
    `}</style>
  </table>
)

PatchBay.propTypes = {
  fromNodes: PropTypes.arrayOf(PropTypes.shape({})),
  toNodes: PropTypes.arrayOf(PropTypes.shape({})),
  canConnect: PropTypes.func,
  getConnection: PropTypes.func,
  onNodeClick: PropTypes.func,
}

PatchBay.defaultProps = {
  fromNodes: [],
  toNodes: [],
  canConnect: T,
  getConnection: always(undefined),
  onNodeClick: noop,
}

export default PatchBay
