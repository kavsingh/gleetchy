import React from 'react'
import PropTypes from '../../PropTypes'
import { FX_REVERB, FX_DELAY } from '../../constants/nodeTypes'
import { noop, stubArray } from '../../util/function'
import AnimIn from '../../components/AnimIn'
import Delay from '../../fx/delay/UI'
import Reverb from '../../fx/reverb/UI'

const FxRack = ({
  fx,
  activeFx,
  updateFx,
  updateFxLabel,
  addReverb,
  addDelay,
  removeFx,
  getConnections,
}) => (
  <div className="fx">
    {fx.map(({ id, type, props, label }) => {
      if (type === FX_DELAY) {
        return (
          <div className="fx__fxContainer" key={id}>
            <AnimIn>
              <Delay
                label={label}
                connections={getConnections(id)}
                isActive={activeFx.includes(id)}
                wetDryRatio={props.wetDryRatio}
                delayTime={props.delayTime}
                onDelayTimeChange={delayTime => updateFx(id, { delayTime })}
                onWetDryRatioChange={wetDryRatio =>
                  updateFx(id, { wetDryRatio })}
                onLabelChange={val => updateFxLabel(id, val)}
                remove={() => removeFx(id)}
              />
            </AnimIn>
          </div>
        )
      } else if (type === FX_REVERB) {
        return (
          <div className="fx__fxContainer" key={id}>
            <AnimIn>
              <Reverb
                label={label}
                connections={getConnections(id)}
                isActive={activeFx.includes(id)}
                wetDryRatio={props.wetDryRatio}
                onWetDryRatioChange={wetDryRatio =>
                  updateFx(id, { wetDryRatio })}
                onLabelChange={val => updateFxLabel(id, val)}
                remove={() => removeFx(id)}
              />
            </AnimIn>
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
        align-items: flex-start;
      }

      .fx__fxContainer {
        flex: 1 0 10em;
        padding: 1em 0;
      }

      .fx__addFxContainer {
        min-height: 5em;
        padding: 1em 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .fx__addFxButton {
        cursor: pointer;
        font-size: 0.8em;
      }
    `}</style>
  </div>
)

FxRack.propTypes = {
  fx: PropTypes.arrayOf(PropTypes.shape({})),
  activeFx: PropTypes.arrayOf(PropTypes.string),
  getConnections: PropTypes.func,
  updateFx: PropTypes.func,
  updateFxLabel: PropTypes.func,
  removeFx: PropTypes.func,
  addReverb: PropTypes.func,
  addDelay: PropTypes.func,
}

FxRack.defaultProps = {
  fx: [],
  activeFx: [],
  getConnections: stubArray,
  updateFx: noop,
  updateFxLabel: noop,
  removeFx: noop,
  addReverb: noop,
  addDelay: noop,
}

export default FxRack
