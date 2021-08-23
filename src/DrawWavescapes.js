import { useRef, useEffect } from 'react';

export const DrawWavescapes = ({ wavescapeMatrix }) => {
  const canvasRef = useRef(null);
  let width = 500;
  let height = 500;

  console.log(wavescapeMatrix);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let margins = [100, 100];
    let innerSize = [canvas.width - margins[0], canvas.height - margins[1]];

    if (wavescapeMatrix.length > 0) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      //ctx.setTransform(1, 0, 0, -1, 0, ctx.canvas.height);
      ctx.beginPath();
      ctx.moveTo(margins[0], margins[1]);
      ctx.lineTo(innerSize[0], margins[1]);
      ctx.lineTo(canvas.width / 2, innerSize[1]);
      ctx.fill();
    }
  }, [wavescapeMatrix]);

  return <canvas width={width} height={height} ref={canvasRef}></canvas>;
};

function drawFirstRow(ctx) {}
