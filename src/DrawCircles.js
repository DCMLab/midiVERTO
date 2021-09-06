import * as d3 from 'd3';
import * as math from 'mathjs';
import { gradient } from './colorMapping';

export const DrawCircles = ({
  printablePitchClasses,
  traceData,
  userPcv,
  currentSubdiv,
}) => {
  //Size and N number of subdivisions of the arches
  const width = 300;
  const height = width;
  const innerWidth = 0.9 * width;
  //const innerHeight = innerWidth;
  const N = 50;
  const K = 25;

  //console.log(currentSubdiv);

  let traces = [];

  if (traceData.length > 0) {
    let tData = traceData[0];

    for (let j = 1; j < tData[0].length; j++) {
      let temp = [];
      for (let i = 0; i < tData.length; i++) {
        let roundedRe = Math.round(tData[i][j].re * 10000) / 10000;
        let roundedIm = Math.round(tData[i][j].im * 10000) / 10000;

        temp.push({ re: roundedRe, im: roundedIm });
      }
      traces.push(temp);
    }
  }

  const drawTrace = (traceDot, i, j) => {
    const dot = d3
      .arc()
      .innerRadius(0)
      .outerRadius(3)
      .startAngle(0)
      .endAngle(2 * math.pi);

    return (
      <path
        transform={`translate(${(traceDot.re * innerWidth) / 2},${
          -(traceDot.im * innerWidth) / 2
        })`}
        fill={'black'}
        key={`trace${i}.${j}`}
        d={dot()}
      ></path>
    );
  };

  //console.log(traces);

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

  const circleMark = (pcvData, radiusScaleWidth, color) => {
    const mark = d3
      .arc()
      .innerRadius((radiusScaleWidth * width) / 2)
      .outerRadius(((radiusScaleWidth + 0.01) * width) / 2)
      .startAngle(0)
      .endAngle(2 * math.pi);

    return (
      <path
        transform={`translate(${(pcvData.x * innerWidth) / 2},${
          -(pcvData.y * innerWidth) / 2
        })`}
        fill={color}
        key={pcvData.id}
        d={mark()}
      ></path>
    );
  };

  return d3.range(0, 6, 1).map((i) => {
    return (
      <svg key={`circle${i}`} width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {circularSectors.map((innerRadius) =>
            angles.map((angle, id) => arc(angle, id, i, innerRadius))
          )}
        </g>
        <g transform={`translate(${width / 2},${width / 2})`}>
          {printablePitchClasses.map((pc) => {
            if (pc.coeff.includes(i + 1)) {
              return circleMark(pc, 0.05, 'grey');
            } else;
            return null;
          })}
        </g>
        <g transform={`translate(${width / 2},${width / 2})`}>
          {userPcv.map((pcv, k) => {
            return pcv.map((coeff, j) => {
              if (j > 0 && i + 1 === j) {
                return circleMark(
                  { x: coeff.re, y: coeff.im, id: `userpcv${i}.${k}.${j}` },
                  0.03,
                  'navy'
                );
              } else return null;
            });
          })}
        </g>
        <g transform={`translate(${width / 2},${width / 2})`}>
          {traces.length > 1
            ? traces[i].map((dot, j) => drawTrace(dot, i, j))
            : null}
        </g>
      </svg>
    );
  });
};
