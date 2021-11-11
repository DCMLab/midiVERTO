import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import WavescapeModule from '../WavescapeModule';
import CoefficientsModule from '../CoefficientsModule';

import Player from '../Player';

import dft from '../DFT';

import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';

//Drawer mui components
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

//Accordion mui components
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//Bottom appbar
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 400;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Application({
  fileName,
  setInAnalysisPage,
  open,
  setOpen,
  wavescapesData,
  coeffTracesData,
  currentSubdiv,
  currentWavescapeSubdiv,
  userPcvs,
}) {
  //State: represents the selected row on the wavescape (by default the first row) for each coeff
  const [showPrototypes, setShowPrototypes] = useState(true);
  const [showMagAndPhase, setShowMagAndPhase] = useState(true);

  //MIDI inputs
  const [midiDevNotesDftCoeffs, setMidiDevNotesDftCoeffs] = useState(
    dft([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map((coeff) => {
      return { x: coeff.re, y: coeff.im };
    })
  );

  //Ref to get the width of the accordion used to computed layout sizes
  const accordionRef = useRef(null);
  const [accordionWidth, setAccordionWidth] = useState(100);
  const [elemsForEachRow, setElemsForEachRow] = useState(6);
  const [elemsWidth, setElemsWidth] = useState(440);

  function changeElementsSize(drawerOffset = 0) {
    let adjustmentFractSizes = 5;

    setElemsWidth(
      (accordionRef.current.clientWidth + drawerOffset) / elemsForEachRow -
        adjustmentFractSizes
    );
  }

  /* function changeElementsSize(drawerOffset = 0) {
    let adjustmentFractSizes = 5;

    setElemsWidth(
      (((accordionRef.current.clientWidth + drawerOffset) / elemsForEachRow -
        adjustmentFractSizes) *
        accordionWidth) /
        100
    );
  } */

  function handleResize() {
    let drawerOffset = 0;
    changeElementsSize(drawerOffset);
  }

  useEffect(() => {
    setInAnalysisPage(true);

    //Open drawer when page loads
    setOpen(true);

    //Minus some pixel for robustness: sometimes width with fractional pixels
    changeElementsSize();

    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    changeElementsSize();
    window.addEventListener('resize', handleResize);
  }, [elemsForEachRow]);

  useEffect(() => {
    let drawerOffset = 0;
    open ? (drawerOffset = -400) : (drawerOffset = +400);
    changeElementsSize(drawerOffset);
  }, [open]);

  useEffect(() => {
    changeElementsSize();
  }, [accordionWidth]);

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

  function toggleShowMagAndPhase() {
    setShowMagAndPhase(!showMagAndPhase);
  }

  return (
    <Box>
      <Box
        sx={{
          padding: 0,
          margin: 'auto',
          marginBottom: '70px',
          width: `${accordionWidth}%`,
        }}
      >
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography variant='h6'>Wavescape</Typography>
          </AccordionSummary>
          <AccordionDetails ref={accordionRef} sx={{ padding: 0 }}>
            <WavescapeModule
              wavescapesData={wavescapesData}
              currentWavescapeSubdiv={currentWavescapeSubdiv}
              elemsWidth={elemsWidth}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel2a-content'
            id='panel2a-header'
          >
            <Typography variant='h6'>Fourier Coefficients</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <CoefficientsModule
              coeffTracesData={coeffTracesData}
              currentSubdiv={currentSubdiv}
              showPrototypes={showPrototypes}
              showMagAndPhase={showMagAndPhase}
              userPcvs={userPcvs}
              midiDevNotesDftCoeffs={midiDevNotesDftCoeffs}
              elemsWidth={elemsWidth}
            />
          </AccordionDetails>
        </Accordion>
      </Box>

      <AppBar
        position='fixed'
        open={open}
        color='secondary'
        sx={{ top: 'auto', bottom: 0, maxHeight: '74px' }}
      >
        <Toolbar>
          <Player
            fileName={fileName}
            currentWavescapeSubdiv={currentWavescapeSubdiv}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: '2% 5%',
              maxWidth: '100px',
              justifyContent: 'space-evenly',
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => toggleShowPrototypes()}
                    checked={showPrototypes}
                    size='small'
                  />
                }
                label={<Typography noWrap={true}>Show Prototypes</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => toggleShowMagAndPhase()}
                    checked={showMagAndPhase}
                    size='small'
                  />
                }
                label={
                  <Typography noWrap={true}>Show &mu; and &phi;</Typography>
                }
              />
            </FormGroup>
          </Box>
          <Box sx={{ minWidth: '20%', padding: '1% 3% 1% 2%' }}>
            <Typography>Plots size</Typography>
            <Slider
              min={20}
              max={100}
              value={accordionWidth}
              defaultValue={100}
              aria-label='Plots size'
              valueLabelDisplay='auto'
              onChange={(event, value) => {
                setAccordionWidth(value);
              }}
              marks={[
                { value: 20, label: '20%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
            />
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl size='small' variant='standard' fullWidth>
              <InputLabel>Layout</InputLabel>
              <Select
                value={elemsForEachRow}
                label='Layout'
                onChange={(event) => {
                  setAccordionWidth(100);
                  setElemsForEachRow(event.target.value);
                }}
              >
                <MenuItem value={6}>1x6</MenuItem>
                <MenuItem value={3}>2x3</MenuItem>
                <MenuItem value={2}>3x2</MenuItem>
                <MenuItem value={1}>6x1</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Application;
