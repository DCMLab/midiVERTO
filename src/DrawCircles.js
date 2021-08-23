import * as d3 from 'd3';
import * as math from 'mathjs';
import { gradient } from './colorMapping';

export const DrawCircles = ({ printablePitchClasses }) => {
  //Size and N number of subdivisions of the arches
  const width = 300;
  const height = width;
  const innerWidth = 0.9 * width;
  //const innerHeight = innerWidth;
  const N = 30;
  const K = 15;

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

  const circleMark = (pcvData) => {
    const mark = d3
      .arc()
      .innerRadius((0.05 * width) / 2)
      .outerRadius((0.06 * width) / 2)
      .startAngle(0)
      .endAngle(2 * math.pi);

    return (
      <path
        transform={`translate(${(pcvData.x * innerWidth) / 2},${
          (pcvData.y * innerWidth) / 2
        })`}
        fill={'grey'}
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
              return circleMark(pc);
            } else;
            return null;
          })}
        </g>
      </svg>
    );
  });
};
