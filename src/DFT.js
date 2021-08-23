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
    coeffs = coeffs.map((coeff) => math.divide(coeff, norm));
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

export function sumAndNormalize(coeffs1, coeffs2) {
  let ris = [];

  for (let i = 0; i < coeffs1.length; i++) {
    ris[i] = math.add(coeffs1[i], coeffs2[i]);
  }

  const norm = ris[0];
  ris = ris.map((coeff) => math.divide(coeff, norm));

  return ris;
}
