import React, { useState } from 'react';
import { DrawCircles } from '../DrawCircles';
import dft from '../DFT';

//SET CLASSES
let setClasses = [
  // C  C# D  D# E  F  F# G  G# A  Bb B
  { name: 'Single Tone', pcv: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, //Single tone
  { name: 'Tritone', pcv: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0] }, //Tritone
  { name: 'Major Triad', pcv: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0] }, //Major triad
  { name: 'Aug Triad', pcv: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] }, //Aug triad
  { name: 'Maj7', pcv: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1] }, //Maj7
  { name: 'Min7', pcv: [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0] }, //min7
  { name: 'Half-Dim7', pcv: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0] }, //Half-dim 7
  { name: 'Dim7', pcv: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] }, //dim 7
  { name: 'Pentatonic', pcv: [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0] }, //Pentatonic
  { name: "Guido's Hexachord", pcv: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0] }, //Guido's hexachord
  { name: 'Whole-Tone Scale', pcv: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] }, //Whole-tone scale
  { name: '6 chromatic Tones6', pcv: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0] }, //6 chromatic tones
  { name: 'Diatonic Scale', pcv: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1] }, //Diatonic scale
  { name: '3 chromatic tritones', pcv: [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0] }, //3 chromatic tritones
  { name: 'Hexatonic Scale', pcv: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1] }, //Hexatonic scale
  { name: 'Octatonic Scale', pcv: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1] }, //Octatonic scale
  { name: 'All Tones', pcv: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }, //All tones
];

export default function Visualization() {
  const [pitchClass, setPitchClass] = useState('');
  const [file, setFile] = useState('');

  const handleSubmit = (e) => {
    //In order not to refresh the page (default behaviuor)
    e.preventDefault();
    console.log(
      dft(
        setClasses.filter((target) => target.name === pitchClass)[0].pcv,
        true
      )
    );
  };

  return (
    <>
      {/* <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='pitchClass'>Pitch class: </label>
          <input
            type='text'
            name='pitchClass'
            id='pitchClass'
            value={pitchClass}
            onChange={(e) => setPitchClass(e.target.value)}
          />
        </div>
      </form> */}
      <form onSubmit={handleSubmit}>
        <label htmlFor='pitchClass'>Set class: </label>
        <select
          name='pitchClass'
          id='pitchClass'
          value={pitchClass}
          onChange={(e) => setPitchClass(e.target.value)}
        >
          {setClasses.map((setClass) => (
            <option key={setClass.name} value={setClass.name}>
              {setClass.name}
            </option>
          ))}
        </select>
        <input type='submit' value='Submit'></input>
      </form>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='file'>Select a MIDI file: </label>
          <input
            type='file'
            id='file'
            name='file'
            value={file}
            onChange={(e) => setFile(e.target.value)}
          />
          <button type='submit'>Submit</button>
        </div>
      </form>

      <DrawCircles />
    </>
  );
}
