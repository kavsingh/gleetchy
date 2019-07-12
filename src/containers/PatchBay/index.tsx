import React, { memo, FunctionComponent, useCallback } from 'react'
import { css, SerializedStyles } from '@emotion/core'
import { withTheme } from 'emotion-theming'
import color from 'color'

import { noop } from '~/util/function'
import { canConnectNodes, getConnectionBetween } from '~/util/audio'
import useConnections from '~/state/hooks/useConnections'
import { UITheme } from '~/style/theme'

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

const nodeStyle = (theme: UITheme, connectionColor?: string) =>
  css({
    backgroundColor: 'transparent',
    border: `1px solid ${theme.colorKeyline}`,
    cursor: 'pointer',
    height: '0.8em',
    margin: '0 auto',
    transition: 'all 0.2s ease-out',
    width: '0.8em',

    '&:hover': {
      borderColor: connectionColor || theme.colorBody,
    },
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

const PatchBay: FunctionComponent<{ theme: UITheme }> = ({ theme }) => {
  const { sources, targets, connections, toggleConnection } = useConnections()

  const canConnect = useCallback(canConnectNodes(connections), [connections])
  const getConnection = useCallback(getConnectionBetween(connections), [
    connections,
  ])

  return (
    <table css={rootStyle}>
      <tbody>
        <tr css={rowStyle} key="titles">
          <th css={labelStyle}>To / From</th>
          {sources.map(source => (
            <th
              css={labelStyle}
              title={`From ${source.label} to ...`}
              key={source.id}
            >
              {source.label}
            </th>
          ))}
        </tr>
        {targets.map(target => (
          <tr css={rowStyle} key={target.id}>
            <td
              css={labelStyle}
              title={`From ... to ${target.label}`}
              key="rowLabel"
            >
              {target.label}
            </td>
            {sources.map(source => {
              const connection = getConnection(source, target)
              const blockConnect = !connection && !canConnect(source, target)
              const title = blockConnect
                ? 'This will cause a circular connection, big feedback, ear bleeding, much sadness'
                : `From ${source.label} to ${target.label}`

              let modClassName: SerializedStyles | undefined

              if (blockConnect) modClassName = nodeBlockedStyle(theme)
              else if (connection) modClassName = nodeActiveStyle(theme)

              const handleClick = blockConnect
                ? noop
                : () => toggleConnection(source, target)

              const connectionColor = connection ? connection.color : ''

              return (
                <td key={`${source.id}-${target.id}`}>
                  <div
                    style={
                      connectionColor
                        ? {
                            backgroundColor: connectionColor,
                            borderColor: color(connectionColor)
                              .darken(0.06)
                              .hex(),
                          }
                        : {}
                    }
                    css={[nodeStyle(theme, connectionColor), modClassName]}
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
}

export default memo(withTheme(PatchBay))
