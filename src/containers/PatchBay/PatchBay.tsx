import color from 'color'
import { cx } from 'emotion'
import { T } from 'ramda'
import React, { memo, StatelessComponent } from 'react'

import { COLOR_EMPHASIS, COLOR_KEYLINE } from '~/constants/style'
import { AudioNodeConnection, AudioNodeIdentifier } from '~/types'
import { noop, stubString } from '~/util/function'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('patchBay', {
  root: {
    width: '100%',
  },

  label: {
    fontSize: '0.68em',
    fontWeight: 400,
    maxWidth: '5.4em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
    backgroundColor: 'transparent',
    border: `1px solid ${COLOR_KEYLINE}`,
    cursor: 'pointer',
    height: '0.8em',
    margin: '0 auto',
    transition: 'all 0.2s ease-out',
    width: '0.8em',
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

export interface PatchBayProps {
  fromNodes: AudioNodeIdentifier[]
  toNodes: AudioNodeIdentifier[]
  canConnect(from: AudioNodeIdentifier, to: AudioNodeIdentifier): boolean
  getConnection(
    a: AudioNodeIdentifier,
    b: AudioNodeIdentifier,
  ): AudioNodeConnection | undefined
  getNodeLabel(id: string): string
  onNodeClick(from: AudioNodeIdentifier, to: AudioNodeIdentifier): void
}

const PatchBay: StatelessComponent<PatchBayProps> = ({
  fromNodes = [],
  toNodes = [],
  canConnect = T,
  getConnection = noop,
  getNodeLabel = stubString,
  onNodeClick = noop,
}) => (
  <table className={classes.root}>
    <tbody>
      <tr className={classes.row} key="titles">
        <th className={classes.label}>To / From</th>
        {fromNodes.map(fromNode => (
          <th
            className={classes.label}
            title={`From ${getNodeLabel(fromNode.id)} to ...`}
            key={fromNode.id}
          >
            {getNodeLabel(fromNode.id)}
          </th>
        ))}
      </tr>
      {toNodes.map(toNode => (
        <tr className={classes.row} key={toNode.id}>
          <td
            className={classes.label}
            title={`From ... to ${getNodeLabel(toNode.id)}`}
            key="rowLabel"
          >
            {getNodeLabel(toNode.id)}
          </td>
          {fromNodes.map(fromNode => {
            const connection = getConnection(fromNode, toNode)
            const blockConnect = !connection && !canConnect(fromNode, toNode)
            const title = blockConnect
              ? 'This will cause a circular connection, big feedback, ear bleeding, much sadness'
              : `From ${getNodeLabel(fromNode.id)} to ${getNodeLabel(
                  toNode.id,
                )}`

            let modClassName = ''
            if (blockConnect) {
              modClassName = classes.nodeBlocked
            } else if (connection) {
              modClassName = classes.nodeActive
            }

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
                  className={cx([classes.node, modClassName])}
                  onClick={handleClick}
                  role="button"
                  tabIndex={0}
                  onKeyUp={e => {
                    if (e.key === 'Enter') {
                      handleClick()
                    }
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

export default memo(PatchBay)
