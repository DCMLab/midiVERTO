import Navbar from './Navbar';
import { HashRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect, useRef } from 'react';

import { setPlayerMidiData } from './Player';
import {
  getComplementaryColours,
  getRgbaMatrix,
  getMidiFileDataObject,
  getDftCoeffStatic,
  getDftCoeffDynamic,
} from './getDftMatrices';
import dft from './DFT';
import parse from './parser';
import { getRosePoints } from './roses';

import ResolutionSelector from './ResolutionSelector';
import PcvChipsBox from './PcvChipsBox';

//Pages
import Home from './pages/Home';
import Theory from './pages/Theory';
import Analysis from './pages/Analysis';

//Test
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';

const drawerWidth = 400;

//Song variables
let currentSongBPM = 80;
let currentSongMidiData;
let fileName;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#e0e0e0',
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
      backgroundColor: '#e0e0e0',
    }),
  })
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

function App() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState('');
  //State: contains the color data of the wavescape of a given coeff (Array(6) one for coeff)
  const [wavescapesData, setWavescapesData] = useState([]);

  //State: represents the selected row on the wavescape (by default the first row) for each coeff
  const [coeffTracesData, setCoeffTracesData] = useState([]);
  const [currentSubdiv, setCurrentSubdiv] = useState(0);

  //State: inputs
  const [resolutionMode, setResolutionMode] = useState({
    noteResolutionValue: 1,
    seconds: 1.5,
    useSeconds: false,
  });
  const [wavescapeResolution, setWavescapeResolution] = useState(10);
  const [circleResolution, setCircleResolution] = useState(1);

  const [userPcvs, setUserPcvs] = useState([]);
  const pcvTextRef = useRef(null);

  //State: error states in input
  const [isInputPcvInvalid, setIsInputPcvInvalid] = useState(false);

  //State: in analysis page flag
  const [inAnalysisPage, setInAnalysisPage] = useState(false);

  //State: usable/used roses for pcvs' labels
  const [rosesMat, setRosesMat] = useState([]);

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
        rosePoints: [],
        n: -1,
        d: -1,
      })
    );

    //Check if we are adding an input already inserted
    let labels = userPcvs.map((pcvData) => pcvData.label);
    labels.forEach((label) => {
      userPcvObjects = userPcvObjects.filter(
        (pcvObj) => pcvObj.label !== label
      );
    });

    //Assing an unused rose to each pcv
    userPcvObjects.forEach((pcvData) => {
      let found = false;

      for (let i = 0; i < rosesMat.length && !found; i++) {
        for (let j = 0; j < rosesMat[i].length && !found; j++) {
          if (rosesMat[i][j].usable && !rosesMat[i][j].used) {
            found = true;
            pcvData.rosePoints = rosesMat[i][j].points;
            rosesMat[i][j].used = true;
            pcvData.n = rosesMat[i][j].n;
            pcvData.d = rosesMat[i][j].d;
          }
        }
      }
    });

    setUserPcvs([...userPcvs, ...userPcvObjects]);
  }

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
        setWavescapeResolution(staticResolution);

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
        setCircleResolution(resolution);
        setCoeffTracesData(tracesData);
        setPlayerMidiData(currentSongMidiData, resolution, setCurrentSubdiv);

        console.log(midiData);
      };
    }
  }, [file]);

  //Init roseMatrix and user pcv examples
  useEffect(() => {
    let initMatrix = [];
    for (let i = 1; i <= 7; i++) {
      let temp = [];
      for (let j = 1; j <= 7; j++) {
        let rose = { n: j, d: i, used: false, usable: true, points: [] };
        if (j % i === 0 && i !== 1) rose.usable = false;

        if (rose.usable === true) rose.points = getRosePoints(j, i);

        temp.push(rose);
      }
      initMatrix.push(temp);
    }

    //(0,0) or n=1, d=1 can't be used since it is a simple circle
    initMatrix[0][0].usable = false;

    setRosesMat(initMatrix);

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
        rosePoints: [],
        n: -1,
        d: -1,
      };
    });

    //Assing an unused rose to each pcv
    exPcvObjects.forEach((pcvData) => {
      let found = false;

      for (let i = 0; i < initMatrix.length && !found; i++) {
        for (let j = 0; j < initMatrix[i].length && !found; j++) {
          if (initMatrix[i][j].usable && !initMatrix[i][j].used) {
            found = true;
            pcvData.rosePoints = initMatrix[i][j].points;
            initMatrix[i][j].used = true;
            pcvData.n = initMatrix[i][j].n;
            pcvData.d = initMatrix[i][j].d;
          }
        }
      }
    });

    exPcvObjects[1].isDisabled = true;
    exPcvObjects[2].isDisabled = true;

    setUserPcvs(exPcvObjects);
  }, []);

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
    setCircleResolution(resolution);
    setCoeffTracesData(tracesData);
    setPlayerMidiData(currentSongMidiData, resolution, setCurrentSubdiv);
  }

  return (
    <>
      <HashRouter>
        <CssBaseline />
        <Navbar
          open={open}
          setOpen={setOpen}
          setInAnalysisPage={setInAnalysisPage}
          inAnalysisPage={inAnalysisPage}
        />
        <Box sx={{ display: 'flex' }}>
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
              <Stack sx={{ flexGrow: '2', maxWidth: '85%' }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  Upload a midi file
                </Typography>
                <Stack
                  spacing={2}
                  direction='row'
                  sx={{ alignItems: 'center' }}
                >
                  <label htmlFor='file'>
                    <input
                      style={{ display: 'none' }}
                      type='file'
                      id='file'
                      name='file'
                      value={file}
                      onChange={(e) => setFile(e.target.value)}
                    />
                    <Button
                      variant='contained'
                      size='small'
                      color='primary'
                      component='span'
                    >
                      Upload
                    </Button>
                  </label>
                  <Typography
                    noWrap={true}
                    color={fileName ? 'primary' : 'error'}
                  >
                    {file ? fileName : 'No midi file uploaded'}
                  </Typography>
                </Stack>
              </Stack>

              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                margin: '2% 5%',
                width: '90%',
                justifyContent: 'space-evenly',
              }}
            >
              <ResolutionSelector
                setResolutionMode={setResolutionMode}
                resolutionMode={resolutionMode}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={retriggerAnalysis}
                sx={{ width: '10%' }}
              >
                Change
              </Button>
            </Box>
            <Divider />
            <Box
              sx={{
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'center',
                margin: '3% 5%',
                height: '50%',
                justifyContent: 'space-evenly',
              }}
              component='form'
              noValidate
              autoComplete='off'
            >
              <Typography sx={{ fontSize: 17, paddingBottom: 1 }}>
                Custom Pitch-Class Vectors
              </Typography>
              <TextField
                /* sx={{ minHeight: '5rem' }} */
                fullWidth
                label={'margin="dense"'}
                error={isInputPcvInvalid}
                helperText={isInputPcvInvalid && 'Invalid input'}
                id='outlined-basic'
                label='e.g. {0,0,4,7,10} (2,0,0,0,1,0,0,1,0,0,1,0)'
                variant='outlined'
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSubmitPitchClass(pcvTextRef.current.value);
                    pcvTextRef.current.value = '';
                  }
                }}
                onChange={() => {
                  setIsInputPcvInvalid(false);
                }}
                inputRef={pcvTextRef}
              />
              <PcvChipsBox
                userPcvs={userPcvs}
                setUserPcvs={setUserPcvs}
                rosesMat={rosesMat}
              />
            </Box>
            <Divider />
            <Box sx={{ margin: '10px 10px' }}>
              <Typography sx={{ fontSize: 17, paddingLeft: 1 }}>
                Legend of coefficients
              </Typography>
              <Paper>
                <Stack>
                  <Stack direction='row'>
                    <svg width='24' height='24' viewBox='0 0 24 24'>
                      <circle cx='12' cy='12' r='6' fill='black' />
                    </svg>
                    MIDI file segments
                  </Stack>
                  <Stack direction='row'>
                    <svg width='24' height='24' viewBox='0 0 24 24'>
                      <circle cx='12' cy='12' r='5' fill='white' />
                      <circle
                        cx='12'
                        cy='12'
                        r='5'
                        fill='none'
                        stroke='black'
                        strokeWidth='3px'
                      />
                    </svg>
                    MIDI playback
                  </Stack>
                  <Stack direction='row'>
                    <svg width='24' height='24' viewBox='0 0 24 24'>
                      <circle cx='12' cy='12' r='6' fill='teal' />
                    </svg>
                    MIDI controller input
                  </Stack>
                  <Stack direction='row'>
                    <svg width='24' height='24' viewBox='0 0 24 24'>
                      <circle
                        cx='12'
                        cy='12'
                        r='7'
                        fill='none'
                        stroke='grey'
                        strokeWidth='2px'
                      />
                    </svg>
                    Prototypes
                  </Stack>
                  <Stack direction='row'>
                    <svg width='24' height='24' viewBox='0 0 24 24'>
                      {rosesMat.length > 0 ? (
                        <polyline
                          transform={`translate(${12},${12})`}
                          fill='none'
                          stroke='black'
                          strokeWidth='1px'
                          points={rosesMat[3][0].points}
                        />
                      ) : null}
                    </svg>
                    Custom Pitch-Class Vectors
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          </Drawer>
          <Main open={open}>
            <Switch>
              <Route
                exact
                path='/'
                render={() => (
                  <Home
                    setOpen={setOpen}
                    setInAnalysisPage={setInAnalysisPage}
                  ></Home>
                )}
              ></Route>
              <Route
                exact
                path='/theory'
                render={() => (
                  <Theory
                    setOpen={setOpen}
                    setInAnalysisPage={setInAnalysisPage}
                  ></Theory>
                )}
              ></Route>
              <Route
                exact
                path='/analysis'
                render={() => (
                  <Analysis
                    fileName={fileName}
                    setInAnalysisPage={setInAnalysisPage}
                    open={open}
                    setOpen={setOpen}
                    wavescapesData={wavescapesData}
                    coeffTracesData={coeffTracesData}
                    currentSubdiv={currentSubdiv}
                    currentWavescapeSubdiv={Math.floor(
                      (currentSubdiv * circleResolution) / wavescapeResolution
                    )}
                    userPcvs={userPcvs}
                  />
                )}
              ></Route>
            </Switch>
          </Main>
        </Box>
      </HashRouter>
    </>
  );
}

export default App;
