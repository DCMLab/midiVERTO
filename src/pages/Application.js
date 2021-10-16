import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import WavescapeModule from '../WavescapeModule';
import ResolutionSelector from '../ResolutionSelector';
import CoefficientsModule from '../CoefficientsModule';

import Player, { setPlayerMidiData } from '../Player';
import {
  getRgbaMatrix,
  getMidiFileDataObject,
  getDftCoeffStatic,
  getDftCoeffDynamic,
} from '../getDftMatrices';
import dft from '../DFT';
import parse from '../parser';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';

let currentSongBPM = 80;
let currentSongMidiData;

function Application() {
  //State: contains the color data of the wavescape of a given coeff (Array(6) one for coeff)
  const [wavescapesData, setWavescapesData] = useState([]);

  //State: represents the selected row on the wavescape (by default the first row) for each coeff
  const [coeffTracesData, setCoeffTracesData] = useState([]);
  const [showPrototypes, setShowPrototypes] = useState(true);
  const [currentSubdiv, setCurrentSubdiv] = useState(0);

  //State: inputs
  const [resolutionMode, setResolutionMode] = useState({
    noteResolutionValue: 1,
    seconds: 1.5,
    useSeconds: false,
  });

  const [userPcvs, setUserPcvs] = useState([]);
  const pcvTextRef = useRef(null);

  const [file, setFile] = useState('');

  //MIDI inputs
  const [midiDevNotesDftCoeffs, setMidiDevNotesDftCoeffs] = useState(
    dft([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map((coeff) => {
      return { x: coeff.re, y: coeff.im };
    })
  );

  //State: error states in input
  const [isInputPcvInvalid, setIsInputPcvInvalid] = useState(false);

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
        let { tracesData, resolution } = getDftCoeffDynamic(
          midiData,
          resolutionMode,
          currentSongBPM
        );
        setCoeffTracesData(tracesData);
        setPlayerMidiData(currentSongMidiData, resolution, setCurrentSubdiv);
      };
    }
  }, [file]);

  function handleSubmitPitchClass(input) {
    //In order not to refresh the page (default behaviuor)
    let parsedInput;

    try {
      parsedInput = parse(input);
    } catch (error) {
      console.log(error.message);
      setIsInputPcvInvalid(true);
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
  }

  //MIDI devices init
  useEffect(() => {
    //INIT
    let currentNotes = [];
    const sampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3',
        C1: 'C1.mp3',
        'D#1': 'Ds1.mp3',
        'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',
        C2: 'C2.mp3',
        'D#2': 'Ds2.mp3',
        'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',
        C3: 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
        C5: 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',
        C6: 'C6.mp3',
        'D#6': 'Ds6.mp3',
        'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',
        C7: 'C7.mp3',
        'D#7': 'Ds7.mp3',
        'F#7': 'Fs7.mp3',
        A7: 'A7.mp3',
        C8: 'C8.mp3',
      },
      release: 1,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
    }).toDestination();
    sampler.volume.value = -30;

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(success, failure);
    }

    function computeDftCoeffs(playedNotes) {
      let pcv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      playedNotes.forEach((note) => {
        let pitch;
        if (note.includes('#')) {
          pitch = note.slice(0, 2);
        } else pitch = pitch = note.slice(0, 1);

        switch (pitch) {
          case 'C':
            pcv[0] += 1;
            break;
          case 'C#':
            pcv[1] += 1;
            break;
          case 'D':
            pcv[2] += 1;
            break;
          case 'D#':
            pcv[3] += 1;
            break;
          case 'E':
            pcv[4] += 1;
            break;
          case 'F':
            pcv[5] += 1;
            break;
          case 'F#':
            pcv[6] += 1;
            break;
          case 'G':
            pcv[7] += 1;
            break;
          case 'G#':
            pcv[8] += 1;
            break;
          case 'A':
            pcv[9] += 1;
            break;
          case 'A#':
            pcv[10] += 1;
            break;
          case 'B':
            pcv[11] += 1;
            break;
          default:
            break;
        }
      });

      let dftCoeffs = dft(pcv);
      dftCoeffs = dftCoeffs.map((coeff) => {
        return { x: coeff.re, y: coeff.im };
      });
      //console.log(dftCoeffs);
      setMidiDevNotesDftCoeffs(dftCoeffs);
    }

    function handleInput(input) {
      const command = input.data[0];
      const note = Tone.Frequency(input.data[1], 'midi').toNote();
      const velocity = Math.round(input.data[2] * 0.05);
      //const velocity = input.data[2];

      switch (command) {
        case 144: //noteOn
          if (velocity > 0) {
            //Note is on
            sampler.triggerAttack(note, Tone.immediate(), velocity);
            currentNotes.push(note);
          } else {
            //Note is off
            sampler.triggerRelease(note, Tone.immediate());
            currentNotes.filter((currentNote) => currentNote !== note);
          }
          break;
        case 128: //noteOff
          sampler.triggerRelease(note, Tone.immediate());
          currentNotes = currentNotes.filter(
            (currentNote) => currentNote !== note
          );
          break;
        default:
          break;
      }

      computeDftCoeffs(currentNotes);
    }

    function success(midiAccess) {
      midiAccess.onstatechange = updateDevices;

      const inputs = midiAccess.inputs;

      inputs.forEach((input) => {
        input.onmidimessage = handleInput;
      });
    }

    function failure() {
      console.log('Could not connect MIDI');
    }

    function updateDevices(event) {
      console.log(
        `Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`
      );
    }
  }, []);

  function toggleShowPrototypes() {
    setShowPrototypes(!showPrototypes);
  }

  function retriggerAnalysis() {
    //Only if there is midi data, retrigger analysis
    if (currentSongMidiData == null) {
      return;
    }

    //Circles dynamic analysis
    let { tracesData, resolution } = getDftCoeffDynamic(
      currentSongMidiData,
      resolutionMode,
      currentSongBPM
    );
    setCoeffTracesData(tracesData);
    setPlayerMidiData(currentSongMidiData, resolution, setCurrentSubdiv);
  }

  return (
    <Container>
      <Player />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              onChange={() => toggleShowPrototypes()}
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
          error={isInputPcvInvalid}
          helperText={isInputPcvInvalid && 'Invalid input'}
          id='outlined-basic'
          label='Pitch class vector'
          variant='outlined'
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleSubmitPitchClass(pcvTextRef.current.value);
              pcvTextRef.current.value = '';
            }
          }}
          onChange={() => {
            setIsInputPcvInvalid(false);
          }}
          inputRef={pcvTextRef}
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
      <Button variant='contained' color='primary' onClick={retriggerAnalysis}>
        Change resolution
      </Button>

      <Container>
        <Divider />
        <WavescapeModule wavescapesData={wavescapesData} />
        <Divider />
        <CoefficientsModule
          coeffTracesData={coeffTracesData}
          currentSubdiv={currentSubdiv}
          showPrototypes={showPrototypes}
          userPcvs={userPcvs}
          midiDevNotesDftCoeffs={midiDevNotesDftCoeffs}
        />
      </Container>
    </Container>
  );
}

export default Application;
