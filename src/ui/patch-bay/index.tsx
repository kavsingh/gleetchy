import { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import {
  connectableSourcesSelector,
  connectableTargetsSelector,
} from '~/state/audio-nodes/selectors'
import ErrorBoundary from '~/components/error-boundary'
import type { FCWithoutChildren } from '~/types'

import PatchBayNode from './patch-bay-node'

const PatchBay: FCWithoutChildren = () => {
  const sources = useSelector(connectableSourcesSelector)
  const targets = useSelector(connectableTargetsSelector)

  const sourceLabels = useMemo(
    () => (
      <Row key="source-labels">
        <SourceLabel>To / From</SourceLabel>
        {sources.map((source) => (
          <SourceLabel title={`From ${source.label} to ...`} key={source.id}>
            {source.label}
          </SourceLabel>
        ))}
      </Row>
    ),
    [sources],
  )

  return (
    <ErrorBoundary>
      <Container>
        <tbody>
          {sourceLabels}
          {targets.map((target) => (
            <Row key={target.id}>
              <TargetLabel title={`From ... to ${target.label}`} key="rowLabel">
                {target.label}
              </TargetLabel>
              {sources.map((source) => (
                <td key={`${source.id}-${target.id}`}>
                  <PatchBayNode source={source} target={target} />
                </td>
              ))}
            </Row>
          ))}
        </tbody>
      </Container>
    </ErrorBoundary>
  )
}

export default memo(PatchBay)

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

  th:first-of-type,
  td:first-of-type {
    text-align: left;
  }

  td:not(:first-of-type) {
    padding: 0 0.4em;
  }
`

const SourceLabel = styled.th`
  ${labelStyle}
`

const TargetLabel = styled.td`
  ${labelStyle}
`
