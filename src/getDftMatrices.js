import { Midi } from '@tonejs/midi';
import dft, { sumAndNormalize } from './DFT';
import { getRgbaFromComplex, pixelColor } from './colorMapping';

class Pcv {
  constructor() {
    this.C = 0;
    this.Cs = 0;
    this.D = 0;
    this.Ds = 0;
    this.E = 0;
    this.F = 0;
    this.Fs = 0;
    this.G = 0;
    this.Gs = 0;
    this.A = 0;
    this.As = 0;
    this.B = 0;
  }

  addNoteDuration(targetPitch, duration) {
    switch (targetPitch) {
      case 'C':
        this.C += duration;
        break;
      case 'C#':
        this.Cs += duration;
        break;
      case 'D':
        this.D += duration;
        break;
      case 'D#':
        this.Ds += duration;
        break;
      case 'E':
        this.E += duration;
        break;
      case 'F':
        this.F += duration;
        break;
      case 'F#':
        this.Fs += duration;
        break;
      case 'G':
        this.G += duration;
        break;
      case 'G#':
        this.Gs += duration;
        break;
      case 'A':
        this.A += duration;
        break;
      case 'A#':
        this.As += duration;
        break;
      case 'B':
        this.B += duration;
        break;
      default:
        break;
    }
  }

  getPcvAsArray() {
    let temp = [
      this.C,
      this.Cs,
      this.D,
      this.Ds,
      this.E,
      this.F,
      this.Fs,
      this.G,
      this.Gs,
      this.A,
      this.As,
      this.B,
    ];

    return temp;
  }

  add(pcv) {
    this.C = pcv.C;
    this.Cs = pcv.Cs;
    this.D = pcv.D;
    this.Ds = pcv.Ds;
    this.E = pcv.E;
    this.F = pcv.F;
    this.Fs = pcv.Fs;
    this.G = pcv.G;
    this.Gs = pcv.Gs;
    this.A = pcv.A;
    this.As = pcv.As;
    this.B = pcv.B;
  }
}

export function getMidiFileDataObject(binMidiFile) {
  let midiData = new Midi(binMidiFile);

  let tempos = midiData.header.tempos.map((tempo) => Math.round(tempo.bpm));
  let midiBpm = Math.max(...tempos); //For quarter-note conversion

  //Check and delete percussive tracks!
  let nonPercussiveTracks = midiData.tracks.filter(
    (track) => track.instrument.percussion === false
  );

  midiData.tracks = nonPercussiveTracks;

  return { midiData, midiBpm };
}

export function getDftCoeffStatic(midiFile, resolution) {
  let tracksSubdivision = [];

  midiFile.tracks.forEach((track) =>
    tracksSubdivision.push(
      getSubdivision(track.notes, resolution, midiFile.duration)
    )
  );
  //console.log(tracksSubdivision);

  //pcv arrary init
  let pcvSubdivision = [];

  for (let i = 0; i < tracksSubdivision[0].length; i++) {
    pcvSubdivision.push(new Pcv());
  }

  //populating the array for each subdiv with the durations
  //for each track: i, for each subdiv: j, for each note of the subdiv: k
  for (let i = 0; i < tracksSubdivision.length; i++) {
    for (let j = 0; j < tracksSubdivision[i].length; j++) {
      for (let k = 0; k < tracksSubdivision[i][j].length; k++) {
        let { pitch, duration } = tracksSubdivision[i][j][k];
        pcvSubdivision[j].addNoteDuration(pitch, duration);
      }
    }
  }

  //Computing the dft coeffs for of each subdiv
  let dftCoeffsSubdivision = pcvSubdivision.map((pcv) =>
    dft(pcv.getPcvAsArray())
  );

  //Computing the dft coeffs matrix
  let dftCoeffsMatrix = [];

  //adding the first row
  dftCoeffsMatrix.push(dftCoeffsSubdivision);

  return dftCoeffsMatrix;
}

export function getDftCoeffDynamic(midiData, resolutionMode, currentSongBPM) {
  let { noteResolutionValue, seconds, useSeconds } = resolutionMode;

  let resolution;
  if (useSeconds) {
    isNaN(seconds) ? (resolution = 1) : (resolution = seconds);
  } else {
    //Use bpm
    resolution = noteResolutionValue * (60 / currentSongBPM);
  }

  //console.log(currentSongBPM);
  //console.log(resolution);

  let duration = midiData.duration;
  let tracksSubdivision = [];

  //TODO: check and delete percussive tracks!
  let nonPercussiveTracks = midiData.tracks.filter(
    (track) => track.instrument.percussion === false
  );

  nonPercussiveTracks.forEach((track) => {
    tracksSubdivision.push(getSubdivision(track.notes, resolution, duration));
  });

  //pcv arrary init
  let pcvSubdivision = [];

  for (let i = 0; i < tracksSubdivision[0].length; i++) {
    pcvSubdivision.push(new Pcv());
  }

  //populating the array for each subdiv with the durations
  //for each track: i, for each subdiv: j, for each note of the subdiv: k
  for (let i = 0; i < tracksSubdivision.length; i++) {
    for (let j = 0; j < tracksSubdivision[i].length; j++) {
      for (let k = 0; k < tracksSubdivision[i][j].length; k++) {
        let { pitch, duration } = tracksSubdivision[i][j][k];
        pcvSubdivision[j].addNoteDuration(pitch, duration);
      }
    }
  }

  //Computing the dft coeffs for of each subdiv
  let dftCoeffsSubdivision = pcvSubdivision.map((pcv) =>
    dft(pcv.getPcvAsArray())
  );

  //Computing the dft coeffs matrix
  let dftCoeffsMatrix = [];

  //adding the first row
  dftCoeffsMatrix.push(dftCoeffsSubdivision);

  //Subdividing the first row of the dft coeff matrix to get the trace for each coeff
  let traces = [];
  let firstRow = dftCoeffsMatrix[0];
  for (let i = 1; i < 7; i++) {
    let temp = [];
    for (let j = 0; j < firstRow.length; j++) {
      temp.push({ x: firstRow[j][i].re, y: firstRow[j][i].im });
    }
    traces.push(temp);
  }

  return { tracesData: traces, resolution: resolution };
}

//Resolution is in seconds
export function getDftCoeffFromMidiLinear(
  midiFile,
  multiRes = 1,
  seconds = 1,
  useSeconds
) {
  //For now, we don't take into account tempo changes
  let midiData = new Midi(midiFile);
  console.log(midiData);

  let resolution;
  if (useSeconds) {
    isNaN(seconds) ? (resolution = 1) : (resolution = seconds);
  } else {
    //Use bpm
    let tempos = midiData.header.tempos.map((tempo) => Math.round(tempo.bpm));
    let bpm = Math.max(...tempos); //For quarter-note conversion
    resolution = multiRes * (60 / bpm);
  }

  console.log(resolution);

  let duration = midiData.duration;
  let tracksSubdivision = [];

  //TODO: check and delete percussive tracks!
  let nonPercussiveTracks = midiData.tracks.filter(
    (track) => track.instrument.percussion === false
  );

  nonPercussiveTracks.forEach((track) => {
    tracksSubdivision.push(getSubdivision(track.notes, resolution, duration));
  });

  //pcv arrary init
  let pcvSubdivision = [];

  for (let i = 0; i < tracksSubdivision[0].length; i++) {
    pcvSubdivision.push(new Pcv());
  }

  //populating the array for each subdiv with the durations
  //for each track: i, for each subdiv: j, for each note of the subdiv: k
  for (let i = 0; i < tracksSubdivision.length; i++) {
    for (let j = 0; j < tracksSubdivision[i].length; j++) {
      for (let k = 0; k < tracksSubdivision[i][j].length; k++) {
        let { pitch, duration } = tracksSubdivision[i][j][k];
        pcvSubdivision[j].addNoteDuration(pitch, duration);
      }
    }
  }

  //Computing the dft coeffs for of each subdiv
  let dftCoeffsSubdivision = pcvSubdivision.map((pcv) =>
    dft(pcv.getPcvAsArray())
  );

  //Computing the dft coeffs matrix
  let dftCoeffsMatrix = [];

  //adding the first row
  dftCoeffsMatrix.push(dftCoeffsSubdivision);

  return { dftCoeffsLinear: dftCoeffsMatrix, resolution: resolution };
}

//Resolution is in seconds
export function getDftCoeffFromMidi(midiFile, resolution) {
  //For now, we don't take into account tempo changes
  let midiData = new Midi(midiFile);
  console.log(midiData);
  //const bpm = midiData.header.tempos[0].bpm; //For quarter-note conversion
  let duration = midiData.duration;
  let tracksSubdivision = [];

  //TODO: check and delete percussive tracks!
  let nonPercussiveTracks = midiData.tracks.filter(
    (track) => track.instrument.percussion === false
  );

  /* midiData.tracks.forEach((track) => {
    let tempMat = [];

    for (let wndLen = resolution; wndLen < duration; wndLen += resolution) {
      tempMat.push(getRow(track.notes, wndLen, resolution, duration));
    }
    //Since wndLen < duration, the for cycle do not include the top vertex of the triangle
    tempMat.push(getRow(track.notes, duration, duration, duration)); //manually added

    trackMatrices.push(tempMat);
  }); */

  nonPercussiveTracks.forEach((track) => {
    tracksSubdivision.push(getSubdivision(track.notes, resolution, duration));
  });

  //pcv arrary init
  let pcvSubdivision = [];

  for (let i = 0; i < tracksSubdivision[0].length; i++) {
    pcvSubdivision.push(new Pcv());
  }

  //populating the array for each subdiv with the durations
  //for each track: i, for each subdiv: j, for each note of the subdiv: k
  for (let i = 0; i < tracksSubdivision.length; i++) {
    for (let j = 0; j < tracksSubdivision[i].length; j++) {
      for (let k = 0; k < tracksSubdivision[i][j].length; k++) {
        let { pitch, duration } = tracksSubdivision[i][j][k];
        pcvSubdivision[j].addNoteDuration(pitch, duration);
      }
    }
  }

  //Computing the dft coeffs for of each subdiv
  let dftCoeffsSubdivision = pcvSubdivision.map((pcv) =>
    dft(pcv.getPcvAsArray())
  );

  //Computing the dft coeffs matrix
  let dftCoeffsMatrix = [];

  //adding the first row
  dftCoeffsMatrix.push(dftCoeffsSubdivision);

  return dftCoeffsMatrix;

  /* OLD   //Computing each row of the matrix as the normalized sum of the previous row (dft as linear op)
  let matrixHeight = dftCoeffsSubdivision.length;
  let rowsWidth = dftCoeffsSubdivision.length;
  for (let i = 1; i < matrixHeight; i++) {
    //starting from second row, first already populated
    let temp = [];
    for (let cursor = 1; cursor < rowsWidth; cursor++) {
      //starting from the second element and backward summing
      temp.push(
        //TODO change, sum subdiv only on first row
        sumAndNormalize(
          dftCoeffsMatrix[i - 1][cursor - 1],
          dftCoeffsMatrix[i - 1][cursor]
        )
      );
    }
    rowsWidth--;
    dftCoeffsMatrix.push(temp);
  } */
}

export function getRgbaMatrix(dftCoeffsMatrix) {
  //Computing each row of the matrix as the normalized sum of the previous row (dft as linear op)
  let matrixHeight = dftCoeffsMatrix[0].length;
  let rowsWidth = dftCoeffsMatrix[0].length;
  let wndLenUnits = 2;
  for (let i = 1; i < matrixHeight; i++) {
    //starting from second row, first already populated
    let temp = [];
    for (let cursor = 0; cursor + wndLenUnits <= rowsWidth; cursor++) {
      let windowed = dftCoeffsMatrix[0].slice(cursor, cursor + wndLenUnits);
      temp.push(sumAndNormalize(windowed));
    }
    wndLenUnits++;
    dftCoeffsMatrix.push(temp);
  }

  /* //Computing the pcvs for each subdivision
  let pcvMatrix = [];

  for (let i = 0; i < trackMatrices[0].length; i++) {
    let temp = [];
    for (let k = 0; k < trackMatrices[0][i].length; k++) {
      temp.push(new Pcv());
    }
    pcvMatrix.push(temp);
  } */

  /* trackMatrices.forEach((track) => {
    for (let i = 0; i < track.length; i++) {
      for (let j = 0; j < track[i].length; j++) {
        for (let k = 0; k < track[i][j].length; k++) {
          let { pitch, duration } = track[i][j][k];
          pcvMatrix[i][j].addNoteDuration(pitch, duration);
        }
      }
    }
  }); */

  /* //Computing the dft coeff matrix
  let dftCoeffMatrix = [];

  for (let i = 0; i < pcvMatrix.length; i++) {
    let temp = [];
    for (let j = 0; j < pcvMatrix[i].length; j++) {
      temp.push(dft(pcvMatrix[i][j].getPcvAsArray()));
    }
    dftCoeffMatrix.push(temp);
  } */

  let rgbaMatrices = [];

  for (let i = 0; i < 6; i++) {
    let matrix = [];
    for (let j = 0; j < dftCoeffsMatrix.length; j++) {
      let subdiv = [];
      for (let k = 0; k < dftCoeffsMatrix[j].length; k++) {
        subdiv.push('');
      }
      matrix.push(subdiv);
    }
    rgbaMatrices.push(matrix);
  }

  //Creating a single matrix for each coefficient with rgba values for each diamond
  for (let i = 0; i < dftCoeffsMatrix.length; i++) {
    for (let j = 0; j < dftCoeffsMatrix[i].length; j++) {
      for (let k = 1; k < dftCoeffsMatrix[i][j].length; k++) {
        rgbaMatrices[k - 1][i][j] = getRgbaFromComplex(
          dftCoeffsMatrix[i][j][k]
        );
      }
    }
  }

  return rgbaMatrices;
}

function getSubdivision(notes, resolution, duration) {
  let subdivision = [];
  let wndLen = resolution;

  for (let cursor = 0; cursor < duration; cursor += resolution) {
    let temp = [];
    notes.forEach((note) => {
      let { time, duration } = note;

      //Check if note contribute to the current window
      if (isValidNote(time, duration, cursor, wndLen)) {
        let noteAndDuration = { pitch: note.pitch };
        //Computation of note contribution in the current window
        if (time < cursor) {
          if (time + duration < cursor + wndLen)
            noteAndDuration.duration = time + duration - cursor;
          else noteAndDuration.duration = wndLen;
        } else {
          if (time + duration <= cursor + wndLen)
            noteAndDuration.duration = duration;
          else noteAndDuration.duration = cursor + wndLen - time;
        }

        temp.push(noteAndDuration);
      }
    });

    subdivision.push(temp);
  }

  return subdivision;
}

function isValidNote(time, duration, cursor, wndLen) {
  if (
    (time > cursor && time < cursor + wndLen) ||
    (time + duration > cursor && time + duration < cursor + wndLen) ||
    (time <= cursor && time + duration >= cursor + wndLen)
  ) {
    return true;
  }
  return false;
}

export function getComplementaryColours(coeffs) {
  let colours = [];

  //Opposite of re and im to get the complementary colour
  coeffs.forEach((coeff) => {
    let rho = Math.sqrt(Math.pow(coeff.re, 2) + Math.pow(coeff.im, 2));
    let rgba = pixelColor(coeff.re, -coeff.im, rho);

    //RGB complementary
    rgba.r = 255 - rgba.r;
    rgba.g = 255 - rgba.g;
    rgba.b = 255 - rgba.b;

    colours.push(rgbaToHexa(rgba));
  });

  return colours;
}

function rgbaToHexa(rgba) {
  let hexa = Object.keys(rgba).map((key) => colorToHex(rgba[key]));
  return `#${hexa.join('')}`;
}

function colorToHex(color) {
  let hexadecimal = color.toString(16);
  return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}
