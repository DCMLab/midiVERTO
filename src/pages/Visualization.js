import React, { useState, useEffect } from 'react';
import { DrawCircles } from '../DrawCircles';
import { DrawWavescapes } from '../DrawWavescapes';
import { prototypesData } from '../prototypesData';
import Player, { setPlayerMidiData } from './Player';
import { getDftCoeffFromMidi, getRgbaMatrix } from '../getDftMatrices';
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
  const [selectedPitchClasses, setSelectedPitchClasses] =
    useState(prototypesData);
  const [wavescapesData, setWavescapesData] = useState([]);
  const [showPrototypes, setShowPrototypes] = useState(true);
  const [traceData, setTraceData] = useState([]);
  const [file, setFile] = useState('');
  const [userPcv, setUserPcv] = useState([]);
  const [currentSubdiv, setCurrentSubdiv] = useState(0);

  function handleShowPrototypes(showing) {
    let temp = selectedPitchClasses.slice();

    if (showing) temp.push(...prototypesData);
    else temp = temp.filter((pc) => pc.isPrototype === false);

    setSelectedPitchClasses(temp);
    setShowPrototypes(showing);
  }

  //MIDI parsing on file change
  useEffect(() => {
    let input = document.getElementById('file').files[0];
    if (input) {
      let resolution = 10;
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(input);
      fileReader.onload = (ris) => {
        setPlayerMidiData(ris.target.result, resolution, setCurrentSubdiv);
        let dftCoeff = getDftCoeffFromMidi(ris.target.result, resolution);
        setTraceData(dftCoeff);
        setWavescapesData(getRgbaMatrix(dftCoeff));
        //console.log(wavescapesData);
      };
    }
  }, [file]);

  const handleSubmit = (e) => {
    //In order not to refresh the page (default behaviuor)
    e.preventDefault();
  };

  const handleSubmitPitchClass = (e) => {
    //In order not to refresh the page (default behaviuor)
    e.preventDefault();
    let parsedInput = parse(e.target[0].value);
    let dftCoeffsInput = [];
    for (let i = 0; i < parsedInput.length; i++) {
      dftCoeffsInput.push(dft(parsedInput[i], true, true, false));
    }
    let temp = [];
    if (userPcv.length > 0) temp = [...userPcv.slice(), ...dftCoeffsInput];
    else temp = dftCoeffsInput;
    setUserPcv(temp);
  };

  return (
    <>
      <Player resolution={1000} />
      <form onSubmit={handleSubmitPitchClass}>
        <div>
          <label htmlFor='pitchClass'>Pitch class: </label>
          <input
            type='text'
            name='pitchClass'
            id='pitchClass'
            autoComplete='off'
            placeholder='Ex.(1,0,0,0,1,0,0,1,0,0,0,1)'
          />
          <button type='submit'>Submit</button>
        </div>
      </form>

      <div>
        <label htmlFor='showPrototypes'>Show prototypes: </label>
        <input
          type='checkbox'
          id='showPrototypes'
          name='showPrototypes'
          onChange={() => handleShowPrototypes(!showPrototypes)}
          checked={showPrototypes}
        ></input>
      </div>

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

      <DrawCircles
        printablePitchClasses={selectedPitchClasses}
        traceData={traceData}
        userPcv={userPcv}
        currentSubdiv={currentSubdiv}
      />

      {wavescapesData.map((matrix, i) => {
        return (
          <DrawWavescapes key={`wavescape${i}`} wavescapeMatrix={matrix} />
        );
      })}
    </>
  );
}

function parse(input) {
  let pcvs = [];
  let isGroup = false;
  let openDivider = '(';
  let closeDivider = ')';

  let firstIndex = 0;
  let secondIndex = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === openDivider) {
      isGroup = true;
      firstIndex = i + 1;
      secondIndex = firstIndex;
    }

    if (isGroup) {
      if (input[i] === closeDivider) {
        isGroup = false;
        let ris = input.slice(firstIndex, secondIndex - 1);
        pcvs.push(ris);
      } else {
        secondIndex++;
      }
    }
  }

  pcvs = pcvs.map((pcv) => {
    let ris = pcv.replace(/,/g, '');
    ris = ris.replace(/ /g, '');
    return ris;
  });

  if (input.includes('0')) {
    //Zero-one notation
    pcvs = pcvs.map((pcv) => {
      let array = [];
      for (let i = 0; i < pcv.length; i++) {
        array[i] = parseInt(pcv[i]);
      }
      return array;
    });

    return pcvs;
  } else {
    //Integer notation
    let intToBinPcvs = pcvs.map((pcv) => {
      let bin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < pcv.length; i++) {
        bin[pcv[i] - 1] += 1;
      }
      return bin;
    });

    return intToBinPcvs;
  }
}
