import React, { useState, useEffect, useRef } from 'react';
import { Wavescape } from '../Wavescape';
import { prototypesData } from '../prototypesData';
import Circle from '../Circle';
import Player, { setPlayerMidiData } from '../Player';
import { getDftCoeffFromMidi, getRgbaMatrix } from '../getDftMatrices';
import dft from '../DFT';
import parse from '../parser';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function Application() {
  //State: show or hide on the circles pitch class of the prototypes
  const [selectedProtoPitchClasses, setSelectedProtoPitchClasses] =
    useState(prototypesData);
  const [showPrototypes, setShowPrototypes] = useState(true);

  //State: contains the color data of the wavescape of a given coeff (Array(6) one for coeff)
  const [wavescapesData, setWavescapesData] = useState([]);

  //State: represents the selected row on the wavescape (by default the first row) for each coeff
  const [tracesData, setTracesData] = useState([]);
  const [currentSubdiv, setCurrentSubdiv] = useState(0);

  const [file, setFile] = useState('');

  const [userPcvs, setUserPcvs] = useState([]);

  const [resolution, setResolution] = useState(1);
  const resolutionSliderRef = useRef(null);

  const [multiRes, setMultiRes] = useState(1);
  const [seconds, setSeconds] = useState(1);
  const [useSeconds, setUseSeconds] = useState(false);
  const resolutionTextRef = useRef(null);

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

        //Computation of the minimum resolution given time-precision trade off
        /* let mode = {
          userFriendly: 150,
          precise: 250,
          scientific: 400,
          stillBearable: 600,
          goodLuck: 1000,
        }; */

        setPlayerMidiData(res.target.result, resolution, setCurrentSubdiv);
        let dftCoeff = getDftCoeffFromMidi(res.target.result, resolution);

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
    let parsedInput;

    try {
      parsedInput = parse(e.target[0].value);
    } catch (error) {
      console.log(error);
      return;
    }

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
    <Container>
      <Player />
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              onChange={() => handleShowPrototypes(!showPrototypes)}
              checked={showPrototypes}
            />
          }
          label='Show Prototypes'
        />
      </FormGroup>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete='off'
      >
        <TextField
          id='outlined-basic'
          label='Pitch class vector'
          variant='outlined'
        />
      </Box>

      <div>
        <label htmlFor='file'>
          <input
            style={{ display: 'none' }}
            type='file'
            id='file'
            name='file'
            value={file}
            onChange={(e) => setFile(e.target.value)}
          />
          <Button variant='contained' color='primary' component='span'>
            Upload MIDI
          </Button>
        </label>
      </div>

      <FormControl component='fieldset'>
        <FormLabel component='legend'>Resolution</FormLabel>
        <RadioGroup
          row
          defaultValue='quarter'
          onChange={multiResOnChange}
          aria-label='resolution'
          name='row-radio-buttons-group'
        >
          <FormControlLabel
            value='sixteenth'
            control={<Radio />}
            label=' &#119137;'
          />
          <FormControlLabel
            value='eighth'
            control={<Radio />}
            label=' &#119136;'
          />
          <FormControlLabel
            value='quarter'
            control={<Radio />}
            label='&#9833;'
          />
          <FormControlLabel
            value='half'
            control={<Radio />}
            label='&#119134;'
          />
          <FormControlLabel
            value='whole'
            control={<Radio />}
            label='&#119133;'
          />
        </RadioGroup>
      </FormControl>

      <Container>
        <Circle
          protoDataCoeff={selectedProtoPitchClasses[0]}
          traceDataCoeff={tracesData[0]}
          userPcvsCoeff={userPcvs[0]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />
        <Wavescape wavescapeMatrix={wavescapesData[0]} />
        <Circle
          protoDataCoeff={selectedProtoPitchClasses[1]}
          traceDataCoeff={tracesData[1]}
          userPcvsCoeff={userPcvs[1]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />
        <Wavescape wavescapeMatrix={wavescapesData[1]} />
        <Circle
          protoDataCoeff={selectedProtoPitchClasses[2]}
          traceDataCoeff={tracesData[2]}
          userPcvsCoeff={userPcvs[2]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />
        <Wavescape wavescapeMatrix={wavescapesData[2]} />
        <Circle
          protoDataCoeff={selectedProtoPitchClasses[3]}
          traceDataCoeff={tracesData[3]}
          userPcvsCoeff={userPcvs[3]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />
        <Wavescape wavescapeMatrix={wavescapesData[3]} />
        <Circle
          protoDataCoeff={selectedProtoPitchClasses[4]}
          traceDataCoeff={tracesData[4]}
          userPcvsCoeff={userPcvs[4]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />
        <Wavescape wavescapeMatrix={wavescapesData[4]} />
        <Circle
          protoDataCoeff={selectedProtoPitchClasses[5]}
          traceDataCoeff={tracesData[5]}
          userPcvsCoeff={userPcvs[5]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />
        <Wavescape wavescapeMatrix={wavescapesData[5]} />
      </Container>
    </Container>
  );
}

export default Application;
