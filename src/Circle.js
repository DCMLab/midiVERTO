import * as d3 from 'd3';
import { useRef, useEffect, useState } from 'react';
import { pixelColor } from './colorMapping';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

let savedImage = null;

//Minus before every y coordinate due to the fact that svg has positive y
//downward, meanwhile cartesian plane has positive y upward

function Circle({
  coeffNumber,
  protoDataCoeff,
  traceDataCoeff,
  userPcvsCoeff,
  currentSubdiv,
  performanceCoeff,
  targetCircleWidth,
  showMagAndPhase,
  showFullTrace,
}) {
  const canvasRef = useRef(null);
  const [currentSubdivCoeff, setCurrentSubdivCoeff] = useState({
    mu: 0,
    phi: 0,
  });
  let width = 440;
  let height = width;

  const margin = 40;
  const circleRadius = width / 2 - margin;

  let marksRadiusRatio = 0.01;

  useEffect(() => {
    if (traceDataCoeff) {
      //Rounding to second decimal and converting to polar coordinate
      let x = traceDataCoeff[currentSubdiv].x;
      let y = traceDataCoeff[currentSubdiv].y;

      setCurrentSubdivCoeff(cartesianToPolar(x, y));
    }
  }, [currentSubdiv, traceDataCoeff]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let radius = Math.floor(circleRadius * devicePixelRatio);
    let image = ctx.createImageData(2 * radius, 2 * radius);
    let data = image.data;

    // increase the actual size of our canvas
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    // ensure all drawing operations are scaled
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // scale everything down using CSS
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

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

    if (traceDataCoeff && showFullTrace) {
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [width, height, circleRadius, traceDataCoeff, showFullTrace]);

  useEffect(() => {
    //Workaround for chrome bug on canvas overlay in foreignObj SVG
    canvasRef.current.getContext('2d').getImageData(0, 0, 1, 1);
  }, []);

  {
    /* {traceDataCoeff
          ? traceDataCoeff.map((pcv, i) =>
              circleMark(pcv, marksRadiusRatio, 'black', i, 0.1)
            )
          : null} */
  }

  useEffect(() => {
    if (traceDataCoeff) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [traceDataCoeff]);

  function cartesianToPolar(x, y, norm = false) {
    let phi = (Math.atan2(y, x) * 180) / Math.PI;
    let mu = Math.sqrt(x * x + y * y);

    if (norm) mu = mu / circleRadius;

    phi = Math.round(phi + Number.EPSILON);
    mu = Math.round((mu + Number.EPSILON) * 100) / 100;

    return { mu, phi };
  }

  function drawTrace() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';

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

  const circleMark = (pcvData, radiusScaleWidth, color, id, opacity = 1) => {
    const mark = d3
      .arc()
      .innerRadius(0)
      .outerRadius((radiusScaleWidth * width) / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    return (
      <path
        transform={`translate(${pcvData.x * circleRadius},${
          -pcvData.y * circleRadius
        })`}
        fill={color}
        fillOpacity={opacity}
        key={id}
        d={mark()}
      ></path>
    );
  };

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
            fill='#FFF'
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
    let dxOffset = 0,
      dyOffset = 5;

    if (Math.sign(pcvData.x) === 1) dxOffset = 20;
    else if (Math.sign(pcvData.x) === -1) dxOffset = -20;

    if (Math.sign(-pcvData.y) === 1) dyOffset = 25;
    else if (Math.sign(-pcvData.y) === -1) dyOffset = -8;

    if (pcvData.x === 0 && pcvData.y === 0) {
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
    <svg
      width={targetCircleWidth}
      height={targetCircleWidth}
      viewBox={`0 0 ${width} ${height}`}
      /* transform={`scale(${targetCircleWidth / width},${
        targetCircleWidth / width
      })`} */
    >
      <text x='0' y='24' style={{ fontSize: '24px' }}>
        {`${coeffNumber}.`}
      </text>
      {showMagAndPhase ? (
        <>
          <text
            x='19'
            y='24'
            style={{ fontSize: '24px' }}
          >{`\u{3C6}: ${currentSubdivCoeff.phi}\u{b0}`}</text>
          <text
            x='20'
            y='44'
            style={{ fontSize: '24px' }}
          >{`\u{3BC}: ${currentSubdivCoeff.mu}`}</text>
        </>
      ) : null}

      <foreignObject x={margin} y={margin} width={width} height={height}>
        <canvas
          style={{ zIndex: '-1' }}
          width={width}
          height={height}
          ref={canvasRef}
        ></canvas>
      </foreignObject>
      <g transform={`translate(${width / 2},${width / 2})`}>
        {drawBorder()}
        {protoDataCoeff
          ? protoDataCoeff.map((pcv, i) => protoCircleMark(pcv, i))
          : null}
        {/* {traceDataCoeff
          ? traceDataCoeff.map((pcv, i) =>
              circleMark(pcv, marksRadiusRatio, 'black', i, 0.1)
            )
          : null} */}
        {performanceCoeff.x === 0 && performanceCoeff.y === 0
          ? null
          : circleMark(performanceCoeff, marksRadiusRatio * 2, 'teal')}
        {/* {userPcvsCoeff
          ? userPcvsCoeff.map((pcv, i) => {
              if (!pcv.isDisabled)
                return circleMark(pcv, marksRadiusRatio + 0.015, '#FFF', i, 0);
            })
          : null} */}
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
        {traceDataCoeff ? highlightSubdiv(marksRadiusRatio) : null}
      </g>
    </svg>
  );
}

export default Circle;
