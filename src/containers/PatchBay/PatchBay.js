import React from 'react'
import classnames from 'classnames'
import { always, T } from 'ramda'
import color from 'color'

import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import { COLOR_EMPHASIS, COLOR_KEYLINE } from '~/constants/style'

const classes = cssLabeled('patchBay', {
  root: {
    width: '100%',
  },

  label: {
    fontSize: '0.68em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 400,
    maxWidth: '5.4em',
  },

  row: {
    'td, th': {
      textAlign: 'center',
    },

    'td:first-child, th:first-child': {
      textAlign: 'left',
    },

    th: {
      padding: '0 0 0.6em',
    },

    td: {
      padding: '0.6em 0',
    },

    'td:not(:first-child)': {
      padding: '0 0.6em',
    },
  },

  node: {
    transition: 'all 0.2s ease-out',
    width: '0.8em',
    height: '0.8em',
    border: `1px solid ${COLOR_KEYLINE}`,
    margin: '0 auto',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },

  nodeActive: {
    backgroundColor: COLOR_EMPHASIS,
  },

  nodeBlocked: {
    backgroundColor: COLOR_KEYLINE,
    cursor: 'default',
    transform: 'rotate(45deg) scale(0.5)',
  },
})

const PatchBay = ({
  fromNodes,
  toNodes,
  canConnect,
  getConnection,
  onNodeClick,
}) => (
  <table className={classes.root}>
    <tbody>
      <tr className={classes.row} key="titles">
        <th className={classes.label}>To / From</th>
        {fromNodes.map(fromNode => (
          <th
            className={classes.label}
            title={`From ${fromNode.label} to ...`}
            key={fromNode.id}
          >
            {fromNode.label}
          </th>
        ))}
      </tr>
      {toNodes.map(toNode => (
        <tr className={classes.row} key={toNode.id}>
          <td
            className={classes.label}
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

            let modClassName = ''
            if (blockConnect) modClassName = classes.nodeBlocked
            else if (connection) modClassName = classes.nodeActive

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
                  className={classnames(classes.node, modClassName)}
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
