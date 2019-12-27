import React, { memo, FunctionComponent, useCallback } from 'react'
import styled from '@emotion/styled'
import { css, SerializedStyles } from '@emotion/core'
import { withTheme } from 'emotion-theming'
import color from 'color'

import { noop } from '~/util/function'
import { canConnectNodes, getConnectionBetween } from '~/util/audio'
import useConnections from '~/state/hooks/useConnections'
import { UITheme } from '~/style/theme'
import ErrorBoundary from '~/components/ErrorBoundary'

const Container = styled.table`
  width: 100%;
`

const labelStyle = css`
  max-width: 5.4em;
  overflow: hidden;
  font-weight: 400;
  font-size: 0.68em;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Row = styled.tr`
  th,
  td {
    text-align: center;
  }

  th {
    padding: 0 0 0.4em;
  }

  td {
    padding: 0.4em 0;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  td:not(:first-child) {
    padding: 0 0.4em;
  }
`

const nodeStyle = (theme: UITheme, connectionColor?: string) =>
  css`
    width: 0.8em;
    height: 0.8em;
    margin: 0 auto;
    border: 1px solid ${theme.colors.keyline};
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover {
      border-color: ${connectionColor || theme.colors.body};
    }
  `

const nodeActiveStyle = (theme: UITheme) =>
  css`
    background-color: ${theme.colors.emphasis};
  `

const nodeBlockedStyle = (theme: UITheme) =>
  css`
    background-color: ${theme.colors.keyline};
    transform: rotate(45deg) scale(0.5);
    cursor: default;
  `

const PatchBay: FunctionComponent<{ theme: UITheme }> = ({ theme }) => {
  const [
    { sources, targets, connections },
    { toggleConnection },
  ] = useConnections()

  const canConnect = useCallback(canConnectNodes(connections), [connections])
  const getConnection = useCallback(getConnectionBetween(connections), [
    connections,
  ])

  return (
    <ErrorBoundary>
      <Container>
        <tbody>
          <Row key="titles">
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
          </Row>
          {targets.map(target => (
            <Row key={target.id}>
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
            </Row>
          ))}
        </tbody>
      </Container>
    </ErrorBoundary>
  )
}

export default memo(withTheme(PatchBay))
