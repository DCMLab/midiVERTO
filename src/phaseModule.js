//React and D3
import * as d3 from 'd3';
import { useEffect, useState, useRef } from 'react';

//Import components
import Circle from './Circle';
import { prototypesData } from './prototypesData';

//Import material UI components
import Box from '@mui/material/Box';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';

//Import functions
import { pixelColor } from './colorMapping';

let savedImage = null;

//Phase space module component
function PhaseModule({
  fullTraces,
  coeffTracesData,
  showPrototypes,
  showMagAndPhase,
  userPcvs,
  currentSubdiv,
  midiDevNotesDftCoeffs,
  elemsWidth,
  showFullTrace,
}) {
  //Color wheel canvas
  const canvasRef = useRef(null);

  const [coeff1, setCoeff1] = useState(1);
  const [coeff2, setCoeff2] = useState(1);
  const [coeff3, setCoeff3] = useState(10);
  const [currentProd, setCurrentProd] = useState({ x: 0, y: 0 });

  const [fullTraceProd, setFullTraceProd] = useState([]);

  function complexMult(c1, c2, c3, conjugate) {
    let ris = { x: 0, y: 0 };
    ris.x = c1.x * c2.x - c1.y * c2.y;
    ris.y = c1.x * c2.y + c1.y * c2.x;

    let risX = ris.x;
    let risY = ris.y;

    ris.x = risX * c3.x - risY * c3.y * conjugate;
    ris.y = risX * c3.y * conjugate + risY * c3.x;

    return ris;
  }

  useEffect(() => {
    setCoeff3(12 - coeff1 - coeff2);

    if (coeffTracesData[0]) {
      let temp3;
      let conjugate = 1;
      if (coeff3 > 6) {
        temp3 = 12 - coeff3 - 1;
        conjugate = -1;
      } else {
        temp3 = coeff3 - 1;
      }

      /*
      console.log(coeffTracesData[0][currentSubdiv]);
      console.log(coeff1, coeff2, coeff3);
      console.log(coeffTracesData);
      console.log('ris: ', coeff1 + coeff2 + coeff3);
      console.log(coeffTracesData[coeff1 - 1][currentSubdiv]);
      console.log(coeffTracesData[coeff2 - 1][currentSubdiv]);
      console.log(coeffTracesData[temp3][currentSubdiv]);
      */

      // Current Point
      setCurrentProd(
        complexMult(
          coeffTracesData[coeff1 - 1][currentSubdiv],
          coeffTracesData[coeff2 - 1][currentSubdiv],
          coeffTracesData[temp3][currentSubdiv],
          conjugate
        )
      );

      // Full trace
      let tempTrace = [];
      for (let i = 0; i < fullTraces[0].length; i++) {
        tempTrace.push(
          complexMult(
            coeffTracesData[coeff1 - 1][i],
            coeffTracesData[coeff2 - 1][i],
            coeffTracesData[temp3][i],
            conjugate
          )
        );
      }

      setFullTraceProd(tempTrace);
    }
  }, [coeff1, coeff2, coeffTracesData, currentSubdiv]);

  //Workaround for chrome bug on canvas overlay in foreignObj SVG
  useEffect(() => {
    canvasRef.current.getContext('2d').getImageData(0, 0, 1, 1);
  }, []);

  const handleChangeCoeff1 = (event) => {
    setCoeff1(event.target.value);
  };

  const handleChangeCoeff2 = (event) => {
    setCoeff2(event.target.value);
  };

  //Image parameters
  let width = 445;
  let height = width;
  const margin = 45;
  const headerOffset = 15;
  const circleRadius = width / 2 - margin;

  //Image rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let radius = Math.floor(circleRadius * devicePixelRatio);
    let image = ctx.createImageData(2 * radius, 2 * radius);
    let data = image.data;

    //Increase the actual size of our canvas
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    //Ensure all drawing operations are scaled
    ctx.scale(devicePixelRatio, devicePixelRatio);

    //Scale everything down using CSS
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    //Render the color wheel only at page initialization,
    //skip if already initialized
    if (!savedImage) {
      for (let x = -radius; x < radius; x++) {
        for (let y = -radius; y < radius; y++) {
          let distance = Math.sqrt(x * x + y * y);

          if (distance > radius) {
            // skip all (x,y) coordinates that are outside of the circle
            continue;
          }
          // Figure out the starting index of this pixel in the image data array.
          let rowLength = 2 * radius;
          let adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
          let adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
          let pixelWidth = 4; // each pixel requires 4 slots in the data array
          let index = (adjustedX + adjustedY * rowLength) * pixelWidth;
          let rgba = pixelColor(x, y, distance / radius);
          data[index] = rgba.r;
          data[index + 1] = rgba.g;
          data[index + 2] = rgba.b;
          data[index + 3] = rgba.a;
        }
      }
      savedImage = image;
    }
    ctx.putImageData(savedImage, 0, 0);

    //Render the trace
    if (fullTraceProd.length > 0) {
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [width, height, circleRadius, fullTraceProd]);

  //Re-render trace when trace data changes (a new file is uploaded)
  /*useEffect(() => {
    if (fullTraceProd) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [fullTraceProd]);*/

  //Render the trace in Fourier space
  function drawTrace() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';

    //traceDataCoeff to visualze the windowed version, fullTrace otherwise
    fullTraceProd.forEach((element) => {
      ctx.beginPath();
      ctx.arc(
        element.x * circleRadius,
        -element.y * circleRadius,
        (0.01 * width) / 2,
        0,
        Math.PI * 2,
        true
      );
      ctx.fill();
    });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Stack
          sx={{ margin: 'auto', marginBottom: 1, marginTop: 1, width: '80%' }}
          direction='row'
        >
          <Typography
            sx={{
              marginLeft: 1,
              marginRight: 1,
              paddingTop: '20px',
              fontSize: '18px',
            }}
            variant='h5'
            gutterBottom
          >
            {' Coefficients:  '}
          </Typography>
          <FormControl variant='standard' sx={{ minWidth: '20px' }}>
            <InputLabel>First</InputLabel>
            <Select value={coeff1} label='Age' onChange={handleChangeCoeff1}>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
            </Select>
          </FormControl>

          <Typography
            sx={{
              marginLeft: 1,
              marginRight: 1,
              paddingTop: '20px',
              fontSize: '18px',
            }}
            variant='h5'
            gutterBottom
          >
            {' \u00D7 '}
          </Typography>

          <FormControl variant='standard' sx={{ minWidth: '50px' }}>
            <InputLabel>Second</InputLabel>
            <Select value={coeff2} label='Age' onChange={handleChangeCoeff2}>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>

          <Typography
            sx={{
              marginLeft: 1,
              marginRight: 1,
              paddingTop: '20px',
              fontSize: '18px',
            }}
            variant='h5'
            gutterBottom
          >
            {' \u00D7 '}
          </Typography>

          <TextField
            inputProps={{ style: { textAlign: 'center' } }}
            sx={{ width: '30px', marginTop: 2 }}
            value={coeff3}
            variant='standard'
          />
        </Stack>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          marginTop: 1,
          marginBottom: 2,
        }}
      >
        <svg
          width={elemsWidth}
          height={elemsWidth}
          viewBox={`0 0 ${width} ${height}`}
          xmlns='http://www.w3.org/2000/svg'
        >
          {/* FOURIER SPACE */}
          <g transform={`translate(0,${headerOffset})`}>
            {/* COLOR WHEEL AND TRACE (canvas) */}
            <foreignObject x={margin} y={margin} width={width} height={height}>
              <canvas
                id={`circle${1}`}
                style={{ zIndex: '-1' }}
                width={width}
                height={height}
                ref={canvasRef}
              ></canvas>
            </foreignObject>

            {/* BORDER */}
            <g transform={`translate(${width / 2},${width / 2})`}>
              <path
                fill={'azure'}
                d={d3
                  .arc()
                  .innerRadius(circleRadius - 1)
                  .outerRadius(circleRadius + 3)
                  .startAngle(0)
                  .endAngle(2 * Math.PI)()}
              ></path>
            </g>

            <g transform={`translate(${width / 2},${width / 2})`}>
              {/* Cartesian plane */}
              <line
                x1={-width / 2}
                y1={0}
                x2={width / 2}
                y2={0}
                stroke='black'
              ></line>
              <line
                x1={0}
                y1={-width / 2}
                x2={0}
                y2={width / 2}
                stroke='black'
              ></line>

              {/* Product point */}
              <circle
                cx={currentProd.x * circleRadius}
                cy={-currentProd.y * circleRadius}
                r='6'
              ></circle>
              <circle
                cx={currentProd.x * circleRadius}
                cy={-currentProd.y * circleRadius}
                r='3'
                fill='white'
              ></circle>
            </g>
          </g>
        </svg>

        <svg
          width={elemsWidth}
          height={elemsWidth}
          viewBox={`0 0 ${width} ${height}`}
          xmlns='http://www.w3.org/2000/svg'
        >
          {/* FOURIER SPACE */}
          <g transform={`translate(0,${headerOffset})`}>
            <g transform={`translate(${width / 2},${width / 2})`}>
              {/* Cartesian plane */}
              <line
                x1={-width / 2}
                y1={0}
                x2={width / 2}
                y2={0}
                stroke='black'
              ></line>
              <line
                x1={0}
                y1={-width / 2}
                x2={0}
                y2={width / 2}
                stroke='black'
              ></line>
              {/* Product point */}
              <circle
                cx={currentProd.x * circleRadius}
                cy={currentProd.y * circleRadius}
                r='5'
              ></circle>
            </g>
          </g>
        </svg>
      </Box>
    </Box>
  );
}

export default PhaseModule;
