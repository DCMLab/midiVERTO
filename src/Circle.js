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

  let marksRadiusRatio = 0.04;

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
    const mark = d3
      .arc()
      .innerRadius((0.05 * width) / 2)
      .outerRadius(((0.05 + 0.01) * width) / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    return (
      <g key={`p.${id}`}>
        <path
          transform={`translate(${pcvData.x * circleRadius},${
            -pcvData.y * circleRadius
          })`}
          fill={'grey'}
          key={id}
          d={mark()}
        ></path>
        <text
          textAnchor='middle'
          x={pcvData.x * (circleRadius * (1 - 0.2))}
          y={pcvData.y * (circleRadius * (1 - 0.2))}
          dy={6}
          fontSize='20px'
        >
          {pcvData.label}
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
          .innerRadius(innerWidth / 2 - 9)
          .outerRadius(innerWidth / 2 - 11)
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
      .outerRadius(((radiusScaleWidth + 0.01) * width) / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    let highlightedTrace = [];
    let length = 10;
    let opacityArray = [];

    opacityArray.push(1);
    for (let i = 1; i < 10; i++) {
      opacityArray.push(opacityArray[i - 1] * 0.6);
    }

    if (currentSubdiv < length)
      highlightedTrace = traceDataCoeff.slice(0, currentSubdiv);
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
            fill={'black'}
            key={i}
            fillOpacity={opacityArray[i]}
            d={mark()}
          ></path>
          <path
            transform={`translate(${coeff.x * circleRadius},${
              -coeff.y * circleRadius
            })`}
            fill={'white'}
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
          {traceDataCoeff
            ? traceDataCoeff.map((pcv, i) =>
                circleMark(pcv, marksRadiusRatio, 'black', i, 0.05)
              )
            : null}
          {traceDataCoeff ? highlightSubdiv(marksRadiusRatio) : null}
          {userPcvsCoeff
            ? userPcvsCoeff.map((pcv, i) =>
                circleMark(pcv, marksRadiusRatio, 'teal', i)
              )
            : null}
        </g>
      </svg>
    </>
  );
}

export default Circle;
