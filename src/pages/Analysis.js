import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import WavescapeModule from '../WavescapeModule';
import CoefficientsModule from '../CoefficientsModule';

import Player from '../Player';

import dft from '../DFT';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

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

  //MIDI inputs
  const [midiDevNotesDftCoeffs, setMidiDevNotesDftCoeffs] = useState(
    dft([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map((coeff) => {
      return { x: coeff.re, y: coeff.im };
    })
  );

  //Ref to get the width of the accordion used to computed layout sizes
  const accordionRef = useRef(null);
  const [elemsForEachRow, setElemsForEachRow] = useState(6);
  const [elemsWidth, setElemsWidth] = useState(440);

  useEffect(() => {
    setInAnalysisPage(true);

    //Open drawer when page loads
    setOpen(true);

    //Minus some pixel for robustness: sometimes width with fractional pixels
    setElemsWidth(accordionRef.current.clientWidth / elemsForEachRow - 6);

    //Resize plot when window changes size
    function handleResize() {
      setElemsWidth(accordionRef.current.clientWidth / elemsForEachRow - 6);
    }

    window.addEventListener('resize', handleResize);
  }, []);

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

  return (
    <Box>
      <Box sx={{ padding: 0, margin: '0 0 70px 0' }}>
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
        sx={{ top: 'auto', bottom: 0 }}
      >
        <Toolbar>
          <Player currentWavescapeSubdiv={currentWavescapeSubdiv} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: '2% 5%',
              width: '30%',
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
                label='Show Prototypes'
              />
            </FormGroup>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Application;
