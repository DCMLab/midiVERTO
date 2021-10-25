import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import WavescapeModule from '../WavescapeModule';
import ResolutionSelector from '../ResolutionSelector';
import CoefficientsModule from '../CoefficientsModule';
import PcvChipsBox from '../PcvChipsBox';

//TO BE REMOVED
import Navbar from '../Navbar';

import Player, { setPlayerMidiData } from '../Player';
import {
  getComplementaryColours,
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

//Drawer components
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

//Accordion components
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const drawerWidth = 400;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

//Song variables
let currentSongBPM = 80;
let currentSongMidiData;
let fileName;

function Application() {
  //Show/hide controls drawer
  const theme = useTheme();
  const [open, setOpen] = useState(true);

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //MIDI parsing on file change
  useEffect(() => {
    let input = document.getElementById('file').files[0];

    input ? (fileName = input.name) : (fileName = '');

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
    let userPcvObjects = [];

    try {
      parsedInput = parse(input);
    } catch (error) {
      console.log(error.message);
      setIsInputPcvInvalid(true);
      return;
    }

    parsedInput.forEach((input) =>
      userPcvObjects.push({
        label: `(${input})`,
        isDisabled: false,
        coeffs: dft(input, true, true, false),
      })
    );

    userPcvObjects.forEach((pcvData) => {
      pcvData.colours = getComplementaryColours(pcvData.coeffs);
    });

    //Check if we are adding an input already inserted
    let labels = userPcvs.map((pcvData) => pcvData.label);
    labels.forEach((label) => {
      userPcvObjects = userPcvObjects.filter(
        (pcvObj) => pcvObj.label !== label
      );
    });

    setUserPcvs([...userPcvs, ...userPcvObjects]);
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

  //Init user pcv examples
  useEffect(() => {
    let examplePcvs = [
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0], // C
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0], // Cmin
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0], // Cdim
    ];

    let exPcvObjects = examplePcvs.map((pcv) => {
      return {
        label: `(${pcv.toString()})`,
        isDisabled: false,
        coeffs: dft(pcv, true, true, false),
      };
    });

    exPcvObjects.forEach((pcvData) => {
      pcvData.colours = getComplementaryColours(pcvData.coeffs);
    });

    exPcvObjects[1].isDisabled = true;
    exPcvObjects[2].isDisabled = true;
    setUserPcvs(exPcvObjects);
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
    <Box sx={{ display: 'flex' }}>
      {/*  <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <Box
            component='div'
            sx={{
              display: 'flex',
              flexGrow: 1,
              alignItems: 'baseline',
            }}
          >
            <Typography noWrap={true} sx={{ flexGrow: 2 }}>
              {file ? fileName : 'input file'}
            </Typography>
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
                Upload
              </Button>
            </label>
          </Box>
          {/* <Typography variant='h3' component='div' sx={{ flexGrow: 1 }}>
            Mi_DFT
          </Typography> */}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Player
          songLen={coeffTracesData.length !== 0 ? coeffTracesData[0].length : 0}
          currentSubdiv={currentSubdiv}
        />
        <PcvChipsBox userPcvs={userPcvs} setUserPcvs={setUserPcvs} />

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

        <Box component='form' noValidate autoComplete='off'>
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

        <ResolutionSelector
          setResolutionMode={setResolutionMode}
          resolutionMode={resolutionMode}
        />
        <Button variant='contained' color='primary' onClick={retriggerAnalysis}>
          Change resolution
        </Button>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          edge='start'
          sx={{ margin: 0, padding: 0, ...(open && { display: 'none' }) }}
        >
          <ChevronRightIcon />
        </IconButton>
        <Container sx={{ margin: 0, padding: 0 }}>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography variant='h6'>Wavescape</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <WavescapeModule wavescapesData={wavescapesData} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel2a-content'
                id='panel2a-header'
              >
                <Typography variant='h6'>Fourier Coefficients</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CoefficientsModule
                  coeffTracesData={coeffTracesData}
                  currentSubdiv={currentSubdiv}
                  showPrototypes={showPrototypes}
                  userPcvs={userPcvs}
                  midiDevNotesDftCoeffs={midiDevNotesDftCoeffs}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </Container>
      </Main>
    </Box>
  );
}

export default Application;
