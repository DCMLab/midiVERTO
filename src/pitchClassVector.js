import dft from './DFT';
import { prototypesData } from './prototypesData';

class pitchClassCoord {
  constructor(coeff, label, id, x, y) {
    this.coeff = coeff;
    this.label = label;
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

const notesNames = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'Bb',
  'B',
];

//SET CLASSES
const setClasses = [
  // C  C# D  D# E  F  F# G  G# A  Bb B
  { name: 'Single Tone', pcv: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, //Single tone
  { name: 'Tritone', pcv: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0] }, //Tritone
  { name: 'Aug Triad', pcv: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] }, //Aug triad
  { name: 'Dim7', pcv: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] }, //dim 7
  { name: 'Whole-Tone Scale', pcv: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] }, //Whole-tone scale
  { name: 'Diatonic Scale', pcv: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1] }, //Diatonic scale
  { name: 'Hexatonic Scale', pcv: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1] }, //Hexatonic scale
  { name: 'Octatonic Scale', pcv: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1] }, //Octatonic scale
  { name: 'All Tones', pcv: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }, //All tones
];

/* let proto = {
  coeff: 1, //1,2,3,4,5,6 => all?
  lable: 'A',
  id: `${coeff}.${label}`,
  x: 11, //in px
  y: 11, //in px
} */

function pitchClassVector() {
  //Single tone: 12 shifts
  let temp = setClasses[0].pcv;
  let ris = [];
  for (let index = 0; index < notesNames.length; index++) {
    let risCoeff = dft(temp, true, true);
    temp = transpose(temp);
    ris.push(
      new pitchClassCoord(
        '15',
        notesNames[index],
        `15.${notesNames[index]}`,
        risCoeff[1].re,
        risCoeff[1].im
      )
    );
  }

  return ris;
}

function transpose(pcv) {
  const last = pcv[pcv.length - 1];
  pcv.pop();
  return [last, ...pcv];
}

export default pitchClassVector;
