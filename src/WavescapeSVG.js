import React from 'react';

const verticalScale = Math.sin(Math.PI / 3);

//Generates SVGs of the wavescapes for the exporting,
//see Wavescape.js
function WavescapeSVG({
  wsNumber,
  wavescapeMatrix,
  showNumber,
  wsPhantomCurveHeight,
}) {
  const margin = 10;
  const width = 400;
  const height = width;
  /* const [wsCoordinates, setWsCoordinates] = useState([]); */

  let margins = [margin, margin];
  let innerSize = [width - margins[0], width - margins[1]];
  let baseSubdivision;
  let wsCoordinates;

  baseSubdivision = wavescapeMatrix[0].length;
  wsCoordinates = computeTicks(
    innerSize[0],
    innerSize[1],
    baseSubdivision,
    margins[0],
    margins[1]
  );

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      id={`wavescape${wsNumber}`}
      width={width + margin}
      height={height}
    >
      {showNumber ? (
        <g transform={`translate(32,20)`}>
          <circle cx='12' cy='12' r='13' fill='black' />
          <text fontSize='24' textAnchor='middle' x='12' y='20' fill='white'>
            {wsNumber}
          </text>
        </g>
      ) : null}

      <g
        transform={`scale(${1}, ${-verticalScale}) translate(${0},${
          -height - 2 * margin
        })`}
      >
        {/* Approximated phantom curve representation on the wavescape */}
        <line
          x1={0.5 * wsPhantomCurveHeight * width + margin / 2}
          y1={(height - 2 * margin) * wsPhantomCurveHeight + margin}
          x2={-0.5 * wsPhantomCurveHeight * width + width + margin / 2}
          y2={(height - 2 * margin) * wsPhantomCurveHeight + margin}
          stroke='black'
          strokeDasharray='4 2'
        />

        {/* Contour line */}
        {wsCoordinates.length > 0 ? (
          <>
            <line
              x1={wsCoordinates[0][0].x}
              x2={wsCoordinates[0][wsCoordinates[0].length - 1].x}
              y1={wsCoordinates[0][0].y}
              y2={wsCoordinates[0][wsCoordinates[0].length - 1].y}
              stroke='grey'
              strokeWidth='1px'
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
        {wavescapeMatrix.map((row, i) => {
          return row.map((elem, j) => {
            if (i === 0) {
              return (
                <polygon
                  points={`${wsCoordinates[i][j].x},${wsCoordinates[i][j].y}
                 ${wsCoordinates[i][j + 1].x},${wsCoordinates[i][j + 1].y} 
                 ${wsCoordinates[i + 1][j].x},${wsCoordinates[i + 1][j].y}`}
                  fill={elem.rgb}
                  fillOpacity={elem.alpha}
                />
              );
            } else {
              return (
                <polygon
                  points={`
                 ${wsCoordinates[i][j].x},${wsCoordinates[i][j].y}
                 ${wsCoordinates[i - 1][j + 1].x},${
                    wsCoordinates[i - 1][j + 1].y
                  }
                 ${wsCoordinates[i][j + 1].x},${wsCoordinates[i][j + 1].y} 
                 ${wsCoordinates[i + 1][j].x},${wsCoordinates[i + 1][j].y}
                 `}
                  fill={elem.rgb}
                  fillOpacity={elem.alpha}
                />
              );
            }
          });
        })}
      </g>
    </svg>
  );
}

export default WavescapeSVG;

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
