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
let savedImage2 = null;

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
  const canvasRef2 = useRef(null);

  const [x, setX] = useState(1);
  const [y, setY] = useState(2);
  const [z, setZ] = useState(9); // 12 - x - y

  const [j, setJ] = useState(11); // 12 - y
  const [k, setK] = useState(0); // y - x

  // First visualization
  const [currentProd, setCurrentProd] = useState({ x: 0, y: 0 });
  const [currentPhPoint, setCurrentPhPoint] = useState({ x: 0, y: 0 });

  const [fullTraceProd, setFullTraceProd] = useState([]);
  const [phaseTrace, setPhaseTrace] = useState([]);

  const [checkedNorm, setCheckedNorm] = useState(false);

  // Second visualization
  const [currentProd2, setCurrentProd2] = useState({ x: 0, y: 0 });
  const [currentPhPoint2, setCurrentPhPoint2] = useState({ x: 0, y: 0 });

  const [fullTraceProd2, setFullTraceProd2] = useState([]);
  const [phaseTrace2, setPhaseTrace2] = useState([]);

  const arrayRange = (start, stop) =>
    Array.from(
      { length: (stop - start) / 1 + 1 },
      (value, index) => start + index * 1
    );

  function complexMult(c1, c2) {
    let ris = { x: 0, y: 0 };
    ris.x = c1.x * c2.x - c1.y * c2.y;
    ris.y = c1.x * c2.y + c1.y * c2.x;

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

  function conjIndex(coeff) {
    let ris = { coeffNumber: 0, conjugate: false };
    if (coeff > 6) {
      ris.coeffNumber = 12 - coeff - 1;
      ris.conjugate = true;
    } else {
      ris.coeffNumber = coeff - 1;
    }

    return ris;
  }

  useEffect(() => {
    setZ(12 - x - y); // Z
    setJ(12 - y); // J
    if (y < x) setK(y - x + 12); //K
    else setK(y - x);

    if (coeffTracesData[0]) {
      // First visualization: x, y, z=12-x-y
      let currentCoeffsIndexes = [x, y, z];

      let tempTrace = [];
      for (let i = 0; i < fullTraces[0].length; i++) {
        let resProduct = { x: 0, y: 0 };

        let currentCoeffs = [];
        let currentConjIndex;
        for (let j = 0; j < 3; j++) {
          currentConjIndex = conjIndex(currentCoeffsIndexes[j]);

          if (currentConjIndex.conjugate) {
            let currentCoeff = coeffTracesData[currentConjIndex.coeffNumber][i];
            let newCoeff = { x: 0, y: 0 };
            newCoeff.x = currentCoeff.x;
            newCoeff.y = currentCoeff.y * -1;
            currentCoeffs.push(newCoeff);
          } else {
            currentCoeffs.push(
              coeffTracesData[currentConjIndex.coeffNumber][i]
            );
          }
        }

        resProduct = complexMult(currentCoeffs[0], currentCoeffs[1]);
        resProduct = complexMult(resProduct, currentCoeffs[2]);

        if (checkedNorm) {
          let versProd = multScalar(resProduct, 1 / computeNorm(resProduct));

          let sum = 0;
          for (let j = 0; j < 5; j++) {
            sum += 2 * Math.pow(computeNorm(coeffTracesData[j][i]), 2);
          }
          sum += Math.pow(computeNorm(coeffTracesData[5][i]), 2); //6th coeff

          let prodMag = 1;
          for (let k = 0; k < currentCoeffsIndexes.length; k++) {
            if (currentCoeffsIndexes[k] === 6) {
              prodMag *= Math.sqrt(
                Math.pow(computeNorm(currentCoeffs[k]), 2) / sum
              );
            } else
              prodMag *= Math.sqrt(
                (2 * Math.pow(computeNorm(currentCoeffs[k]), 2)) / sum
              );
          }

          // 3 cases:
          // 1: (4,4,4) --> mult by 1
          // reptead (conj) coefficients --> mult by sqrt(27/4)
          // else --> mult by sqrt(27)
          let conjCurrentCoeffsIndexes = currentCoeffsIndexes.map(
            (x) => conjIndex(x).coeffNumber
          );
          if (
            conjCurrentCoeffsIndexes[0] === 3 &&
            conjCurrentCoeffsIndexes[1] === 3 &&
            conjCurrentCoeffsIndexes[2] === 3
          )
            prodMag *= Math.sqrt(1);
          else if ([...new Set(conjCurrentCoeffsIndexes)].length < 3)
            prodMag *= Math.sqrt(27 / 4);
          else prodMag *= Math.sqrt(27);

          resProduct = multScalar(versProd, prodMag);
        }

        tempTrace.push(resProduct);
      }
      setFullTraceProd(tempTrace);

      //Compute phases and phase trace
      let tempPhTrace = [];
      for (let i = 0; i < fullTraces[0].length; i++) {
        let resProduct = { x: 0, y: 0 };

        let currentCoeffs = [];
        let currentConjIndex;
        for (let j = 0; j < 2; j++) {
          currentConjIndex = conjIndex(currentCoeffsIndexes[j]);

          if (currentConjIndex.conjugate) {
            let currentCoeff = coeffTracesData[currentConjIndex.coeffNumber][i];
            let newCoeff = { x: 0, y: 0 };
            newCoeff.x = currentCoeff.x;
            newCoeff.y = currentCoeff.y * -1;
            currentCoeffs.push(newCoeff);
          } else {
            currentCoeffs.push(
              coeffTracesData[currentConjIndex.coeffNumber][i]
            );
          }
        }

        let phase1 =
          Math.atan2(currentCoeffs[0].y, currentCoeffs[0].x) / Math.PI;
        let phase2 =
          Math.atan2(currentCoeffs[1].y, currentCoeffs[1].x) / Math.PI;

        tempPhTrace.push({ x: phase1, y: phase2 });
      }
      setPhaseTrace(tempPhTrace);

      // Second visualization
      currentCoeffsIndexes = [x, j, k];
      let tempTrace2 = [];
      for (let i = 0; i < fullTraces[0].length; i++) {
        let resProduct = { x: 0, y: 0 };

        let currentCoeffs = [];
        let currentConjIndex;
        for (let j = 0; j < 3; j++) {
          currentConjIndex = conjIndex(currentCoeffsIndexes[j]);
          if (currentConjIndex.conjugate) {
            let currentCoeff = coeffTracesData[currentConjIndex.coeffNumber][i];
            let newCoeff = { x: 0, y: 0 };
            newCoeff.x = currentCoeff.x;
            newCoeff.y = currentCoeff.y * -1;
            currentCoeffs.push(newCoeff);
          } else {
            if (currentConjIndex.coeffNumber === -1) {
              currentCoeffs.push({ x: 1, y: 0 });
            } else {
              currentCoeffs.push(
                coeffTracesData[currentConjIndex.coeffNumber][i]
              );
            }
          }
        }

        resProduct = complexMult(currentCoeffs[0], currentCoeffs[1]);
        resProduct = complexMult(resProduct, currentCoeffs[2]);

        if (checkedNorm) {
          let versProd = multScalar(resProduct, 1 / computeNorm(resProduct));

          let sum = 0;
          for (let j = 0; j < 5; j++) {
            sum += 2 * Math.pow(computeNorm(coeffTracesData[j][i]), 2);
          }
          sum += Math.pow(computeNorm(coeffTracesData[5][i]), 2); //6th coeff

          let prodMag = 1;
          for (let k = 0; k < currentCoeffsIndexes.length; k++) {
            if (currentCoeffsIndexes[k] === 6) {
              prodMag *= Math.sqrt(
                Math.pow(computeNorm(currentCoeffs[k]), 2) / sum
              );
            } else
              prodMag *= Math.sqrt(
                (2 * Math.pow(computeNorm(currentCoeffs[k]), 2)) / sum
              );
          }

          // 3 cases:
          // 1: (4,4,4) --> mult by 1
          // reptead (conj) coefficients --> mult by sqrt(27/4)
          // else --> mult by sqrt(27)
          let conjCurrentCoeffsIndexes = currentCoeffsIndexes.map(
            (x) => conjIndex(x).coeffNumber
          );
          if (
            conjCurrentCoeffsIndexes[0] === 3 &&
            conjCurrentCoeffsIndexes[1] === 3 &&
            conjCurrentCoeffsIndexes[2] === 3
          )
            prodMag *= Math.sqrt(1);
          else if ([...new Set(conjCurrentCoeffsIndexes)].length < 3)
            prodMag *= Math.sqrt(27 / 4);
          else prodMag *= Math.sqrt(27);

          resProduct = multScalar(versProd, prodMag);
        }

        tempTrace2.push(resProduct);
      }
      setFullTraceProd2(tempTrace2);

      tempPhTrace = [];
      for (let i = 0; i < fullTraces[0].length; i++) {
        let resProduct = { x: 0, y: 0 };

        let currentCoeffs = [];
        let currentConjIndex;
        for (let j = 0; j < 3; j++) {
          currentConjIndex = conjIndex(currentCoeffsIndexes[j]);

          if (currentConjIndex.conjugate) {
            let currentCoeff = coeffTracesData[currentConjIndex.coeffNumber][i];
            let newCoeff = { x: 0, y: 0 };
            newCoeff.x = currentCoeff.x;
            newCoeff.y = currentCoeff.y * -1;
            currentCoeffs.push(newCoeff);
          } else {
            if (currentConjIndex.coeffNumber === -1) {
              currentCoeffs.push({ x: 1, y: 0 });
            } else {
              currentCoeffs.push(
                coeffTracesData[currentConjIndex.coeffNumber][i]
              );
            }
          }
        }

        resProduct = complexMult(currentCoeffs[0], currentCoeffs[1]);
        resProduct = complexMult(resProduct, currentCoeffs[2]);

        let phase1 = Math.atan2(resProduct.y, resProduct.x) / Math.PI;
        let phase2 = Math.atan2(tempTrace[i].y, tempTrace[i].x) / Math.PI;

        tempPhTrace.push({ x: phase1, y: phase2 });
      }

      setPhaseTrace2(tempPhTrace);
    }
  }, [x, y, z, j, k, coeffTracesData, checkedNorm]);

  useEffect(() => {
    // Current Point
    if (fullTraceProd.length > 0) {
      setCurrentProd(fullTraceProd[currentSubdiv]);
      setCurrentProd2(fullTraceProd2[currentSubdiv]);
    }
  }, [currentSubdiv, fullTraceProd, fullTraceProd2]);

  useEffect(() => {
    // Current Point (phase space)
    if (fullTraceProd.length > 0) {
      setCurrentPhPoint(phaseTrace[currentSubdiv]);
      setCurrentPhPoint2(phaseTrace2[currentSubdiv]);
    }
  }, [currentSubdiv, phaseTrace, phaseTrace2]);

  //Workaround for chrome bug on canvas overlay in foreignObj SVG
  useEffect(() => {
    canvasRef.current.getContext('2d').getImageData(0, 0, 1, 1);
    canvasRef2.current.getContext('2d').getImageData(0, 0, 1, 1);
  }, []);

  const handleChangeX = (event) => {
    setX(event.target.value);
  };

  const handleChangeY = (event) => {
    setY(event.target.value);
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

  //Image rendering
  useEffect(() => {
    const canvas = canvasRef2.current;
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
      savedImage2 = image;
    }
    ctx.putImageData(savedImage, 0, 0);

    //Render the trace
    if (fullTraceProd2.length > 0) {
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace2();
      ctx.restore();
    }
  }, [width, height, circleRadius, fullTraceProd2]);

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

  //Re-render trace when trace data changes (a new file is uploaded)
  useEffect(() => {
    if (fullTraceProd2) {
      const canvas = canvasRef2.current;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace2();
      ctx.restore();
    }
  }, [fullTraceProd2]);

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

  //Render the trace in Fourier space
  function drawTrace2() {
    const canvas = canvasRef2.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';

    //traceDataCoeff to visualze the windowed version, fullTrace otherwise
    fullTraceProd2.forEach((element) => {
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
            <InputLabel>x</InputLabel>
            <Select value={x} label='Age' onChange={handleChangeX}>
              {arrayRange(1, 6).map((item) => {
                return (
                  <MenuItem key={`second_${item}`} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
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
            <InputLabel>y</InputLabel>
            <Select value={y} label='Age' onChange={handleChangeY}>
              {arrayRange(1, 5).map((item) => {
                return (
                  <MenuItem key={`second_${item}`} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
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
            label='z'
            inputProps={{ style: { textAlign: 'left' } }}
            sx={{ minWidth: '20px', width: '15px', marginTop: 0 }}
            value={z}
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
                {`Ph${x}`}
              </text>
              <text
                fontSize='16'
                textAnchor='start'
                x='3'
                y='-200'
                fill='black'
              >
                {`Ph${y}`}
              </text>

              {[1, 2, 3, 4, 5, 6].map((el, i) => {
                return (
                  <g key={`grid${i}`}>
                    {/* Grid */}
                    <line
                      x1={(-circleRadius * el) / 6}
                      y1={circleRadius}
                      x2={(-circleRadius * el) / 6}
                      y2={-circleRadius}
                      stroke='grey'
                      strokeOpacity={0.5}
                      strokeDasharray='5'
                    />

                    <line
                      x1={(-circleRadius * -el) / 6}
                      y1={circleRadius}
                      x2={(-circleRadius * -el) / 6}
                      y2={-circleRadius}
                      stroke='grey'
                      strokeOpacity={0.5}
                      strokeDasharray='5'
                    />

                    <line
                      x1={circleRadius}
                      y1={(-circleRadius * -el) / 6}
                      x2={-circleRadius}
                      y2={(-circleRadius * -el) / 6}
                      stroke='grey'
                      strokeOpacity={0.5}
                      strokeDasharray='5'
                    />

                    <line
                      x1={circleRadius}
                      y1={(-circleRadius * el) / 6}
                      x2={-circleRadius}
                      y2={(-circleRadius * el) / 6}
                      stroke='grey'
                      strokeOpacity={0.5}
                      strokeDasharray='5'
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
                  </g>
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
                    fillOpacity='0.3'
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
        {`Coefficients: \u00A0\u00A0 x = ${x} \u00A0\u00A0\u00A0\u00A0 j = 12 - y = ${j} \u00A0\u00A0\u00A0\u00A0 k = y - x (mod 12) = ${k}`}
      </Typography>

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
                ref={canvasRef2}
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
                cx={currentProd2.x * circleRadius}
                cy={-currentProd2.y * circleRadius}
                r='6'
              ></circle>
              <circle
                cx={currentProd2.x * circleRadius}
                cy={-currentProd2.y * circleRadius}
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
                x='170'
                y='-3'
                fill='black'
              >
                {`Ph${x}+Ph${y}+Ph${z}`}
              </text>
              <text
                fontSize='16'
                textAnchor='start'
                x='3'
                y='-200'
                fill='black'
              >
                {`Ph${x}+Ph${j}+Ph${k}`}
              </text>

              {[1, 2, 3, 4, 5, 6].map((el, i) => {
                return (
                  <g key={`grid${i}`}>
                    {/* Grid */}
                    <line
                      x1={(-circleRadius * el) / 6}
                      y1={circleRadius}
                      x2={(-circleRadius * el) / 6}
                      y2={-circleRadius}
                      stroke='grey'
                      strokeOpacity={0.5}
                      strokeDasharray='5'
                    />

                    <line
                      x1={(-circleRadius * -el) / 6}
                      y1={circleRadius}
                      x2={(-circleRadius * -el) / 6}
                      y2={-circleRadius}
                      stroke='grey'
                      strokeOpacity={0.5}
                      strokeDasharray='5'
                    />

                    <line
                      x1={circleRadius}
                      y1={(-circleRadius * -el) / 6}
                      x2={-circleRadius}
                      y2={(-circleRadius * -el) / 6}
                      stroke='grey'
                      strokeOpacity={0.5}
                      strokeDasharray='5'
                    />

                    <line
                      x1={circleRadius}
                      y1={(-circleRadius * el) / 6}
                      x2={-circleRadius}
                      y2={(-circleRadius * el) / 6}
                      stroke='grey'
                      strokeOpacity={0.5}
                      strokeDasharray='5'
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
                  </g>
                );
              })}

              {/* Phase trace */}
              {phaseTrace2.map((element, i) => {
                return (
                  <circle
                    key={`phase${i}`}
                    cx={element.x * circleRadius}
                    cy={-element.y * circleRadius}
                    r='3'
                    fill='black'
                    fillOpacity='0.3'
                  ></circle>
                );
              })}

              {/* Current phase */}
              <circle
                cx={currentPhPoint2.x * circleRadius}
                cy={-currentPhPoint2.y * circleRadius}
                r='4'
              ></circle>
              <circle
                cx={currentPhPoint2.x * circleRadius}
                cy={-currentPhPoint2.y * circleRadius}
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
