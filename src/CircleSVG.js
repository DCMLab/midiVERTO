import * as d3 from 'd3';
import * as math from 'mathjs';
import { gradient } from './colorMapping';
//import { useEffect, useRef } from 'react';

//Minus before every y coordinate due to the fact that svg has positive y
//downward, meanwhile cartesian plane has positive y upward

export default ({
  traceData,
  userPcv,
  prototypesData,
  coeffNumber,
  showNumber,
}) => {
  //Size and N number of subdivisions of the arches
  const width = 450;
  const height = width;
  const innerWidth = 0.8 * width;
  //const innerHeight = innerWidth;
  const N = 50;
  const K = 20;

  let marksRadiusRatio = 0.01;
  let circleRadius = innerWidth / 2;

  //console.log(traceData);

  /* const canvasRef = useRef(null);

   useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //ctx.setTransform(1, 0, 0, -1, 0, ctx.canvas.height);

    let margins = [100, 100];
    let innerSize = [canvas.width - margins[0], canvas.height - margins[1]];
  }, []); */

  /* const outerRadius = (0.9 * height) / 2;
  const innerRadius = (0.7 * height) / 2; */

  const theta = (2 * math.pi) / N;
  const angles = d3.range(0, 2 * math.pi, theta);
  const circularSectors = d3.range(0, 1, 1 / K);

  //Generates all the arches that compose the circle
  const arc = (angle, id, index, inner) => {
    const offset = -math.pi / 2;

    const d = d3
      .arc()
      .innerRadius((inner * innerWidth) / 2)
      .outerRadius(((inner + 1 / K) * innerWidth) / 2)
      .startAngle(-(angle + offset))
      .endAngle(-(angle + theta + offset));

    return (
      <path
        key={`${index}.${id}`}
        fill={gradient(angle)}
        fillOpacity={inner}
        stroke={gradient(angle)}
        strokeOpacity={inner / 10}
        d={d()}
        /* shapeRendering={'geometricPrecision'} */
      ></path>
    );
  };

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

    /* if (Math.sign(pcvData.x) === 1) dxOffset = 22;
    else if (Math.sign(pcvData.x) === -1) dxOffset = -20; */

    /* 
    if (Math.sign(-pcvData.y) === 1) dyOffset = 25;
    else if (Math.sign(-pcvData.y) === -1) dyOffset = -8;*/

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

  function svgRoseIcon(rosePoints, translateX, translateY, scale, i) {
    return (
      <g key={`rose${i}`}>
        <polyline
          transform={`translate(${translateX},${translateY}) scale(${scale})`}
          fill='none'
          stroke='black'
          strokeWidth='1px'
          points={rosePoints}
        />
      </g>
    );
  }

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      key={`circle${coeffNumber}`}
      width={width}
      height={height}
    >
      {showNumber ? (
        <g transform={`translate(32,20)`}>
          <circle cx='12' cy='12' r='13' fill='black' />
          <text fontSize='24' textAnchor='middle' x='12' y='20' fill='white'>
            {coeffNumber}
          </text>
        </g>
      ) : null}

      <g transform={`translate(${width / 2},${height / 2})`}>
        {circularSectors.map((innerRadius) =>
          angles.map((angle, id) => arc(angle, id, coeffNumber, innerRadius))
        )}
        {traceData.map((pcv, i) =>
          circleMark(pcv, marksRadiusRatio, 'black', i, 0.2)
        )}
        {userPcv
          ? userPcv.map((pcv, i) => {
              if (!pcv.isDisabled)
                return svgRoseIcon(
                  pcv.rosePoints,
                  pcv.x * circleRadius,
                  -pcv.y * circleRadius,
                  0.7,
                  i
                );
            })
          : null}
        {prototypesData.map((pcv, i) => protoCircleMark(pcv, i))}
      </g>
    </svg>
  );
};
