import * as math from 'mathjs';

// Compute the DFT on the input pcv
export default function dft(
  pcv,
  normalize = true,
  round = false,
  polar = false
) {
  let N = pcv.length;

  let coeffs = [];

  for (let k = 0; k < N; k++) {
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

  coeffs = coeffs.slice(0, 7);

  if (normalize) {
    const norm = coeffs[0];
    coeffs = coeffs.map((coeff) => math.divide(coeff, norm));
  }

  if (round) {
    coeffs.forEach((coeff) => {
      coeff.re = Math.round(coeff.re * 100) / 100;
      coeff.im = Math.round(coeff.im * 100) / 100;
    });
  }

  if (polar) {
    coeffs = coeffs.map((coeff) => coeff.toPolar());
  }

  return coeffs;
}
