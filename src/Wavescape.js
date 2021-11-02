import { useRef, useEffect, useState } from 'react';

const verticalScale = Math.sin(Math.PI / 3);

export const Wavescape = ({
  wavescapeMatrix,
  currentWavescapeSubdiv,
  wavescapeWidth,
}) => {
  const canvasRef = useRef(null);
  const [wsCoordinates, setWsCoordinates] = useState([]);
  const margin = 10;
  let width = wavescapeWidth - margin;
  let height = wavescapeWidth;
  let ticks;

  useEffect(() => {
    width = wavescapeWidth;
    height = wavescapeWidth;
    console.log(wavescapeWidth);
  }, [wavescapeWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // increase the actual size of our canvas
    //canvas.width = width * devicePixelRatio;
    //canvas.height = height * devicePixelRatio;

    // ensure all drawing operations are scaled
    //ctx.scale(devicePixelRatio, devicePixelRatio);

    // scale everything down using CSS
    //canvas.style.width = width + 'px';
    //canvas.style.height = height + 'px';

    let margins = [margin, margin];
    let innerSize = [canvas.width - margins[0], canvas.height - margins[1]];
    let baseSubdivision;

    if (wavescapeMatrix) {
      baseSubdivision = wavescapeMatrix[0].length;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      //ctx.setTransform(1, 0, 0, -1, 0, ctx.canvas.height);
      ticks = computeTicks(
        innerSize[0],
        innerSize[1],
        baseSubdivision,
        margins[0],
        margins[1]
      );

      setWsCoordinates(ticks);

      //Vertical scaling to make the triangle equilateral
      //ctx.scale(1, verticalScale);
      drawWavescape(ticks, ctx, wavescapeMatrix);
    }
  }, [wavescapeMatrix, width, height]);

  useEffect(() => {}, [wavescapeMatrix]);

  return (
    <svg
      width={width + margin}
      height={height}
      transform={`scale(${1}, ${-verticalScale})`}
    >
      <foreignObject x={0} y={0} width={width} height={height}>
        <canvas width={width} height={height} ref={canvasRef}></canvas>
      </foreignObject>
      <g
      /*  transform={`scale(${1 / devicePixelRatio}, ${
          1 / devicePixelRatio
        }) translate(${0},${height * devicePixelRatio})`} */
      >
        {/* //Line ticks */}
        {wsCoordinates.length > 0
          ? wsCoordinates[0].map((coord, i) => (
              <line
                key={`tick${i}`}
                x1={coord.x}
                x2={coord.x}
                y1={coord.y - 3}
                y2={coord.y + 3}
                stroke='grey'
                strokeWidth='1px'
              />
            ))
          : null}
        {/* Contour line */}
        {wsCoordinates.length > 0 ? (
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
            <circle
              cx={
                (wsCoordinates[0][currentWavescapeSubdiv].x +
                  wsCoordinates[0][currentWavescapeSubdiv + 1].x) /
                2
              }
              cy={
                (wsCoordinates[0][currentWavescapeSubdiv].y +
                  wsCoordinates[0][currentWavescapeSubdiv + 1].y) /
                2
              }
              r={0.01 * width}
              fill='white'
            />
            <circle
              cx={
                (wsCoordinates[0][currentWavescapeSubdiv].x +
                  wsCoordinates[0][currentWavescapeSubdiv + 1].x) /
                2
              }
              cy={
                (wsCoordinates[0][currentWavescapeSubdiv].y +
                  wsCoordinates[0][currentWavescapeSubdiv + 1].y) /
                2
              }
              r={0.01 * width}
              stroke='black'
              strokeWidth={1}
              fill='transparent'
            />
          </>
        ) : null}
      </g>
    </svg>
  );
};

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
