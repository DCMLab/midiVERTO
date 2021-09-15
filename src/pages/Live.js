import React, { useState, useEffect, useRef } from 'react';
import { prototypesData } from '../prototypesData';
import LiveCircle from '../LiveCircle';
import Player, { setPlayerMidiData } from '../Player';
import { getDftCoeffFromMidiLinear } from '../getDftMatrices';

export default function Live() {
  //State: show or hide on the circles pitch class of the prototypes
  const [selectedProtoPitchClasses, setSelectedProtoPitchClasses] =
    useState(prototypesData);
  const [showPrototypes, setShowPrototypes] = useState(true);

  const [multiRes, setMultiRes] = useState(1);
  const [seconds, setSeconds] = useState(1);
  const [useSeconds, setUseSeconds] = useState(false);
  const resolutionTextRef = useRef(null);

  //State: represents the selected row on the wavescape (by default the first row) for each coeff
  const [tracesData, setTracesData] = useState([]);
  const [currentSubdiv, setCurrentSubdiv] = useState(0);
  const [deltaTime, setDeltaTime] = useState(0);

  const [file, setFile] = useState('');

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
      //let resolution = +resolutionSliderRef.current.value;
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(input);
      fileReader.onload = (res) => {
        //Once the file is loaded
        let { dftCoeffsLinear, resolution } = getDftCoeffFromMidiLinear(
          res.target.result,
          multiRes,
          seconds,
          useSeconds
        );
        setDeltaTime(resolution);
        setPlayerMidiData(res.target.result, resolution, setCurrentSubdiv);

        //Subdividing the first row of the dft coeff matrix to get the trace for each coeff
        let traces = [];
        let firstRow = dftCoeffsLinear[0];
        for (let i = 1; i < 7; i++) {
          let temp = [];
          for (let j = 0; j < firstRow.length; j++) {
            temp.push({ x: firstRow[j][i].re, y: firstRow[j][i].im });
          }
          traces.push(temp);
        }
        setTracesData(traces);
      };
    }
  }, [file]);

  const handleSubmit = (e) => {
    //In order not to refresh the page (default behaviuor)
    e.preventDefault();
  };

  function multiResOnChange(event) {
    switch (event.target.value) {
      case 'sixteenth':
        setMultiRes(0.25);
        setUseSeconds(false);
        break;
      case 'eighth':
        setMultiRes(0.5);
        setUseSeconds(false);
        break;
      case 'quarter':
        setMultiRes(1);
        setUseSeconds(false);
        break;
      case 'half':
        setMultiRes(2);
        setUseSeconds(false);
        break;
      case 'whole':
        setMultiRes(4);
        setUseSeconds(false);
        break;
      case 'seconds':
        setUseSeconds(true);
        let sec = setSeconds(parseFloat(resolutionTextRef.current.value));
        break;
      default:
        setMultiRes(1);
        break;
    }
  }

  return (
    <>
      <Player />
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
        </div>
      </form>

      <div style={{ fontSize: '40px' }} onChange={multiResOnChange}>
        <input type='radio' id='resChoice1' name='multiRes' value='sixteenth' />
        <label htmlFor='resChoice1'> &#119137;</label>

        <input type='radio' id='resChoice2' name='multiRes' value='eighth' />
        <label htmlFor='resChoice2'>&#119136;</label>

        <input
          type='radio'
          id='resChoice3'
          name='multiRes'
          value='quarter'
          defaultChecked
        />
        <label htmlFor='resChoice3'>&#9833;</label>

        <input type='radio' id='resChoice4' name='multiRes' value='half' />
        <label htmlFor='resChoice4'>&#119134;</label>

        <input type='radio' id='resChoice5' name='multiRes' value='whole' />
        <label htmlFor='resChoice5'>&#119133;</label>

        <input type='radio' id='resChoice6' name='multiRes' value='seconds' />
        <label htmlFor='resChoice5' style={{ fontSize: '15px' }}>
          in seconds
        </label>
      </div>

      <div>
        <label htmlFor='resolutionSeconds'>Resolution (seconds): </label>
        <input
          type='text'
          name='resolutionSeconds'
          id='resolutionSeconds'
          autoComplete='off'
          placeholder='Ex. 1.5'
          onChange={() => {
            setSeconds(parseFloat(resolutionTextRef.current.value));
          }}
          ref={resolutionTextRef}
        />
      </div>

      <LiveCircle
        protoDataCoeff={selectedProtoPitchClasses[0]}
        traceDataCoeff={tracesData[0]}
        currentSubdiv={currentSubdiv}
        deltaTime={deltaTime}
      />
      <LiveCircle
        protoDataCoeff={selectedProtoPitchClasses[1]}
        traceDataCoeff={tracesData[1]}
        currentSubdiv={currentSubdiv}
        deltaTime={deltaTime}
      />
      <LiveCircle
        protoDataCoeff={selectedProtoPitchClasses[2]}
        traceDataCoeff={tracesData[2]}
        currentSubdiv={currentSubdiv}
        deltaTime={deltaTime}
      />
      <LiveCircle
        protoDataCoeff={selectedProtoPitchClasses[3]}
        traceDataCoeff={tracesData[3]}
        currentSubdiv={currentSubdiv}
        deltaTime={deltaTime}
      />
      <LiveCircle
        protoDataCoeff={selectedProtoPitchClasses[4]}
        traceDataCoeff={tracesData[4]}
        currentSubdiv={currentSubdiv}
        deltaTime={deltaTime}
      />
      <LiveCircle
        protoDataCoeff={selectedProtoPitchClasses[5]}
        traceDataCoeff={tracesData[5]}
        currentSubdiv={currentSubdiv}
        deltaTime={deltaTime}
      />
    </>
  );
}
