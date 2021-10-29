import { useRef, useEffect } from 'react';

export const Wavescape = ({ wavescapeMatrix }) => {
  const canvasRef = useRef(null);
  let width = 440;
  let height = 440;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // increase the actual size of our canvas
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    // ensure all drawing operations are scaled
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // scale everything down using CSS
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    let margins = [0, 0];
    let innerSize = [canvas.width - margins[0], canvas.height - margins[1]];
    let baseSubdivision;

    if (wavescapeMatrix) {
      baseSubdivision = wavescapeMatrix[0].length;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.setTransform(1, 0, 0, -1, 0, ctx.canvas.height);
      let ticks = computeTicks(
        innerSize[0],
        innerSize[1],
        baseSubdivision,
        margins[0],
        margins[1]
      );

      drawWavescape(ticks, ctx, wavescapeMatrix);
    }
  }, [wavescapeMatrix, width, height]);

  return <canvas width={width} height={height} ref={canvasRef}></canvas>;
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
