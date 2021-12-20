//Import libraries
import * as math from 'mathjs';

/**
 * Compute the DFT of a PCV
 * @param {array} pcv pitch-class vector
 * @param {boolean} normalize true for normalizing the output value
 * @param {boolean} round true for rounding the output value
 * @param {boolean} polar true for changing coordinates to the output value
 * @returns {array}
 */
export default function dft(
  pcv,
  normalize = true,
  round = false,
  polar = false
) {
  let N = pcv.length;

  let coeffs = [];

  for (let k = 0; k < N / 2 + 1; k++) {
    let temp = 0;
    for (let n = 0; n < N; n++) {
      temp = math.add(
        math.multiply(
          pcv[n],
          math.exp(math.multiply(math.i, (-2 * math.pi * k * n) / N))
        ),
        temp
      );
    }
    coeffs.push(temp);
  }

  coeffs = coeffs.slice();

  if (normalize) {
    const norm = coeffs[0];
    //'!=' gives a warning but '!==' doesn't compute correctly the if statement
    if (norm != 0) coeffs = coeffs.map((coeff) => math.divide(coeff, norm));
  }

  if (round) {
    coeffs.forEach((coeff) => {
      coeff.re = Math.round(coeff.re * 10000) / 10000;
      coeff.im = Math.round(coeff.im * 10000) / 10000;
    });
  }

  if (polar) {
    coeffs = coeffs.map((coeff) => coeff.toPolar());
  }

  return coeffs;
}

/**
 * Sum the coefficients and normalize the result, used to compute the
 * rows of the wavescape by expoliting the linearity of the DFT
 * @param {array} coeffs Array of coefficients
 * @returns
 */
export function sumAndNormalize(coeffs) {
  //Sum init
  let sum = coeffs[0];

  for (let i = 1; i < coeffs.length; i++) {
    let temp = [];

    //incremental sum for each coeff
    for (let j = 0; j < coeffs[i].length; j++) {
      temp.push(math.add(sum[j], coeffs[i][j]));
    }
    //Clone array
    sum = temp.slice();
  }

  //Normalize
  const norm = sum[0];
  if (norm != 0) sum = sum.map((coeff) => math.divide(coeff, norm));

  return sum;
}
