import React from 'react'

const Switch = ({ label, style, isOn, handleToggle, onColor, isDisable = false }) => {
  return (
    <div style={style}>
      <input
        disabled={isDisable}
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={label}
        type="checkbox"
      />
      <label
        style={{ background: (isOn && onColor) || (isDisable && 'hwb(0 75% 25%)') }}
        className="react-switch-label"
        htmlFor={label}
      >
        <span className={`react-switch-button`} />
      </label>
    </div>
  )
}

export default Switch
