//React and D3
import * as d3 from 'd3';
import { useEffect, useState, useRef } from 'react';

//Import components
import Circle from './Circle';
import { prototypesData } from './prototypesData';

//Import material UI components
import Box from '@mui/material/Box';
import { FormControl, Switch } from '@mui/material';
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
  const [currentPhPoint, setCurrentPhPoint] = useState({ x: 0, y: 0 });

  const [fullTraceProd, setFullTraceProd] = useState([]);
  const [phaseTrace, setPhaseTrace] = useState([]);

  const [checkedNorm, setCheckedNorm] = useState(false);

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

  function computeNorm(c) {
    return Math.sqrt(Math.pow(c.x, 2) + Math.pow(c.y, 2));
  }

  function multScalar(c, scalar) {
    let res = { x: 0, y: 0 };
    res.x = c.x * scalar;
    res.y = c.y * scalar;

    return res;
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

      // Full trace
      let tempTrace = [];
      for (let i = 0; i < fullTraces[0].length; i++) {
        let resProduct = { x: 0, y: 0 };

        // Normalization
        if (checkedNorm) {
          let a_x = coeffTracesData[coeff1 - 1][i];
          let a_y = coeffTracesData[coeff2 - 1][i];
          let a_z = coeffTracesData[temp3][i];

          //Norms
          let n_x = computeNorm(a_x);
          let n_y = computeNorm(a_y);
          let n_z = computeNorm(a_z);

          //Versors
          let v_x = multScalar(a_x, 1 / n_x);
          let v_y = multScalar(a_y, 1 / n_y);
          let v_z = multScalar(a_z, 1 / n_z);

          let prodVersor = complexMult(v_x, v_y, v_z, conjugate);

          let sum = 0;
          for (let j = 0; j < 5; j++) {
            sum += 2 * Math.pow(computeNorm(coeffTracesData[j][i]), 2);
          }
          sum += Math.pow(computeNorm(coeffTracesData[5][i]), 2); //6th coeff

          let prodMag =
            Math.sqrt((2 * Math.pow(n_x, 2)) / sum) *
            Math.sqrt((2 * Math.pow(n_y, 2)) / sum);

          if (coeff3 == 6) prodMag *= Math.sqrt(Math.pow(n_z, 2) / sum);
          else prodMag *= Math.sqrt((2 * Math.pow(n_z, 2)) / sum);

          prodMag *= Math.sqrt(27);

          resProduct = multScalar(prodVersor, prodMag);
        } else {
          //No normalization
          resProduct = complexMult(
            coeffTracesData[coeff1 - 1][i],
            coeffTracesData[coeff2 - 1][i],
            coeffTracesData[temp3][i],
            conjugate
          );
        }

        tempTrace.push(resProduct);
      }

      setFullTraceProd(tempTrace);

      //Compute phases and phase trace
      let tempPhTrace = [];
      for (let i = 0; i < fullTraces[0].length; i++) {
        let c1 = coeffTracesData[coeff1 - 1][i];
        let c2 = coeffTracesData[coeff2 - 1][i];

        let phase1 = (Math.atan(c1.y / c1.x) * 2) / Math.PI;
        let phase2 = (Math.atan(c2.y / c2.x) * 2) / Math.PI;

        tempPhTrace.push({ x: phase1, y: phase2 });
      }
      setPhaseTrace(tempPhTrace);
    }
  }, [coeff1, coeff2, coeff3, coeffTracesData, checkedNorm]);

  useEffect(() => {
    // Current Point
    if (fullTraceProd.length > 0) {
      setCurrentProd(fullTraceProd[currentSubdiv]);
    }
  }, [currentSubdiv, fullTraceProd]);

  useEffect(() => {
    // Current Point (phase space)
    if (fullTraceProd.length > 0) {
      setCurrentPhPoint(phaseTrace[currentSubdiv]);
    }
  }, [currentSubdiv, phaseTrace]);

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
  useEffect(() => {
    if (fullTraceProd) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [fullTraceProd]);

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
            sx={{ minWidth: '30px', width: '30px', marginTop: 2 }}
            value={coeff3}
            variant='standard'
          />

          <Switch
            sx={{ marginTop: 2, marginLeft: 5 }}
            checked={checkedNorm}
            onChange={(event) => {
              setCheckedNorm(event.target.checked);
            }}
          ></Switch>
          <Typography
            sx={{
              marginTop: 3,
              fontSize: '18px',
            }}
            variant='h5'
            gutterBottom
          >
            {'Normalization'}
          </Typography>
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
          {/* PHASE SPACE */}
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
              <text
                fontSize='16'
                textAnchor='middle'
                x='200'
                y='-3'
                fill='black'
              >
                {`Ph${coeff1}`}
              </text>
              <text
                fontSize='16'
                textAnchor='start'
                x='3'
                y='-200'
                fill='black'
              >
                {`Ph${coeff2}`}
              </text>

              {[1, 2, 3, 4, 5, 6].map((el) => {
                return (
                  <>
                    {/* Grid */}
                    <line
                      x1={(-circleRadius * el) / 6}
                      y1={circleRadius}
                      x2={(-circleRadius * el) / 6}
                      y2={-circleRadius}
                      stroke='grey'
                      strokeOpacity={0.5}
                      stroke-dasharray='5'
                    />

                    <line
                      x1={(-circleRadius * -el) / 6}
                      y1={circleRadius}
                      x2={(-circleRadius * -el) / 6}
                      y2={-circleRadius}
                      stroke='grey'
                      strokeOpacity={0.5}
                      stroke-dasharray='5'
                    />

                    <line
                      x1={circleRadius}
                      y1={(-circleRadius * -el) / 6}
                      x2={-circleRadius}
                      y2={(-circleRadius * -el) / 6}
                      stroke='grey'
                      strokeOpacity={0.5}
                      stroke-dasharray='5'
                    />

                    <line
                      x1={circleRadius}
                      y1={(-circleRadius * el) / 6}
                      x2={-circleRadius}
                      y2={(-circleRadius * el) / 6}
                      stroke='grey'
                      strokeOpacity={0.5}
                      stroke-dasharray='5'
                    />

                    {/* Numbers */}
                    <text
                      fontSize='13'
                      textAnchor='middle'
                      x={(el / 6) * circleRadius}
                      y='12'
                      fill='black'
                    >
                      {el}
                    </text>

                    <text
                      fontSize='13'
                      textAnchor='middle'
                      x={(-el / 6) * circleRadius}
                      y='12'
                      fill='black'
                    >
                      {-el}
                    </text>
                    <text fontSize='13' textAnchor='middle' x='5' y='12'>
                      {0}
                    </text>

                    <text
                      fontSize='13'
                      textAnchor='middle'
                      x='7'
                      y={-(el / 6) * circleRadius + 5}
                      fill='black'
                    >
                      {el}
                    </text>

                    <text
                      fontSize='13'
                      textAnchor='middle'
                      x='7'
                      y={(el / 6) * circleRadius + 5}
                      fill='black'
                    >
                      {-el}
                    </text>
                  </>
                );
              })}

              {/* Phase trace */}
              {phaseTrace.map((element, i) => {
                return (
                  <circle
                    key={`phase${i}`}
                    cx={element.x * circleRadius}
                    cy={-element.y * circleRadius}
                    r='3'
                    fill='black'
                    fill-opacity='0.3'
                  ></circle>
                );
              })}

              {/* Current phase */}
              <circle
                cx={currentPhPoint.x * circleRadius}
                cy={-currentPhPoint.y * circleRadius}
                r='4'
              ></circle>
              <circle
                cx={currentPhPoint.x * circleRadius}
                cy={-currentPhPoint.y * circleRadius}
                r='2'
                fill='red'
              ></circle>
            </g>
          </g>
        </svg>
      </Box>
    </Box>
  );
}

export default PhaseModule;
