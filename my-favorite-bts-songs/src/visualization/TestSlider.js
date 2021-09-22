import React from "react";
/* eslint-disable react/prop-types */

function TestSlider(props) {
  return (
    <div>
      <input
        type="range"
        min="0"
        max="4.00"
        value="0"
        id="myRange"
        step="0.1"
        onChange={(e) => props.getValue(e.target.value)}
      />
    </div>
  );
}

export default TestSlider;
