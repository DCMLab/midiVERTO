import React, { useState, useEffect, useRef } from 'react';
import WavescapeModule from '../WavescapeModule';
import { prototypesData } from '../prototypesData';
import ResolutionSelector from '../ResolutionSelector';

import Player, { setPlayerMidiData } from '../Player';
import {
  getDftCoeffFromMidi,
  getRgbaMatrix,
  getMidiFileDataObject,
  getDftCoeffStatic,
} from '../getDftMatrices';
import dft from '../DFT';
import parse from '../parser';

import CoefficientsModule from '../CoefficientsModule';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { Divider, Typography } from '@mui/material';

let currentSongBPM = 80;
let currentSongMidiData;

function Application() {
  //State: represents the selected row on the wavescape (by default the first row) for each coeff
  const [tracesData, setTracesData] = useState([]);
  const [currentSubdiv, setCurrentSubdiv] = useState(0);

  //State: contains the color data of the wavescape of a given coeff (Array(6) one for coeff)
  const [wavescapesData, setWavescapesData] = useState([]);

  const [resolutionMode, setResolutionMode] = useState({
    noteResolutionValue: 1,
    seconds: 1,
    useSeconds: false,
  });

  const [file, setFile] = useState('');

  //MIDI parsing on file change
  useEffect(() => {
    let input = document.getElementById('file').files[0];

    if (input) {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(input);
      fileReader.onload = (loadedFile) => {
        let { midiData, midiBpm } = getMidiFileDataObject(
          loadedFile.target.result
        );
        currentSongBPM = midiBpm;
        currentSongMidiData = midiData;

        //Wavescapes static analysis
        let subdivsNumberStatic = 50;
        let staticResolution =
          currentSongMidiData.duration / subdivsNumberStatic;

        setWavescapesData(
          getRgbaMatrix(
            getDftCoeffStatic(currentSongMidiData, staticResolution)
          )
        );

        //Circles dynamic analysis
        //setPlayerMidiData(currentSongMidiData, resolution, setCurrentSubdiv);
      };
    }
  }, [file]);

  useEffect(() => {
    console.log(resolutionMode);
  }, [resolutionMode]);

  return (
    <Container>
      <Player />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
            /* onChange={() => handleShowPrototypes(!showPrototypes)} */
            /* checked={showPrototypes} */
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

      <ResolutionSelector
        setResolutionMode={setResolutionMode}
        resolutionMode={resolutionMode}
      />
      <Button variant='contained' color='primary'>
        Change resolution
      </Button>

      <Container>
        <Divider />
        <WavescapeModule wavescapesData={wavescapesData} />
        <Divider />
        <CoefficientsModule />
      </Container>
    </Container>
  );
}

export default Application;
