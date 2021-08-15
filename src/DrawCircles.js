import * as d3 from 'd3';
import * as math from 'mathjs';

export const DrawCircles = () => {
  //Size and N number of subdivisions of the arches
  const width = 300;
  const height = 300;
  const N = 50;

  /* const outerRadius = (0.9 * height) / 2;
  const innerRadius = (0.7 * height) / 2; */

  const theta = (2 * math.pi) / N;
  const angles = d3.range(0, 2 * math.pi, theta);
  const circularSectors = d3.range(0, 1, 1 / N);

  //Generates all the arches that compose the circle
  const arc = (angle, id, index, inner) => {
    const offset = -math.pi / 2;

    const d = d3
      .arc()
      .innerRadius((0.9 * (inner * width)) / 2)
      .outerRadius((0.9 * ((inner + 1 / N) * width)) / 2)
      .startAngle(-(angle + offset))
      .endAngle(-(angle + theta + offset));

    return (
      <path
        key={`${index}.${id}`}
        fill={gradient(angle)}
        fillOpacity={inner}
        stroke={gradient(angle)}
        strokeOpacity={inner / 5}
        d={d()}
        /* shapeRendering={'geometricPrecision'} */
      ></path>
    );
  };

  //Convert rgb values from [0,1] to [0,255]
  const contToDiscRGB = d3
    .scaleQuantize()
    .domain([0, 1])
    .range(d3.range(0, 255, 1));

  //Generate the color space using the color mapping suggested in the paper
  const gradient = (angle) => {
    let r, g, b;

    if (angle >= 0 && angle < math.pi / 3) {
      r = 1;
      g = (3 * angle) / math.pi;
      b = 0;
    } else if (angle >= math.pi / 3 && angle < (math.pi * 2) / 3) {
      r = 2 - (3 * angle) / math.pi;
      g = 1;
      b = 0;
    } else if (angle >= (math.pi * 2) / 3 && angle < math.pi) {
      r = 0;
      g = 1;
      b = (3 * angle) / math.pi - 2;
    } else if (angle >= math.pi && angle < (math.pi * 4) / 3) {
      r = 0;
      g = 4 - (3 * angle) / math.pi;
      b = 1;
    } else if (angle >= (math.pi * 4) / 3 && angle < (math.pi * 5) / 3) {
      r = (3 * angle) / math.pi - 4;
      g = 0;
      b = 1;
    } else if (angle >= (math.pi * 5) / 3 && angle < 2 * math.pi) {
      r = 1;
      g = 0;
      b = 6 - (3 * angle) / math.pi;
    }

    r = contToDiscRGB(r);
    g = contToDiscRGB(g);
    b = contToDiscRGB(b);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return d3.range(0, 6, 1).map((i) => {
    return (
      <svg key={i.toString()} width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {circularSectors.map((innerRadius) =>
            angles.map((angle, id) => arc(angle, id, i, innerRadius))
          )}
        </g>
      </svg>
    );
  });
};
