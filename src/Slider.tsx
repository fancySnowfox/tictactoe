import React, {useState} from 'react';

const [sliderValue, setSliderValue] = useState(3);

export default function Slider () {
  const [sliderValue, setSliderValue] = useState(5);

  return (
    <div>
    <input
      type="range"
      min="3"
      max="6"
      value = "3"
      step ="1" 
    />
    <p>Value = {sliderValue} </p>
    </div>
  );
};