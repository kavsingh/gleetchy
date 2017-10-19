import React from 'react'
import PropTypes from 'prop-types'
import { F } from 'ramda'
import color from 'color'
import { COLOR_EMPHASIS } from '../../constants/style'
import { noop } from '../../util/function'

const PatchBay = ({ fromNodes, toNodes, getConnection, onNodeClick }) => (
  <table className="patchBay">
    <tbody>
      <tr className="patchBay__row" key="titles">
        <th className="patchBay__label">To / From</th>
        {fromNodes.map((fromNode, i) => (
          <th
            className={`patchBay__label ${i === fromNodes.length - 1
              ? ' patchBay__rowItem_last'
              : ''}`}
            title={`From ${fromNode.label} to ...`}
            key={fromNode.id}
          >
            {fromNode.label}
          </th>
        ))}
      </tr>
      {toNodes.map(toNode => (
        <tr className="patchBay__row" key={toNode.id}>
          <td className="patchBay__label" title={`From ... to ${toNode.label}`}>
            {toNode.label}
          </td>
          {fromNodes.map((fromNode, i) => {
            if (fromNode.id === toNode.id) {
              return (
                <td key={fromNode.id}>
                  <div
                    className={`patchBay__node patchBay__node_dummy ${i ===
                    fromNodes.length - 1
                      ? ' patchBay__rowItem_last'
                      : ''}`}
                  />
                </td>
              )
            }

            const activeConnection = getConnection(fromNode, toNode)
            const connection = activeConnection
              ? { ...activeConnection, color: '#000' }
              : activeConnection

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
                  className={`patchBay__node ${connection
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
                  title={`From ${fromNode.label} to ${toNode.label}`}
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
        width: 0.8em;
        height: 0.8em;
        border-radius: 50%;
        border: 1px solid ${COLOR_EMPHASIS};
        margin: 0 auto;
        cursor: pointer;
        background-color: transparent;
        opacity: 0.1;
        transition: opacity 0.2s ease-out;
      }

      .patchBay__node_active {
        background-color: ${COLOR_EMPHASIS};
        opacity: 1;
      }

      .patchBay__node_dummy {
        background-color: ${COLOR_EMPHASIS};
        cursor: default;
      }
    `}</style>
  </table>
)

PatchBay.propTypes = {
  fromNodes: PropTypes.arrayOf(PropTypes.shape({})),
  toNodes: PropTypes.arrayOf(PropTypes.shape({})),
  getConnection: PropTypes.func,
  onNodeClick: PropTypes.func,
}

PatchBay.defaultProps = {
  fromNodes: [],
  toNodes: [],
  getConnection: F,
  onNodeClick: noop,
}

export default PatchBay
