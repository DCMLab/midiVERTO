//React and D3
import * as d3 from 'd3';
import { useEffect, useState, useRef } from 'react';

//Import material UI components
import Box from '@mui/material/Box';

//Import functions
import { pixelColor } from './colorMapping';

let savedImage = null;
const verticalScale = Math.sin(Math.PI / 3);

const labelsCoordinates = [
  [1, 0],
  [0.5, -0.866],
  [-0.5, -0.866],
  [-1, 0],
  [-0.5, 0.866],
  [0.5, 0.866],
];

const order = [1, 5, 3, 4, 6, 2];
const angle = (2 * Math.PI) / 6;
const anchors = [1, 2, 3, 4, 5, 6].map((index) => {
  return {
    x: Math.cos((index - 1) * angle),
    y: Math.sin((index - 1) * angle),
  };
});

//Phase space module component
function QualiaModule({
  fullTraces,
  coeffTracesData,
  currentSubdiv,
  elemsWidth,
  dftCoeffsMatrix,
  wsPhantomCurveHeight,
}) {
  //Color wheel canvas
  const canvasRef = useRef(null);
  const canvasRefWavescape = useRef(null);

  const [qualiaTrace, setQualiaTrace] = useState([]);
  const [currentQualia, setCurrentQualia] = useState([{ x: 0, y: 0 }]);
  const [qualiaWavescape, setQualiaWavescape] = useState([]);

  function computeNorm(c) {
    return Math.sqrt(Math.pow(c.x, 2) + Math.pow(c.y, 2));
  }

  useEffect(() => {
    if (coeffTracesData[0]) {
      // First visualization: radViz
      let tempTrace = [];

      for (let i = 0; i < fullTraces[0].length; i++) {
        let currentCoeffs = [];
        for (let j = 0; j < coeffTracesData.length; j++) {
          currentCoeffs.push(coeffTracesData[order[j] - 1][i]);
          // Anchors and coefficients are both ordered following the combination [1, 5, 3, 4, 6, 2]
        }

        let magnitudes = currentCoeffs.map((coeff) => computeNorm(coeff));
        let sumMag = magnitudes.reduce((a, b) => a + b, 0); // Sum all the magnitudes

        let centroid = { x: 0, y: 0 };

        for (let j = 0; j < currentCoeffs.length; j++) {
          centroid.x += anchors[j].x * magnitudes[j];
          centroid.y += anchors[j].y * magnitudes[j];
        }

        centroid.x = centroid.x / sumMag;
        centroid.y = centroid.y / sumMag;

        tempTrace.push(centroid);
      }

      setQualiaTrace(tempTrace);
    }
  }, [coeffTracesData]);

  useEffect(() => {
    // Current Point
    if (qualiaTrace.length > 0) {
      setCurrentQualia(qualiaTrace[currentSubdiv]);
    }
  }, [currentSubdiv, qualiaTrace]);

  //Workaround for chrome bug on canvas overlay in foreignObj SVG
  useEffect(() => {
    canvasRef.current.getContext('2d').getImageData(0, 0, 1, 1);
    canvasRefWavescape.current.getContext('2d').getImageData(0, 0, 1, 1);
  }, []);

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
          let rgba = pixelColor(-x, y, distance / radius); // -x, y is a reflection given by the definition of the color map in the Qualia space
          /* data[index] = (rgba.r * distance) / radius; // Distance/radius in [0,1] can be used as a parameter of blackness
          data[index + 1] = (rgba.g * distance) / radius;
          data[index + 2] = (rgba.b * distance) / radius;
          data[index + 3] = rgba.a; // No transparency */

          data[index] = rgba.r; // Distance/radius in [0,1] can be used as a parameter of blackness
          data[index + 1] = rgba.g;
          data[index + 2] = rgba.b;
          data[index + 3] = 255; // No transparency
        }
      }
      savedImage = image;
    }
    ctx.putImageData(savedImage, 0, 0);

    //Render the trace
    if (qualiaTrace.length > 0) {
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [width, height, circleRadius, qualiaTrace]);

  //Re-render trace when trace data changes (a new file is uploaded)
  useEffect(() => {
    if (qualiaTrace) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate((400 - margin) / 2, (400 - margin) / 2);
      drawTrace();
      ctx.restore();
    }
  }, [qualiaTrace]);

  //Render the trace in Fourier space
  function drawTrace() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 1)';

    //traceDataCoeff to visualze the windowed version, fullTrace otherwise
    qualiaTrace.forEach((element) => {
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

  // Wavescape
  let ticks;
  const [wsCoordinates, setWsCoordinates] = useState([]);
  const [ticksHeight, setTicksHeight] = useState(3);
  const marginWs = 10;
  let widthWs = elemsWidth - marginWs;
  let heightWs = elemsWidth;

  useEffect(() => {
    // Second visualization: wavescape
    let centroidLevel = [];

    // i: select the level (height) of the matrix
    for (let i = 0; i < dftCoeffsMatrix.length; i++) {
      let centroidSegments = [];
      // k: select the segment on the current level
      for (let k = 0; k < dftCoeffsMatrix[i].length; k++) {
        let currentCoeffsOrdered = [];
        for (let j = 1; j < dftCoeffsMatrix[i][k].length; j++) {
          currentCoeffsOrdered.push({
            x: dftCoeffsMatrix[i][k][order[j - 1]].re,
            y: dftCoeffsMatrix[i][k][order[j - 1]].im,
          });
        }

        let magnitudes = currentCoeffsOrdered.map((coeff) =>
          computeNorm(coeff)
        );
        let sumMag = magnitudes.reduce((a, b) => a + b, 0); // Sum all the magnitudes

        let centroid = { x: 0, y: 0 };

        for (let j = 0; j < currentCoeffsOrdered.length; j++) {
          centroid.x += anchors[j].x * magnitudes[j];
          centroid.y += anchors[j].y * magnitudes[j];
        }

        centroid.x = centroid.x / sumMag;
        centroid.y = centroid.y / sumMag;

        let rgba = pixelColor(-centroid.x, -centroid.y, 1);
        let stringRGBA = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

        centroidSegments.push(stringRGBA);
      }

      centroidLevel.push(centroidSegments);
    }

    setQualiaWavescape(centroidLevel);
  }, [dftCoeffsMatrix]);

  useEffect(() => {
    widthWs = elemsWidth;
    heightWs = elemsWidth;
    ticksHeight < 1
      ? setTicksHeight(1)
      : setTicksHeight(Math.floor(0.01 * elemsWidth));
  }, [elemsWidth]);

  useEffect(() => {
    const canvas = canvasRefWavescape.current;
    const ctx = canvas.getContext('2d');

    let margins = [marginWs, marginWs];
    let innerSize = [canvas.width - margins[0], canvas.height - margins[1]];
    let baseSubdivision = 50;

    ticks = computeTicks(
      innerSize[0],
      innerSize[1],
      baseSubdivision,
      margins[0],
      margins[1]
    );

    if (qualiaWavescape.length > 0) {
      baseSubdivision = qualiaWavescape[0].length;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      drawWavescape(ticks, ctx, qualiaWavescape);
    }

    setWsCoordinates(ticks);
  }, [widthWs, heightWs, qualiaWavescape]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}
    >
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
          {/* FOURIER QUALIA SPACE */}
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
                  .outerRadius(circleRadius + 1)
                  .startAngle(0)
                  .endAngle(2 * Math.PI)()}
              ></path>
            </g>

            <g transform={`translate(${width / 2},${width / 2})`}>
              {/* Hexagon */}
              <polygon
                points={`${labelsCoordinates.map((coordinate) => {
                  return `${coordinate[0] * (circleRadius - 1)},${
                    coordinate[1] * (circleRadius - 1)
                  } `;
                })}`}
                fill='none'
                stroke='black'
                strokeWidth={1}
              ></polygon>

              {/* Dahed lines */}
              <g>
                <line
                  x1='0'
                  y1={0.866 * (circleRadius - 1)}
                  x2='0'
                  y2={-0.866 * (circleRadius - 1)}
                  strokeDasharray='2'
                  stroke='black'
                />
                <line
                  x1={-0.75 * circleRadius}
                  y1={0.433 * circleRadius}
                  x2={0.75 * circleRadius}
                  y2={-0.433 * circleRadius}
                  strokeDasharray='2'
                  stroke='black'
                />
                <line
                  x1={0.75 * circleRadius}
                  y1={0.433 * circleRadius}
                  x2={-0.75 * circleRadius}
                  y2={-0.433 * circleRadius}
                  strokeDasharray='2'
                  stroke='black'
                />
              </g>

              {/* Labels */}
              <g>
                <g
                  transform={` translate(${
                    labelsCoordinates[0][0] * circleRadius
                  }, ${labelsCoordinates[0][1] * circleRadius}) rotate(${90})`}
                >
                  <text fontSize='14' textAnchor='middle' fill='black'>
                    Chromaticity
                  </text>
                </g>

                <g
                  transform={` translate(${
                    labelsCoordinates[1][0] * circleRadius
                  }, ${labelsCoordinates[1][1] * circleRadius}) rotate(${30})`}
                >
                  <text fontSize='14' textAnchor='middle' fill='black'>
                    Diatonicity
                  </text>
                </g>

                <g
                  transform={` translate(${
                    labelsCoordinates[2][0] * circleRadius
                  }, ${labelsCoordinates[2][1] * circleRadius}) rotate(${-30})`}
                >
                  <text fontSize='14' textAnchor='middle' fill='black'>
                    Triadicity
                  </text>
                </g>

                <g
                  transform={` translate(${
                    labelsCoordinates[3][0] * circleRadius
                  }, ${labelsCoordinates[3][1] * circleRadius}) rotate(${-90})`}
                >
                  <text fontSize='14' textAnchor='middle' fill='black'>
                    Octatonicity
                  </text>
                </g>

                <g
                  transform={` translate(${
                    labelsCoordinates[4][0] * circleRadius - 5
                  }, ${
                    labelsCoordinates[4][1] * circleRadius + 5
                  }) rotate(${30})`}
                >
                  <text fontSize='14' textAnchor='middle' fill='black'>
                    Whole-tone
                  </text>
                </g>

                <g
                  transform={` translate(${
                    labelsCoordinates[5][0] * circleRadius + 5
                  }, ${
                    labelsCoordinates[5][1] * circleRadius + 6
                  }) rotate(${-30})`}
                >
                  <text fontSize='14' textAnchor='middle' fill='black'>
                    Diadicity
                  </text>
                </g>
              </g>

              {/* Qualia current point */}
              {!isNaN(currentQualia.x) ? (
                <>
                  <circle
                    cx={currentQualia.x * circleRadius}
                    cy={-currentQualia.y * circleRadius}
                    r='6'
                    fill='white'
                  ></circle>
                  <circle
                    cx={currentQualia.x * circleRadius}
                    cy={-currentQualia.y * circleRadius}
                    r='3'
                    fill='black'
                  ></circle>
                </>
              ) : (
                <>
                  <circle cx={0} cy={0} r='6' fill='white'></circle>
                  <circle cx={0} cy={0} r='3' fill='black'></circle>
                </>
              )}
            </g>
          </g>
        </svg>

        {/* Wavescape */}
        <svg
          width={elemsWidth}
          height={elemsWidth}
          viewBox={`0 0 ${widthWs} ${heightWs}`}
          xmlns='http://www.w3.org/2000/svg'
        >
          <g
            transform={`scale(${1}, ${-verticalScale}) translate(${0},${
              -heightWs * 1.15
            })`} // TODO check height
          >
            <foreignObject x={0} y={0} width={widthWs} height={heightWs}>
              <canvas
                width={widthWs}
                height={heightWs}
                ref={canvasRefWavescape}
              ></canvas>
            </foreignObject>

            {/* Approximated phantom curve representation on the wavescape */}
            <line
              x1={0.5 * wsPhantomCurveHeight * widthWs + marginWs / 2}
              y1={(heightWs - 2 * marginWs) * wsPhantomCurveHeight + marginWs}
              x2={
                -0.5 * wsPhantomCurveHeight * widthWs + widthWs + marginWs / 2
              }
              y2={(heightWs - 2 * marginWs) * wsPhantomCurveHeight + marginWs}
              stroke='black'
              strokeDasharray='4 2'
            />

            {/* //Line ticks */}
            {wsCoordinates.length > 0
              ? wsCoordinates[0].map((coord, i) => (
                  <line
                    key={`tick${i}`}
                    x1={coord.x}
                    x2={coord.x}
                    y1={coord.y - ticksHeight}
                    y2={coord.y + ticksHeight}
                    stroke='grey'
                    strokeWidth='1px'
                  />
                ))
              : null}
            {/* Contour line */}
            {wsCoordinates.length > 0 && wsCoordinates[0].length > 0 ? (
              <>
                <line
                  x1={wsCoordinates[0][0].x}
                  x2={wsCoordinates[0][wsCoordinates[0].length - 1].x}
                  y1={wsCoordinates[0][0].y}
                  y2={wsCoordinates[0][wsCoordinates[0].length - 1].y}
                  stroke='grey'
                  strokeWidth='2px'
                />
                <line
                  x1={wsCoordinates[0][wsCoordinates[0].length - 1].x}
                  x2={wsCoordinates[wsCoordinates.length - 1][0].x}
                  y1={wsCoordinates[0][wsCoordinates[0].length - 1].y}
                  y2={wsCoordinates[wsCoordinates.length - 1][0].y}
                  stroke='grey'
                  strokeWidth='1px'
                />
                <line
                  x1={wsCoordinates[0][0].x}
                  x2={wsCoordinates[wsCoordinates.length - 1][0].x}
                  y1={wsCoordinates[0][0].y}
                  y2={wsCoordinates[wsCoordinates.length - 1][0].y}
                  stroke='grey'
                  strokeWidth='1px'
                />
              </>
            ) : null}
          </g>
        </svg>
      </Box>
    </Box>
  );
}

function computeTicks(
  innerWidth,
  innerHeight,
  baseSubdivision,
  marginLeft,
  marginTop
) {
  //Actually, it is a square matrix
  let unit = innerWidth / baseSubdivision;
  let mat = [];

  for (let i = 0; i < baseSubdivision + 1; i++) {
    let temp = [];
    for (let j = 0; j < baseSubdivision + 1; j++) {
      if (i <= j)
        temp.push({
          x: (j - i) * unit + (i * unit) / 2 + marginLeft,
          y: i * unit + marginTop,
        });
    }
    mat.push(temp);
  }

  return mat;
}

function drawWavescape(ticks, ctx, wavescapeMatrix) {
  for (let i = 0; i < ticks.length - 1; i++) {
    for (let j = 0; j < ticks[i].length - 1; j++) {
      if (i === 0) {
        //first row composed by triangles
        ctx.beginPath();
        ctx.moveTo(ticks[i][j].x, ticks[i][j].y);
        ctx.lineTo(ticks[i][j + 1].x, ticks[i][j + 1].y);
        ctx.lineTo(ticks[i + 1][j].x, ticks[i + 1][j].y);
        ctx.fillStyle = wavescapeMatrix[i][j];
        ctx.fill();
      } else {
        //other rows composed by diamonds
        ctx.beginPath();
        ctx.moveTo(ticks[i][j].x, ticks[i][j].y);
        ctx.lineTo(ticks[i - 1][j + 1].x, ticks[i - 1][j + 1].y);
        ctx.lineTo(ticks[i][j + 1].x, ticks[i][j + 1].y);
        ctx.lineTo(ticks[i + 1][j].x, ticks[i + 1][j].y);
        ctx.fillStyle = wavescapeMatrix[i][j];
        ctx.fill();
      }
    }
  }
}

export default QualiaModule;
