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
}) {
  const canvasRef = useRef(null);
  const width = 400;
  const height = width;

  const margin = 20;
  const innerWidth = width - margin;
  const circleRadius = width / 2 - margin;

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

  const circleMark = (pcvData, radiusScaleWidth, color, id) => {
    const mark = d3
      .arc()
      .innerRadius((radiusScaleWidth * width) / 2)
      .outerRadius(((radiusScaleWidth + 0.01) * width) / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    return (
      <path
        transform={`translate(${pcvData.x * circleRadius},${
          -pcvData.y * circleRadius
        })`}
        fill={color}
        key={id}
        d={mark()}
      ></path>
    );
  };

  const drawBorder = () => {
    return (
      <path
        fill={'black'}
        d={d3
          .arc()
          .innerRadius(innerWidth / 2 - 8)
          .outerRadius(innerWidth / 2 - 11)
          .startAngle(0)
          .endAngle(2 * Math.PI)()}
      ></path>
    );
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
          {protoDataCoeff.map((pcv, i) => circleMark(pcv, 0.05, 'grey', i))}
          {traceDataCoeff
            ? traceDataCoeff.map((pcv, i) => circleMark(pcv, 0.01, 'black', i))
            : null}
          {userPcvsCoeff
            ? userPcvsCoeff.map((pcv, i) => circleMark(pcv, 0.03, 'teal', i))
            : null}
        </g>
      </svg>
    </>
  );
}

export default Circle;
