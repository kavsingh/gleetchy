import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FX_REVERB, FX_DELAY } from '../../constants/nodeTypes'
import { fxSelector, activeFXSelector } from '../../state/gleetchy/selectors'
import { nodeUpdateProps, nodeUpdateLabel } from '../../state/gleetchy/actions'
import Delay from '../../components/Delay'
import Reverb from '../../components/Reverb'

const FX = ({ fx, activeFx, updateFx, updateFxLabel }) => (
  <div className="fx">
    {fx.map(({ id, type, props, label }) => {
      if (type === FX_DELAY) {
        return (
          <Delay
            key={id}
            label={label}
            isActive={activeFx.includes(id)}
            wetDryRatio={props.wetDryRatio}
            delayTime={props.delayTime}
            onDelayTimeChange={delayTime => updateFx(id, { delayTime })}
            onWetDryRatioChange={wetDryRatio => updateFx(id, { wetDryRatio })}
            onLabelChange={val => updateFxLabel(id, val)}
          />
        )
      } else if (type === FX_REVERB) {
        return (
          <Reverb
            key={id}
            label={label}
            isActive={activeFx.includes(id)}
            wetDryRatio={props.wetDryRatio}
            onWetDryRatioChange={wetDryRatio => updateFx(id, { wetDryRatio })}
            onLabelChange={val => updateFxLabel(id, val)}
          />
        )
      }
      return null
    })}
    <style jsx>{`
      .fx {
        width: 100%;
        display: flex;
      }
    `}</style>
  </div>
)

FX.propTypes = {
  fx: PropTypes.arrayOf(PropTypes.shape({})),
  activeFx: PropTypes.arrayOf(PropTypes.string),
  updateFx: PropTypes.func,
  updateFxLabel: PropTypes.func,
}

FX.defaultProps = {
  fx: [],
  activeFx: [],
  updateFx: () => {},
  updateFxLabel: () => {},
}

export default connect(
  state => ({
    fx: fxSelector(state),
    activeFx: activeFXSelector(state),
  }),
  dispatch => ({
    updateFx: (id, props) => dispatch(nodeUpdateProps(id, props)),
    updateFxLabel: (id, label) => dispatch(nodeUpdateLabel(id, label)),
  }),
)(FX)
