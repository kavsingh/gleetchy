import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FX_REVERB, FX_DELAY } from '../../constants/nodeTypes'
import { fxSelector, activeFXSelector } from '../../state/gleetchy/selectors'
import {
  nodeUpdateProps,
  nodeUpdateLabel,
  reverbAdd,
  delayAdd,
  nodeRemove,
} from '../../state/gleetchy/actions'
import Delay from '../../components/Delay'
import Reverb from '../../components/Reverb'

const FX = ({
  fx,
  activeFx,
  updateFx,
  updateFxLabel,
  addReverb,
  addDelay,
  removeFx,
}) => (
  <div className="fx">
    {fx.map(({ id, type, props, label }) => {
      if (type === FX_DELAY) {
        return (
          <div className="fx__fxContainer" key={id}>
            <Delay
              label={label}
              isActive={activeFx.includes(id)}
              wetDryRatio={props.wetDryRatio}
              delayTime={props.delayTime}
              onDelayTimeChange={delayTime => updateFx(id, { delayTime })}
              onWetDryRatioChange={wetDryRatio => updateFx(id, { wetDryRatio })}
              onLabelChange={val => updateFxLabel(id, val)}
              remove={() => removeFx(id)}
            />
          </div>
        )
      } else if (type === FX_REVERB) {
        return (
          <div className="fx__fxContainer" key={id}>
            <Reverb
              label={label}
              isActive={activeFx.includes(id)}
              wetDryRatio={props.wetDryRatio}
              onWetDryRatioChange={wetDryRatio => updateFx(id, { wetDryRatio })}
              onLabelChange={val => updateFxLabel(id, val)}
              remove={() => removeFx(id)}
            />
          </div>
        )
      }
      return null
    })}
    <div className="fx__addFxContainer">
      {[['Reverb', addReverb], ['Delay', addDelay]].map(([type, handler]) => (
        <div
          className="fx__addFxButton"
          role="button"
          tabIndex={0}
          onClick={handler}
          onKeyDown={event => {
            if (event.key === 'Enter') handler()
          }}
          key={type}
        >
          [ Add {type} ]
        </div>
      ))}
    </div>
    <style jsx>{`
      .fx {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }
      .fx__fxContainer,
      .fx__addFxContainer {
        flex: 0 1 50%;
        padding: 1em 0;
      }

      .fx__addFxContainer {
        min-height: 5em;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 1em 0;
      }

      .fx__addFxButton {
        cursor: pointer;
        font-size: 0.8em;
      }
    `}</style>
  </div>
)

FX.propTypes = {
  fx: PropTypes.arrayOf(PropTypes.shape({})),
  activeFx: PropTypes.arrayOf(PropTypes.string),
  updateFx: PropTypes.func,
  updateFxLabel: PropTypes.func,
  removeFx: PropTypes.func,
  addReverb: PropTypes.func,
  addDelay: PropTypes.func,
}

FX.defaultProps = {
  fx: [],
  activeFx: [],
  updateFx: () => {},
  updateFxLabel: () => {},
  removeFx: () => {},
  addReverb: () => {},
  addDelay: () => {},
}

export default connect(
  state => ({
    fx: fxSelector(state),
    activeFx: activeFXSelector(state),
  }),
  dispatch => ({
    updateFx: (id, props) => dispatch(nodeUpdateProps(id, props)),
    updateFxLabel: (id, label) => dispatch(nodeUpdateLabel(id, label)),
    addReverb: () => dispatch(reverbAdd()),
    addDelay: () => dispatch(delayAdd()),
    removeFx: id => dispatch(nodeRemove(id)),
  }),
)(FX)
