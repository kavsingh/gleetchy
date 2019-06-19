import React, { memo, FunctionComponent } from 'react'
import { css, SerializedStyles } from '@emotion/core'
import color from 'color'
import { T } from 'ramda'

import { AudioNodeConnection, AudioNodeIdentifier } from '~/types'
import { noop, stubString } from '~/util/function'
import { UITheme } from '~/style/theme'
import { withTheme } from 'emotion-theming'

const rootStyle = css({
  width: '100%',
})

const labelStyle = css({
  fontSize: '0.68em',
  fontWeight: 400,
  maxWidth: '5.4em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const rowStyle = css({
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
})

const nodeStyle = (theme: UITheme) =>
  css({
    backgroundColor: 'transparent',
    border: `1px solid ${theme.colorKeyline}`,
    cursor: 'pointer',
    height: '0.8em',
    margin: '0 auto',
    transition: 'all 0.2s ease-out',
    width: '0.8em',
  })

const nodeActiveStyle = (theme: UITheme) =>
  css({
    backgroundColor: theme.colorEmphasis,
  })

const nodeBlockedStyle = (theme: UITheme) =>
  css({
    backgroundColor: theme.colorKeyline,
    cursor: 'default',
    transform: 'rotate(45deg) scale(0.5)',
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
  onNodeClick(from: AudioNodeIdentifier, to: AudioNodeIdentifier): unknown
  theme: UITheme
}

const PatchBay: FunctionComponent<PatchBayProps> = ({
  fromNodes = [],
  toNodes = [],
  canConnect = T,
  getConnection = noop,
  getNodeLabel = stubString,
  onNodeClick = noop,
  theme,
}) => (
  <table css={rootStyle}>
    <tbody>
      <tr css={rowStyle} key="titles">
        <th css={labelStyle}>To / From</th>
        {fromNodes.map(fromNode => (
          <th
            css={labelStyle}
            title={`From ${getNodeLabel(fromNode.id)} to ...`}
            key={fromNode.id}
          >
            {getNodeLabel(fromNode.id)}
          </th>
        ))}
      </tr>
      {toNodes.map(toNode => (
        <tr css={rowStyle} key={toNode.id}>
          <td
            css={labelStyle}
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

            let modClassName: SerializedStyles | undefined
            if (blockConnect) {
              modClassName = nodeBlockedStyle(theme)
            } else if (connection) {
              modClassName = nodeActiveStyle(theme)
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
                  css={[nodeStyle(theme), modClassName]}
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

export default memo(withTheme(PatchBay))
