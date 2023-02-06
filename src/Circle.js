//React and D3
import * as d3 from 'd3';
import { useRef, useEffect, useState } from 'react';

//Import functions
import { pixelColor } from './colorMapping';

//Import material UI components
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

let savedImage = null;

//REMINDER
//Minus before every y coordinate due to the fact that images have
//positive y downward, meanwhile cartesian plane has positive y upward.

//Circle component
function Circle({
  coeffNumber,
  protoDataCoeff,
  fullTrace,
  traceDataCoeff,
  userPcvsCoeff,
  currentSubdiv,
  performanceCoeff,
  targetCircleWidth,
  showMagAndPhase,
  showFullTrace,
}) {
  //Color wheel canvas
  const canvasRef = useRef(null);

  //Displayed magnitude and phase
  const [currentSubdivCoeff, setCurrentSubdivCoeff] = useState({
    mu: 0,
    phi: 0,
  });

  //Image parameters
  let width = 445;
  let height = width;
  const margin = 45;
  const headerOffset = 15;
  const circleRadius = width / 2 - margin;

  //Relative size of icons in the image
  let marksRadiusRatio = 0.01;

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
    if (showFullTrace && traceDataCoeff) {
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [width, height, circleRadius, traceDataCoeff, showFullTrace]);

  //Change displayed magnitude and phase when current subdivision changes
  useEffect(() => {
    if (traceDataCoeff && traceDataCoeff[currentSubdiv]) {
      //Rounding to second decimal and converting to polar coordinate
      let x = traceDataCoeff[currentSubdiv].x;
      let y = traceDataCoeff[currentSubdiv].y;

      setCurrentSubdivCoeff(cartesianToPolar(x, y));
    }
  }, [currentSubdiv, traceDataCoeff]);

  //Workaround for chrome bug on canvas overlay in foreignObj SVG
  useEffect(() => {
    canvasRef.current.getContext('2d').getImageData(0, 0, 1, 1);
  }, []);

  //Re-render trace when trace data changes (a new file is uploaded)
  useEffect(() => {
    if (traceDataCoeff) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [fullTrace]);

  //Change of coordinates
  function cartesianToPolar(x, y, norm = false) {
    let phi = (Math.atan2(y, x) * 180) / Math.PI;
    let mu = Math.sqrt(x * x + y * y);

    if (norm) mu = mu / circleRadius;

    phi = Math.round(phi + Number.EPSILON);
    mu = Math.round((mu + Number.EPSILON) * 100) / 100;

    return { mu, phi };
  }

  //Render the trace in Fourier space
  function drawTrace() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';

    //traceDataCoeff to visualze the windowed version, fullTrace otherwise
    traceDataCoeff.forEach((element) => {
      ctx.beginPath();
      ctx.arc(
        element.x * circleRadius,
        -element.y * circleRadius,
        (marksRadiusRatio * width) / 2,
        0,
        Math.PI * 2,
        true
      );
      ctx.fill();
    });
  }

  //Render cross icon for the points generated by the MIDI devices
  const crossMark = (pcvData, radiusScaleWidth) => {
    return (
      <g
        transform={`translate(${pcvData.x * circleRadius},${
          -pcvData.y * circleRadius
        })`}
      >
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
    );
  };

  //Render the rose icon for the PCVs insterd by the user
  function svgRoseIcon(label, rosePoints, translateX, translateY, scale, i) {
    let polarCoord = cartesianToPolar(translateX, translateY, true);
    let widthSvg = 40;
    return (
      <Tooltip
        key={`rtt.${i}`}
        placement='top'
        arrow
        title={
          <Stack
            direction='row'
            justifyContent='center'
            alignItems='center'
            spacing={2}
          >
            <svg
              width={widthSvg}
              height={widthSvg}
              viewBox={`0 0 ${widthSvg} ${widthSvg}`}
            >
              <circle
                cx={widthSvg / 2}
                cy={widthSvg / 2}
                r={widthSvg / 2}
                strokeWidth='1'
                fill='#FFF'
                fillOpacity={1}
              ></circle>

              <polyline
                transform={`translate(${widthSvg / 2},${
                  widthSvg / 2
                }) scale(${1.8})`}
                fill='none'
                stroke='black'
                strokeWidth='1px'
                points={rosePoints}
              />
            </svg>
            <Stack>
              <Typography>{label}</Typography>
              <Typography>{`\u{3BC}: ${
                polarCoord.mu
              } \u{3C6}: ${-polarCoord.phi}\u{b0}`}</Typography>
            </Stack>
          </Stack>
        }
      >
        <g>
          <polyline
            transform={`translate(${translateX},${translateY}) scale(${scale})`}
            fill='none'
            stroke='black'
            strokeWidth='1px'
            fillOpacity={0}
            points={rosePoints}
          />

          <polyline
            transform={`translate(${translateX},${translateY}) scale(${scale})`}
            fill='none'
            stroke='black'
            strokeWidth='1px'
            points={rosePoints}
          />
        </g>
      </Tooltip>
    );
  }

  //Render icon of the prototypes
  const protoCircleMark = (pcvData, id) => {
    let scaleRatio = 0.02;
    const mark = d3
      .arc()
      .innerRadius((scaleRatio * width) / 2)
      .outerRadius(((scaleRatio + 0.01) * width) / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    //Check for sub/superscript
    let labelName = '';
    let subSup = '';
    let isSub = false;
    if (pcvData.label.includes('_') || pcvData.label.includes('^')) {
      for (let i = 0; i < pcvData.label.length; i++) {
        if (pcvData.label[i] === '_') {
          labelName = pcvData.label.slice(0, i);
          subSup = pcvData.label.slice(i + 1, pcvData.label.length);
          isSub = true;
        }
        if (pcvData.label[i] === '^') {
          labelName = pcvData.label.slice(0, i);
          subSup = pcvData.label.slice(i + 1, pcvData.label.length);
        }
      }
    } else {
      labelName = pcvData.label;
    }

    //Computation of label offset
    //Good for most of the labels
    let dxOffset = Math.sign(pcvData.x) * 18,
      dyOffset = -Math.sign(pcvData.y) * 18 + 7;

    //Custom rules for labels
    if (labelName === '♯') dyOffset -= 3;
    if (labelName === 'WT' && subSup === '1') dxOffset *= 1.2;
    if (labelName === 'WT' && subSup === '0') dxOffset *= 1.4;
    if (labelName === 'C' && subSup === 'o7') dxOffset *= 1.2;
    if (labelName === 'O' && subSup === '1,2') dyOffset *= 1.1;
    if (labelName === 'C♯' && subSup === 'o7') {
      dxOffset *= 1.1;
      dyOffset *= 1.1;
    }
    if (labelName === 'D' && subSup === 'o7') {
      dxOffset *= 0.7;
      dyOffset *= 0.7;
    }
    if (labelName === 'H' && subSup === '2,3') {
      dxOffset *= 1.2;
      dyOffset *= 1.2;
    }
    if (labelName === 'H' && subSup === '1,2') {
      dxOffset *= 0.7;
      dyOffset *= 0.7;
    }
    if (labelName === 'Ω') {
      dxOffset = 15;
      dyOffset = 5;
    }

    return (
      <g
        transform={`translate(${pcvData.x * circleRadius},${
          -pcvData.y * circleRadius
        })`}
        key={`p.${id}`}
      >
        <path fill={'grey'} key={id} d={mark()}></path>
        <text textAnchor='middle' dx={dxOffset} dy={dyOffset} fontSize='20px'>
          {labelName}
          {isSub ? (
            <tspan fontSize={15} baselineShift='sub'>
              {subSup}
            </tspan>
          ) : (
            <tspan fontSize={15} baselineShift='super'>
              {subSup}
            </tspan>
          )}
        </text>
      </g>
    );
  };

  //Render border of the circle (used to smooth the color wheel canvas)
  const drawBorder = () => {
    return (
      <path
        fill={'azure'}
        d={d3
          .arc()
          .innerRadius(circleRadius - 1)
          .outerRadius(circleRadius + 3)
          .startAngle(0)
          .endAngle(2 * Math.PI)()}
      ></path>
    );
  };

  //Plot circles related to the MIDI playback (N points before the current subdiv)
  const highlightSubdiv = (radiusScaleWidth) => {
    const mark = d3
      .arc()
      .innerRadius(0)
      .outerRadius((radiusScaleWidth * width) / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    const highlight = d3
      .arc()
      .innerRadius((radiusScaleWidth * width) / 2)
      .outerRadius(((radiusScaleWidth + 0.005) * width) / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    let highlightedTrace = [];
    let length = 7;
    let opacityArray = [];

    opacityArray.push(1);
    opacityArray.push(0.5);
    for (let i = 2; i < length; i++) {
      opacityArray.push(
        Math.round((opacityArray[i - 1] - 0.5 / (length - 2)) * 100) / 100
      );
    }

    if (currentSubdiv < length)
      highlightedTrace = traceDataCoeff.slice(0, currentSubdiv + 1);
    else
      highlightedTrace = traceDataCoeff.slice(
        currentSubdiv - length + 1,
        currentSubdiv + 1
      );

    highlightedTrace = highlightedTrace.reverse();

    return highlightedTrace.map((coeff, i) => {
      return (
        <g key={`g.${i}`}>
          <path
            transform={`translate(${coeff.x * circleRadius},${
              -coeff.y * circleRadius
            })`}
            fill={'white'}
            key={i}
            fillOpacity={opacityArray[i]}
            d={mark()}
          ></path>
          <path
            transform={`translate(${coeff.x * circleRadius},${
              -coeff.y * circleRadius
            })`}
            fill={'black'}
            fillOpacity={opacityArray[i]}
            key={`t.${i}`}
            d={highlight()}
          ></path>
        </g>
      );
    });
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <svg
        width={targetCircleWidth}
        height={targetCircleWidth}
        viewBox={`0 0 ${width} ${height}`}
        xmlns='http://www.w3.org/2000/svg'
      >
        {/* COEFFICIENT NUMBER */}
        <g transform={`translate(32,8)`}>
          <circle cx='12' cy='12' r='13' fill='black' />
          <text fontSize='24' textAnchor='middle' x='12' y='20' fill='white'>
            {coeffNumber}
          </text>
        </g>

        {/* MAGNITUDE AND PHASE */}
        <g transform={`translate(${125},0)`}>
          {showMagAndPhase ? (
            <>
              <text
                x='120'
                y='23'
                style={{ fontSize: '24px' }}
              >{`\u{3C6}: ${currentSubdivCoeff.phi}\u{b0}`}</text>
              <text
                x='34'
                y='24'
                style={{ fontSize: '24px' }}
              >{`\u{3BC}: ${currentSubdivCoeff.mu}`}</text>
            </>
          ) : null}
        </g>

        {/* FOURIER SPACE */}
        <g transform={`translate(0,${headerOffset})`}>
          {/* COLOR WHEEL AND TRACE (canvas) */}
          <foreignObject x={margin} y={margin} width={width} height={height}>
            <canvas
              id={`circle${coeffNumber}`}
              style={{ zIndex: '-1' }}
              width={width}
              height={height}
              ref={canvasRef}
            ></canvas>
          </foreignObject>

          {/* POINTS AND BORDER */}
          <g transform={`translate(${width / 2},${width / 2})`}>
            {/* BORDER */}
            {drawBorder()}
            {protoDataCoeff
              ? protoDataCoeff.map((pcv, i) => protoCircleMark(pcv, i))
              : null}

            {/* MIDI device coeff */}
            {performanceCoeff.x === 0 && performanceCoeff.y === 0
              ? null
              : crossMark(performanceCoeff, marksRadiusRatio * 2, 'teal')}

            {/* ROSES */}
            {userPcvsCoeff
              ? userPcvsCoeff.map((pcv, i) => {
                  if (!pcv.isDisabled)
                    return svgRoseIcon(
                      pcv.label,
                      pcv.rosePoints,
                      pcv.x * circleRadius,
                      -pcv.y * circleRadius,
                      0.7,
                      i
                    );
                })
              : null}

            {/* MIDI PLAYBACK */}
            {traceDataCoeff ? highlightSubdiv(marksRadiusRatio) : null}
          </g>
        </g>
      </svg>
    </Box>
  );
}

export default Circle;
