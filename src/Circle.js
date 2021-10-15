import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import { pixelColor } from './colorMapping';

//Minus before every y coordinate due to the fact that svg has positive y
//downward, meanwhile cartesian plane has positive y upward

function Circle({
  protoDataCoeff,
  traceDataCoeff,
  userPcvsCoeff,
  currentSubdiv,
  performanceCoeff,
}) {
  const canvasRef = useRef(null);
  const width = 440;
  const height = width;

  const margin = 40;
  const innerWidth = width - margin;
  const circleRadius = width / 2 - margin;

  let marksRadiusRatio = 0.01;

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
    ctx.putImageData(image, 0, 0);
  }, [width, height, circleRadius]);

  useEffect(() => {
    //Workaround for chrome bug on canvas overlay in foreignObj SVG
    canvasRef.current.getContext('2d').getImageData(0, 0, 1, 1);
  }, []);

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
          .outerRadius(circleRadius + 1)
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
    let length = 50;
    let opacityArray = [];

    opacityArray.push(1);
    for (let i = 1; i < length; i++) {
      opacityArray.push(opacityArray[i - 1] * 0.8);
    }

    if (currentSubdiv < length)
      highlightedTrace = traceDataCoeff.slice(0, currentSubdiv + 1);
    else
      highlightedTrace = traceDataCoeff.slice(
        currentSubdiv - length,
        currentSubdiv
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
    <>
      <svg width={width} height={height}>
        <foreignObject x={margin} y={margin} width={width} height={height}>
          <canvas
            style={{ zIndex: '-1' }}
            width={width}
            height={height}
            ref={canvasRef}
          />
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
          {traceDataCoeff ? highlightSubdiv(marksRadiusRatio) : null}
          {userPcvsCoeff
            ? userPcvsCoeff.map((pcv, i) =>
                circleMark(pcv, marksRadiusRatio, 'teal', i)
              )
            : null}
          {circleMark(performanceCoeff, marksRadiusRatio * 2, 'teal')}
        </g>
      </svg>
    </>
  );
}

export default Circle;
