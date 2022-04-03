//React
import { HashRouter, Route, Switch } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

//Import functions
import { setPlayerMidiData } from './Player';
import {
  getRgbaMatrix,
  getMidiFileDataObject,
  getDftCoeffStatic,
  getDftCoeffDynamic,
  sumCentered,
  sumIncremental,
  powerCentered,
} from './getDftMatrices';
import dft from './DFT';
import parse from './parser';
import { getRosePoints } from './roses';

//Import components
import Navbar from './Navbar';
import ResolutionSelector from './ResolutionSelector';
import PcvChipsBox from './PcvChipsBox';
import SaveDialog from './SaveDialog';

//Import pages
import Home from './pages/Home';
import Theory from './pages/Theory';
import Analysis from './pages/Analysis';

//Import material UI components
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//Change this varible to change the size
//of the Drawer component on the left
const drawerWidth = 400;

//Song variables
let currentSongBPM = 80;
let currentSongMidiData;
let fileName;

//Drawer animation
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

//Custom style for Drawer header
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

//Main component
function App() {
  const theme = useTheme();

  // ----- STATES ----- //

  //GENERAL STATES

  //State: boolean
  //If true the Drawer is opened.
  const [open, setOpen] = useState(false);
  //State: string
  //File path MIDI.
  const [file, setFile] = useState('');
  //State: boolean
  //Close or open the Drawer whenever the user move to another page.
  const [inAnalysisPage, setInAnalysisPage] = useState(false);

  //ANALYSIS STATES

  //State: string[6][50]
  //RGBA data of the wavescapes, from 1st to 6th coefficient.
  const [wavescapesData, setWavescapesData] = useState([]);
  //State: points[6][N]
  //Points in the Fourier spaces (from 1st to 6th) related
  //to pcvs extraced from subdivisions with the selected resolution.
  const [coeffTracesData, setCoeffTracesData] = useState([]);
  //State: PCV[N]]
  //Unnormalized PC distributions for the current song
  const [pcDistributions, setPcDistributions] = useState([]);
  //State: points[6][N]
  //Windowed version of coeffTracesData.
  const [windowedCoeffTraces, setWindowedCoeffTraces] = useState([]);
  //State: integer
  //Current subdivision being played by the MIDI player,
  //second index of coeffTracesData[1:6][currentSubdiv].
  const [currentSubdiv, setCurrentSubdiv] = useState(0);
  const [mapCurrentSubdiv, setMapCurrentSubdiv] = useState(0);
  //State: integer
  //Multiplicative factor of base time resolution.
  const [windowLen, setWindowLen] = useState(1);
  //State: object
  //Changed only by ResolutionSelector component.
  //noteResolutionValue: number, 1 is quarter note, 0.5 is eighth note...
  //seconds: custom resolution in seconds
  //useSeconds: use seconds attribute when true
  const [resolutionMode, setResolutionMode] = useState({
    noteResolutionValue: 1,
    seconds: 1.5,
    useSeconds: false,
  });
  //State: number
  //Computed in order to have always 50 subdivisions for the wavescape,
  //trade-off between MIDI file duration and minimum resolution since
  //computing wavescapes presents high time complexity.
  //Initial value of 10 is arbitrary and never used.
  const [wavescapeResolution, setWavescapeResolution] = useState(10);
  //State: number
  //Can be controlled by the user. Resolution used to compute the
  //coefficients in the Fourier spaces without computing the whole wavescape.
  const [circleResolution, setCircleResolution] = useState(1);
  //State: string
  //Specify the type of normalization to use for windowing: sum, power
  const [normalizationType, setNormalizationType] = useState('sum');
  //State: string
  //Specify the type of windowing: centered, incremental
  const [windowingType, setWindowingType] = useState('centered');
  const [normWindSelectedVal, setNormWindSelectedVal] = useState(0);

  //INPUT STATES

  //State: boolean
  //True if the text field input of the window length is an invalid string.
  const [invalidWndLen, setInvalidWndLen] = useState(false);
  //State: string
  //Current string in the text field input of the window length.
  const [textfieldWndLen, setTextfieldWndLen] = useState('1');
  //State: array
  //Contains all the pcvs inserted by the user.
  //label: string representing the pcv
  //coeffs: points in the 6 Fourier spaces
  //n,d: num and den, indexes of the rose matrix
  //rosePoints: points that form the rose's shape
  const [userPcvs, setUserPcvs] = useState([]);
  const pcvTextRef = useRef(null);
  //State: boolean
  //If pcv input parser throw an error, this state is true --> show error
  const [isInputPcvInvalid, setIsInputPcvInvalid] = useState(false);
  //State: matrix
  //Matrix that tracks if with a given index can be used or
  //it is already in use.
  const [rosesMat, setRosesMat] = useState([]);

  //Effect: when currentSubdiv changes map
  //coeffTracesData's subdivs to windowedCoeffTraces' subdivs --> centerd window
  useEffect(() => {
    if (windowedCoeffTraces.length > 0) {
      switch (windowingType) {
        case 'centered':
          let halfWindowLen = Math.floor(windowLen / 2);
          let mappedSubdiv = 0;
          if (currentSubdiv >= windowedCoeffTraces[0].length + halfWindowLen)
            mappedSubdiv = windowedCoeffTraces[0].length - 1;
          else if (currentSubdiv <= halfWindowLen) mappedSubdiv = 0;
          else mappedSubdiv = currentSubdiv - halfWindowLen;

          setMapCurrentSubdiv(mappedSubdiv);

          break;

        case 'incremental':
          if (currentSubdiv >= coeffTracesData[0].length)
            setMapCurrentSubdiv(coeffTracesData[0].length - 1);
          else setMapCurrentSubdiv(currentSubdiv);
          break;

        default:
          break;
      }
    }
  }, [currentSubdiv]);

  //Effect: when window length is changed,
  //recompute the trace to be visualized
  useEffect(() => {
    let windowedTraces;

    if (windowLen === 1) setWindowedCoeffTraces(coeffTracesData);
    else {
      switch (normWindSelectedVal) {
        case 0:
          windowedTraces = sumCentered(pcDistributions, windowLen);
          break;
        case 1:
          windowedTraces = sumIncremental(pcDistributions, windowLen);
          break;
        case 2:
          windowedTraces = powerCentered(pcDistributions, windowLen);
          break;
        default:
          break;
      }

      setWindowedCoeffTraces(windowedTraces);
    }
  }, [windowLen, coeffTracesData, normWindSelectedVal]);

  //Pitch class vector submit function handler
  function handleSubmitPitchClass(input) {
    //Parse the input
    let parsedInput;
    let userPcvObjects = [];

    try {
      parsedInput = parse(input);
    } catch (error) {
      console.log(error.message);
      setIsInputPcvInvalid(true);
      return;
    }

    //Create new pcv object
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

      //If the are no available roses, return without changing anything
      if (!found) return;
    });

    //Update the state with the new pcvs
    setUserPcvs([...userPcvs, ...userPcvObjects]);
  }

  //Effect: MIDI analysis on file change
  useEffect(() => {
    //Get the uploaded file
    let input = document.getElementById('file').files[0];

    //Parse the MIDI file
    if (input) {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(input);
      fileReader.onload = (loadedFile) => {
        try {
          let { midiData, midiBpm } = getMidiFileDataObject(
            loadedFile.target.result
          );

          //Set song variables
          currentSongBPM = midiBpm;
          currentSongMidiData = midiData;
          fileName = input.name;

          //Wavescapes "static" analysis --> 50 subdivs
          let subdivsNumberStatic = 50;
          let staticResolution =
            currentSongMidiData.duration / subdivsNumberStatic;
          setWavescapeResolution(staticResolution);

          setWavescapesData(
            getRgbaMatrix(getDftCoeffStatic(midiData, staticResolution))
          );

          //Circles "dynamic" analysis --> single traces in the Fourier spaces
          let { tracesData, resolution, currPcDistributions } =
            getDftCoeffDynamic(
              midiData,
              resolutionMode,
              currentSongBPM,
              normalizationType
            );
          setCircleResolution(resolution);
          setCoeffTracesData(tracesData);
          setPcDistributions(currPcDistributions);
          setPlayerMidiData(currentSongMidiData, resolution, setCurrentSubdiv);
          setWindowLen(1);
          setTextfieldWndLen('1');

          //console.log(midiData);
        } catch (error) {
          console.log(error);
          return;
        }
      };
    }
  }, [file]);

  //Effect: init roseMatrix and user pcv examples
  useEffect(() => {
    //7x7 matrix
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

    //Examples
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

    //2 disabled pcvs to show that there is the possibility to disable them
    exPcvObjects[1].isDisabled = true;
    exPcvObjects[2].isDisabled = true;

    setUserPcvs(exPcvObjects);
  }, []);

  //Close Drawer function handler
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    retriggerAnalysis();
  }, [normWindSelectedVal]);

  //Re-compute the analysis when clicking on "Change" button in the Drawer
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
    setWindowLen(1);
    setTextfieldWndLen('1');
    setPlayerMidiData(currentSongMidiData, resolution, setCurrentSubdiv);
  }

  return (
    <HashRouter>
      <CssBaseline />

      <Navbar
        open={open}
        setOpen={setOpen}
        setInAnalysisPage={setInAnalysisPage}
        inAnalysisPage={inAnalysisPage}
      />

      <Box sx={{ display: 'flex' }}>
        {/* DRAWER */}
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
          {/* DRAWER HEADER  */}
          <DrawerHeader>
            <Stack sx={{ flexGrow: '2', maxWidth: '85%', marginBottom: 1 }}>
              <Typography sx={{ fontWeight: 'bold' }}>
                Upload a midi file
              </Typography>
              <Stack spacing={2} direction='row' sx={{ alignItems: 'center' }}>
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
                  {wavescapesData.length > 0
                    ? fileName
                    : 'No midi file uploaded'}
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

          {/* TIME RESOLUTION MODULE */}
          <Typography sx={{ marginLeft: 1, marginTop: 1, fontWeight: 'bold' }}>
            Time resolution
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: '2% 5% 0 2%',
              width: '90%',
              justifyContent: 'space-evenly',
            }}
          >
            <ResolutionSelector
              setResolutionMode={setResolutionMode}
              resolutionMode={resolutionMode}
              retriggerAnalysis={retriggerAnalysis}
            />
          </Box>
          <Divider />

          {/* WINDOW LENGTH MODULE */}
          <Typography
            sx={{
              marginLeft: 1,
              marginTop: 1,
              fontWeight: 'bold',
            }}
          >
            Window Length
          </Typography>
          <Stack
            sx={{ margin: 'auto', marginBottom: 1, marginTop: 1 }}
            direction='row'
          >
            <Typography
              sx={{
                marginLeft: 1,
                paddingTop: '5px',
                marginRight: '5px',
                fontSize: '18px',
              }}
              variant='h5'
              gutterBottom
            >{`=`}</Typography>
            <TextField
              inputProps={{ style: { textAlign: 'center' } }}
              sx={{ width: '15%' }}
              error={invalidWndLen}
              onChange={(event) => {
                setTextfieldWndLen(event.target.value);
                let input = parseInt(event.target.value);
                if (isNaN(input)) {
                  setInvalidWndLen(true);
                } else {
                  setInvalidWndLen(false);
                  if (coeffTracesData.length > 0) {
                    if (input < 1) {
                      setInvalidWndLen(true);
                      setWindowLen(1);
                    } else if (input > coeffTracesData[0].length) {
                      setInvalidWndLen(true);
                      setWindowLen(coeffTracesData[0].length);
                    } else setWindowLen(input);
                  } else {
                    setWindowLen(input);
                  }
                }
              }}
              value={textfieldWndLen}
              variant='standard'
            />
            <Typography
              sx={{
                marginLeft: 1,
                paddingTop: '5px',
                fontSize: '18px',
              }}
              variant='h5'
              gutterBottom
            >
              {'\u00D7 time resolution'}
            </Typography>
          </Stack>
          <Slider
            sx={{
              margin: 'auto',
              width: '80%',
              marginBottom: 3,
              marginTop: 1,
              heigth: '10%',
            }}
            value={windowLen}
            onChange={(event, value) => {
              setWindowLen(value);
              setTextfieldWndLen(value);
            }}
            aria-label='Window Length'
            defaultValue={1}
            valueLabelDisplay='auto'
            min={1}
            max={coeffTracesData.length > 0 ? coeffTracesData[0].length : 100}
            marks={
              coeffTracesData.length > 0
                ? [
                    { value: 1, label: '1' },
                    {
                      value: coeffTracesData[0].length,
                      label: `${coeffTracesData[0].length}`,
                    },
                  ]
                : [
                    { value: 1, label: '1' },
                    { value: 100, label: '100' },
                  ]
            }
          />
          <Divider />

          {/* PCV USER INPUT MODULE */}
          <Typography sx={{ marginLeft: 1, marginTop: 1, fontWeight: 'bold' }}>
            Custom pitch-class vectors
          </Typography>
          <Box
            sx={{
              flexDirection: 'column',
              display: 'flex',
              alignItems: 'center',
              margin: '3% 5%',
              height: '40%',
              maxHeight: '350px',
              justifyContent: 'flex-start',
            }}
            component='form'
            noValidate
            autoComplete='off'
          >
            <TextField
              /* sx={{ minHeight: '5rem' }} */
              fullWidth
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

          {/* NORMALIZATION TYPE */}
          <Typography sx={{ marginLeft: 1, marginTop: 1, fontWeight: 'bold' }}>
            Normalization and Windowing
          </Typography>
          <Box sx={{ margin: '3% 5%' }}>
            <FormControl fullWidth>
              <InputLabel id='normalization'>Type</InputLabel>
              <Select
                labelId='normalization'
                label='Type'
                MenuProps={{
                  disableScrollLock: true, //To disable popup scrollbar when menu is shown
                }}
                value={normWindSelectedVal}
                defaultValue={0}
                onChange={(e) => {
                  switch (e.target.value) {
                    case 0:
                      setNormalizationType('sum');
                      setWindowingType('centered');
                      setNormWindSelectedVal(0);
                      break;
                    case 1:
                      setNormalizationType('sum');
                      setWindowingType('incremental');
                      setNormWindSelectedVal(1);
                      break;
                    case 2:
                      setNormalizationType('power');
                      setWindowingType('centered');
                      setNormWindSelectedVal(2);
                      break;
                    default:
                      break;
                  }
                }}
              >
                <MenuItem value={0}>
                  Sum normalization - Centered window
                </MenuItem>
                <MenuItem value={1}>
                  Sum normalization - Incremental window
                </MenuItem>
                <MenuItem value={2}>
                  Power normalization - Centered window
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Divider />

          {/* LEGEND OF COEFFICIENTS */}
          <Typography sx={{ marginLeft: 1, marginTop: 1, fontWeight: 'bold' }}>
            Legend of coefficients
          </Typography>
          <Box sx={{ margin: '5px 10px' }}>
            <Paper>
              <Stack>
                <Stack direction='row'>
                  <svg width='24' height='24' viewBox='0 0 24 24'>
                    <circle cx='12' cy='12' r='8' fill='black' />
                    <text
                      fontSize='15'
                      textAnchor='middle'
                      x='12'
                      y='17'
                      fill='white'
                    >
                      k
                    </text>
                  </svg>
                  Fourier coefficient number
                </Stack>
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
                    <g transform='translate(12,12)'>
                      <line
                        x1='0'
                        x2='0'
                        y1='7'
                        y2='-7'
                        stroke='black'
                        strokeWidth='1.5'
                      ></line>
                      <line
                        x1='7'
                        x2='-7'
                        y1='0'
                        y2='0'
                        stroke='black'
                        strokeWidth='1.5'
                      ></line>
                    </g>
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
                  Custom pitch-class vectors
                </Stack>
              </Stack>
            </Paper>
          </Box>

          {/* EXPORT MODULE */}
          <SaveDialog
            traces={windowedCoeffTraces}
            userPcvs={userPcvs}
            wavescapesData={wavescapesData}
          />
        </Drawer>

        {/* MAIN */}
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
                  fullTraces={coeffTracesData}
                  coeffTracesData={windowedCoeffTraces}
                  currentSubdiv={mapCurrentSubdiv}
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
  );
}

export default App;
