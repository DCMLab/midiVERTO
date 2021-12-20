/**
 * Compute the points of the rose's shape
 * see https://en.wikipedia.org/wiki/Rose_(mathematics)
 * @param {number} n numerator
 * @param {number} d denominator
 * @returns array
 */
export function getRosePoints(n, d) {
  let dataPoints = [];

  //Increase delta step to have less points
  for (let delta = 0; delta < 2 * Math.PI * d; delta += 0.01) {
    let r = 10 * Math.cos((n / d) * delta);
    let x = r * Math.cos(delta);
    let y = r * Math.sin(delta);

    dataPoints.push([x, y]);
  }

  return dataPoints;
}
