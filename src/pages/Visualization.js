import React, { useState } from 'react';
import { multiply, add, pi, i, exp, abs } from 'mathjs';

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
      dft(setClasses.filter((target) => target.name === pitchClass)[0].pcv)
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
      <h1>The application goes here</h1>
      <div id='chart'></div>
    </>
  );
}

// DFT function
function dft(pcv) {
  let N = pcv.length;

  let coeff = [];

  for (let k = 0; k < N; k++) {
    let temp = 0;
    for (let n = 0; n < N; n++) {
      temp = add(
        multiply(pcv[n], exp(multiply(i, (-2 * pi * k * n) / N))),
        temp
      );
    }
    coeff.push(temp);
  }
  return coeff.slice(0, 7);
}

let pcvs = setClasses.map((setClass) => setClass.pcv);
//let setClassesNames = setClasses.map((setClass) => setClass.name);
let magn = [];
let spect = [];

// Compute the dft coeffs
for (let i = 0; i < pcvs.length; i++) {
  let coeffs = dft(pcvs[i]);
  spect.push(coeffs.slice());
}

// Compute the coeffs' magnitude
magn.push(abs(spect));
magn = magn[0];

// Normalization
for (let i = 0; i < magn.length; i++) {
  let norm = abs(magn[i][0]);

  for (let j = 0; j < magn[i].length; j++) magn[i][j] = magn[i][j] / norm;
}

// Rounding
for (let i = 0; i < magn.length; i++) {
  for (let j = 0; j < magn[i].length; j++)
    magn[i][j] = Math.round(magn[i][j] * 100) / 100;
}

// Printing
/* let printableMagn = [];
for (let i = 0; i < magn.length; i++) {
  printableMagn.push(magn[i].slice(1, 7));
  console.log(setClassesNames[i] + ':\n');
  console.log(printableMagn[i]);
} */
