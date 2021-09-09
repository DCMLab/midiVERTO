import React, { useState, useEffect, useRef } from 'react';
import { DrawCircles } from '../DrawCircles';
import { DrawWavescapes } from '../DrawWavescapes';
import { prototypesData } from '../prototypesData';
import Circle from '../Circle';
import Player, { setPlayerMidiData } from './Player';
import { getDftCoeffFromMidi, getRgbaMatrix } from '../getDftMatrices';
import dft from '../DFT';

export default function Visualization() {
  const [selectedProtoPitchClasses, setSelectedProtoPitchClasses] =
    useState(prototypesData);
  const [showPrototypes, setShowPrototypes] = useState(true);

  const [wavescapesData, setWavescapesData] = useState([]);
  const [tracesData, setTracesData] = useState([]);
  const [file, setFile] = useState('');
  const [userPcvs, setUserPcvs] = useState([]);
  const [currentSubdiv, setCurrentSubdiv] = useState(0);
  const [resolution, setResolution] = useState(1);
  const resolutionSliderRef = useRef(null);

  function handleShowPrototypes(showing) {
    let temp = selectedProtoPitchClasses.slice();

    if (showing) temp.push(...prototypesData);
    else temp = [];

    setSelectedProtoPitchClasses(temp);
    setShowPrototypes(showing);
  }

  //MIDI parsing on file change
  useEffect(() => {
    let input = document.getElementById('file').files[0];
    if (input) {
      let resolution = +resolutionSliderRef.current.value;
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(input);
      fileReader.onload = (ris) => {
        setPlayerMidiData(ris.target.result, resolution, setCurrentSubdiv);
        let dftCoeff = getDftCoeffFromMidi(ris.target.result, resolution);
        //Subdividing the first row of the dft coeff matrix to get the trace for each coeff
        let traces = [];
        let firstRow = dftCoeff[0];
        for (let i = 1; i < 7; i++) {
          let temp = [];
          for (let j = 0; j < firstRow.length; j++) {
            temp.push({ x: firstRow[j][i].re, y: firstRow[j][i].im });
          }
          traces.push(temp);
        }
        setTracesData(traces);
        setWavescapesData(getRgbaMatrix(dftCoeff));
        console.log(traces[0].length);
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

    //Subdividing the coeffs for their coeff number
    let subdivUserPcvs = [];
    for (let i = 1; i < 7; i++) {
      let temp = [];
      for (let j = 0; j < dftCoeffsInput.length; j++) {
        temp.push({ x: dftCoeffsInput[j][i].re, y: dftCoeffsInput[j][i].im });
      }
      subdivUserPcvs.push(temp);
    }

    if (userPcvs.length === 0) setUserPcvs(subdivUserPcvs);
    else {
      let temp = userPcvs.slice();
      for (let i = 0; i < userPcvs.length; i++) {
        temp[i].push(...subdivUserPcvs[i]);
      }

      setUserPcvs(temp);
    }
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

      <div>
        <input
          type='range'
          id='resolutin'
          name='resolution'
          defaultValue='1'
          min='1'
          max='10'
          //step='0.1'
          onChange={() => setResolution(resolutionSliderRef.current.value)}
          ref={resolutionSliderRef}
        />
        <label htmlFor='resolution'>Resolution: {resolution}</label>
      </div>

      {/* <DrawCircles
        printablePitchClasses={selectedPitchClasses}
        traceData={traceData}
        userPcv={userPcv}
        currentSubdiv={currentSubdiv}
      /> */}

      <Circle
        protoDataCoeff={selectedProtoPitchClasses[0]}
        traceDataCoeff={tracesData[0]}
        userPcvsCoeff={userPcvs[0]}
        currentSubdiv={currentSubdiv}
      />
      <DrawWavescapes wavescapeMatrix={wavescapesData[0]} />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[1]}
        traceDataCoeff={tracesData[1]}
        userPcvsCoeff={userPcvs[1]}
        currentSubdiv={currentSubdiv}
      />
      <DrawWavescapes wavescapeMatrix={wavescapesData[1]} />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[2]}
        traceDataCoeff={tracesData[2]}
        userPcvsCoeff={userPcvs[2]}
        currentSubdiv={currentSubdiv}
      />
      <DrawWavescapes wavescapeMatrix={wavescapesData[2]} />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[3]}
        traceDataCoeff={tracesData[3]}
        userPcvsCoeff={userPcvs[3]}
        currentSubdiv={currentSubdiv}
      />
      <DrawWavescapes wavescapeMatrix={wavescapesData[3]} />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[4]}
        traceDataCoeff={tracesData[4]}
        userPcvsCoeff={userPcvs[4]}
        currentSubdiv={currentSubdiv}
      />
      <DrawWavescapes wavescapeMatrix={wavescapesData[4]} />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[5]}
        traceDataCoeff={tracesData[5]}
        userPcvsCoeff={userPcvs[5]}
        currentSubdiv={currentSubdiv}
      />
      <DrawWavescapes wavescapeMatrix={wavescapesData[5]} />
    </>
  );
}

function parse(input) {
  let pcvs = [];
  //Vectorial notation, distribution -> real numbers
  const openVect = '(';
  const closeVect = ')';
  //Set notation, integers
  const openSet = '{';
  const closeSet = '}';
  //Number divider
  const divider = ',';

  let isGroup = false;
  let isSet = false;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === openSet || input[i] === openVect) {
      isGroup = true;
      if (input[i] === openSet) isSet = true;
    }

    if (isGroup) {
      let stringGroup = [];
      let count = 1;
      //Slice the current group
      for (
        let j = i + 1;
        input[j] !== closeSet && input[j] !== closeVect;
        j++
      ) {
        stringGroup.push(input[j]);
        count++;
      }

      stringGroup = stringGroup.join('');

      let numeralInput = [];
      count = 0;
      for (let j = 0; j < stringGroup.length; j++) {
        if (stringGroup[j] === divider) {
          let num = stringGroup.slice(j - count, j);
          numeralInput.push(+num);
          count = -1;
        }
        count++;
      }
      //Last element not cover by the for cycle
      let num = stringGroup.slice(
        stringGroup.length - count,
        stringGroup.length
      );
      numeralInput.push(+num);

      if (isSet) {
        let bin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < numeralInput.length; i++) {
          bin[numeralInput[i]] += 1;
        }
        pcvs.push(bin);
      } else {
        pcvs.push(numeralInput);
      }

      isGroup = false;
      isSet = false;
      i += count;
    }
  }

  return pcvs;
}
