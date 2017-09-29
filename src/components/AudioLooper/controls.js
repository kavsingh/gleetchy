import React from 'react'
import Knob from '../Knob'
import Slider from '../Slider'

export const renderPlaybackControls = (
  gain,
  playbackRate,
  onGainChange,
  onPlaybackRateChange,
) => (
  <div className="audioLooper__playbackControls">
    <div className="audioLooper__playbackControlContainer">
      <Knob
        value={gain}
        renderTitle={() => 'Gain'}
        renderLabel={() => 'G'}
        renderValue={() => gain.toFixed(2)}
        onChange={onGainChange}
      />
    </div>
    <div className="audioLooper__playbackControlContainer">
      <Knob
        value={playbackRate * 0.5}
        renderTitle={() => 'Speed'}
        renderLabel={() => 'S'}
        renderValue={() => playbackRate.toFixed(2)}
        onChange={val => onPlaybackRateChange(val * 2)}
      />
    </div>
    <style jsx>{`
      .audioLooper__playbackControls {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }

      .audioLooper__playbackControlContainer {
        height: calc(50% - 0.6em);
      }
    `}</style>
  </div>
)

export const renderEqControls = (eqLow, eqMid, eqHigh, onEqChange) => (
  <div className="audioLooper__eqControls">
    <div className="audioLooper__eqControlContainer">
      <Slider
        value={eqLow * 0.5 + 0.5}
        renderTitle={() => 'EQ low gain'}
        renderLabel={() => 'L'}
        renderValue={() => eqLow.toFixed(1)}
        onChange={val => onEqChange({ eqLow: val * 2 - 1 })}
      />
    </div>
    <div className="audioLooper__eqControlContainer">
      <Slider
        value={eqMid * 0.5 + 0.5}
        renderTitle={() => 'EQ mid gain'}
        renderLabel={() => 'M'}
        renderValue={() => eqMid.toFixed(1)}
        onChange={val => onEqChange({ eqMid: val * 2 - 1 })}
      />
    </div>
    <div className="audioLooper__eqControlContainer">
      <Slider
        value={eqHigh * 0.5 + 0.5}
        renderTitle={() => 'EQ high gain'}
        renderLabel={() => 'H'}
        renderValue={() => eqHigh.toFixed(1)}
        onChange={val => onEqChange({ eqHigh: val * 2 - 1 })}
      />
    </div>
    <style jsx>{`
      .audioLooper__eqControls {
        height: 100%;
        margin-left: 0.6em;
        display: flex;
      }

      .audioLooper__eqControlContainer {
        width: 2em;
        height: 100%;
      }
    `}</style>
  </div>
)
