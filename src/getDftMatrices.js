//Import functions
import { Midi } from '@tonejs/midi';
import dft, { sumAndNormalize } from './DFT';
import { getRgbaFromComplex } from './colorMapping';

//Pitch-class vector class
class Pcv {
  //"s" is sharp
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

  /**
   * Add duration in seconds to the specified pitch attribute.
   * @param {string} targetPitch pitch to which add the duration
   * @param {number} duration seconds
   */
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

  /**
   * Return the object's attributes as an array
   * @returns array
   */
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

  /**
   * Class addition
   * @param {object} pcv
   */
  add(pcv) {
    this.C += pcv.C;
    this.Cs += pcv.Cs;
    this.D += pcv.D;
    this.Ds += pcv.Ds;
    this.E += pcv.E;
    this.F += pcv.F;
    this.Fs += pcv.Fs;
    this.G += pcv.G;
    this.Gs += pcv.Gs;
    this.A += pcv.A;
    this.As += pcv.As;
    this.B += pcv.B;
  }
}

/**
 * Read the MIDI file, remove percussive tracks and return it as an object
 * @param {binary} binMidiFile MIDI file in binary code
 * @returns object
 */
export function getMidiFileDataObject(binMidiFile) {
  //Read file
  let midiData = new Midi(binMidiFile);

  //We assume that song's tempo is the fastest one
  //(since many picies slow down in some parts)
  let tempos = midiData.header.tempos.map((tempo) => Math.round(tempo.bpm));
  let midiBpm = Math.max(...tempos); //BPM used for quarter-note conversion

  //Check and delete percussive tracks
  let nonPercussiveTracks = midiData.tracks.filter(
    (track) => track.instrument.percussion === false
  );

  midiData.tracks = nonPercussiveTracks;

  return { midiData, midiBpm };
}

/**
 * Compute the first row of the wavescapes (from 0th to 6th).
 * @param {object} midiFile
 * @param {number} resolution in seconds
 * @returns array
 */
export function getDftCoeffStatic(midiFile, resolution) {
  let tracksSubdivision = [];

  //Subdivide the tracks by the resolution
  midiFile.tracks.forEach((track) =>
    tracksSubdivision.push(
      getSubdivision(track.notes, resolution, midiFile.duration)
    )
  );

  //PCV array init
  let pcvSubdivision = [];

  //For each subdivision, create a PCV
  for (let i = 0; i < tracksSubdivision[0].length; i++) {
    pcvSubdivision.push(new Pcv());
  }

  //Compute the PCVs for each subdivision
  //FOR LOOP:
  //i --> i-th track
  //j --> j-th subdivision in the i-th track
  //k --> k-th note in j-th subdivision
  for (let i = 0; i < tracksSubdivision.length; i++) {
    for (let j = 0; j < tracksSubdivision[i].length; j++) {
      for (let k = 0; k < tracksSubdivision[i][j].length; k++) {
        let { pitch, duration } = tracksSubdivision[i][j][k];
        //Add note duration/contribution to the PCV
        pcvSubdivision[j].addNoteDuration(pitch, duration);
      }
    }
  }

  //Computing the DFT coefficients for of each subdivision
  let dftCoeffsSubdivision = pcvSubdivision.map((pcv) =>
    dft(pcv.getPcvAsArray())
  );

  //Computing the whole matrix
  let dftCoeffsMatrix = [];

  //Adding the first row
  dftCoeffsMatrix.push(dftCoeffsSubdivision);

  //Computing each row of the matrix as the normalized sum of the
  //previous row by using a sliding window of incrementing length

  let matrixHeight = dftCoeffsMatrix[0].length;
  let baseLength = dftCoeffsMatrix[0].length;

  //The second row is composed by segments of length 2, third row is...
  let wndLenUnits = 2;

  //For each row of the matrix, starting from second row
  for (let i = 1; i < matrixHeight; i++) {
    let temp = [];

    //Slinding window of hop size = 1
    for (let cursor = 0; cursor + wndLenUnits <= baseLength; cursor++) {
      //Extract the windowed subdivisions
      let windowed = dftCoeffsMatrix[0].slice(cursor, cursor + wndLenUnits);
      //The new element of the i-th row is the normalized sum
      //of segments extracted from the previous row
      temp.push(sumAndNormalize(windowed));
    }
    wndLenUnits++;
    dftCoeffsMatrix.push(temp);
  }

  return dftCoeffsMatrix;
}

/**
 * Compute the traces on the Fourier spaces for the given resolution
 * @param {object} midiData
 * @param {object} resolutionMode
 * @param {number} currentSongBPM
 * @returns traces and resolution
 */
export function getDftCoeffDynamic(
  midiData,
  resolutionMode,
  currentSongBPM,
  normalizationType
) {
  let { noteResolutionValue, seconds, useSeconds } = resolutionMode;

  let resolution;
  //Set resolution depending on which mode is selected
  if (useSeconds) {
    //Use seconds
    isNaN(seconds) ? (resolution = 1) : (resolution = seconds);
  } else {
    //Use music values
    resolution = noteResolutionValue * (60 / currentSongBPM);
  }

  let duration = midiData.duration;
  let tracksSubdivision = [];

  //Subdivide the tracks by the resolution
  midiData.tracks.forEach((track) => {
    tracksSubdivision.push(getSubdivision(track.notes, resolution, duration));
  });

  //PCV array init
  let pcvSubdivision = [];

  //For each subdivision, create a PCV
  for (let i = 0; i < tracksSubdivision[0].length; i++) {
    pcvSubdivision.push(new Pcv());
  }

  //Compute the PCVs for each subdivision
  //FOR LOOP:
  //i --> i-th track
  //j --> j-th subdivision in the i-th track
  //k --> k-th note in j-th subdivision
  for (let i = 0; i < tracksSubdivision.length; i++) {
    for (let j = 0; j < tracksSubdivision[i].length; j++) {
      for (let k = 0; k < tracksSubdivision[i][j].length; k++) {
        let { pitch, duration } = tracksSubdivision[i][j][k];
        //Add note duration/contribution to the PCV
        pcvSubdivision[j].addNoteDuration(pitch, duration);
      }
    }
  }

  //Cloning unnormalized pcvs distribution for normalization with different window lengths
  let pcDistributions = [...pcvSubdivision].map((pcv) => {
    let newPcv = new Pcv();
    newPcv.add(pcv);
    return newPcv;
  });

  switch (normalizationType) {
    case 'sum':
      pcvSubdivision = sumNorm(pcvSubdivision);
      break;

    case 'power':
      pcvSubdivision = powerNorm(pcvSubdivision);
      break;

    default:
      break;
  }

  //Computing the DFT coefficients for of each subdivision
  let dftCoeffsSubdivision = pcvSubdivision.map((pcv) =>
    dft(pcv.getPcvAsArray(), false)
  );

  //Generating the traces by subdividing for the coefficient number
  let traces = [];
  //Skipping coefficient zero since it will not be plotted
  for (let i = 1; i < 7; i++) {
    let temp = [];
    for (let j = 0; j < dftCoeffsSubdivision.length; j++) {
      temp.push({
        x: dftCoeffsSubdivision[j][i].re,
        y: dftCoeffsSubdivision[j][i].im,
      });
    }
    traces.push(temp);
  }

  return {
    tracesData: traces,
    resolution: resolution,
    currPcDistributions: pcDistributions,
  };
}

/**
 * Map the points of the wavescape to RGBA value and subdivide by
 * coefficient number
 * @param {matrix} dftCoeffsMatrix
 * @returns
 */
export function getRgbaMatrix(dftCoeffsMatrix) {
  let rgbaMatrices = [];

  //Subdividing by coefficient number
  for (let i = 0; i < 6; i++) {
    let temp = [];
    for (let j = 0; j < dftCoeffsMatrix.length; j++) {
      let subdiv = [];
      for (let k = 0; k < dftCoeffsMatrix[j].length; k++) {
        subdiv.push('');
      }
      temp.push(subdiv);
    }
    rgbaMatrices.push(temp);
  }

  //Mapping to the color space
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

/**
 * Subdivide pitches in each time window defined by the reslution
 * @param {array} notes all the notes of a track
 * @param {number} resolution in seconds
 * @param {number} duration MIDI file duration in seconds
 * @returns
 */
function getSubdivision(notes, resolution, duration) {
  //Song's general subdivision
  let subdivision = [];
  let wndLen = resolution;

  //Traverse the song moving with a step of size wndLen (=resolution)
  //Cursor is the beginning of the current window
  for (let cursor = 0; cursor < duration; cursor += resolution) {
    let temp = [];

    //Assing each note to a window/subdivision
    notes.forEach((note) => {
      //Extract note's starting time duration
      let { time, duration } = note;

      //Check if a note contribute to the current window
      if (isValidNote(time, duration, cursor, wndLen)) {
        //Compute the contribution of the note to the current window
        let noteAndDuration = { pitch: note.pitch };

        //If note starts before the current window
        if (time < cursor) {
          //If note finishes before the end of the window
          if (time + duration < cursor + wndLen)
            //Add only the duration that overlap with the current window
            noteAndDuration.duration = time + duration - cursor;
          //Else, the note continues for the whole duration of the window
          //Add the window length as duration, since note duration overlap the whole window
          else noteAndDuration.duration = wndLen;
        }

        //If note start in the current window
        else {
          //If note finishes before the end of the window
          if (time + duration <= cursor + wndLen)
            //Add only the note duration
            noteAndDuration.duration = duration;
          //Else, the note continues to the next window
          //Add only the part that overlap with the  current window
          else noteAndDuration.duration = cursor + wndLen - time;
        }

        temp.push(noteAndDuration);
      }
    });

    subdivision.push(temp);
  }

  return subdivision;
}

/**
 * True if a note contribute to the PCV of the current window
 * @param {number} time starting time of a note
 * @param {number} duration duration of a note
 * @param {number} cursor starting time of the current window
 * @param {number} wndLen size of the current window
 * @returns boolean
 */
function isValidNote(time, duration, cursor, wndLen) {
  //A note contribute to the current window if:
  //1. starting time is in the current window
  //2. starts before the beginning of the window but
  //   finishes before the end of the window
  //3. starts before the beginning of the window
  //   and continues for the whole duration of the window
  if (
    (time > cursor && time < cursor + wndLen) ||
    (time + duration > cursor && time + duration < cursor + wndLen) ||
    (time <= cursor && time + duration >= cursor + wndLen)
  ) {
    return true;
  }
  return false;
}

export function sumCentered(pcDistributions, windowLen) {
  let windowedPcvs = [];

  windowedPcvs = winCentered(pcDistributions, windowLen);

  //Normalization
  windowedPcvs = sumNorm(windowedPcvs);

  //Computing the DFT coefficients for of each subdivision
  let dftCoeffsSubdivision = windowedPcvs.map((pcv) =>
    dft(pcv.getPcvAsArray(), false)
  );

  let traces = generateTraces(dftCoeffsSubdivision);

  return traces;
}

export function sumIncremental(pcDistributions, windowLen) {
  let windowedPcvs = [];

  windowedPcvs = winIncremental(pcDistributions, windowLen);

  //Normalization
  windowedPcvs = sumNorm(windowedPcvs);

  //Computing the DFT coefficients for of each subdivision
  let dftCoeffsSubdivision = windowedPcvs.map((pcv) =>
    dft(pcv.getPcvAsArray(), false)
  );

  let traces = generateTraces(dftCoeffsSubdivision);

  return traces;
}

export function powerCentered(pcDistributions, windowLen) {
  let windowedPcvs = [];

  windowedPcvs = winCentered(pcDistributions, windowLen);

  //Normalization
  windowedPcvs = powerNorm(windowedPcvs);

  //Computing the DFT coefficients for of each subdivision
  let dftCoeffsSubdivision = windowedPcvs.map((pcv) =>
    dft(pcv.getPcvAsArray(), false)
  );

  let traces = generateTraces(dftCoeffsSubdivision);

  return traces;
}

/**
 * Normalize pc distributions with sum
 * @param {array} pcDistributions
 */
function sumNorm(pcDistributions) {
  //Cloning unnormalized pcvs distribution for normalization with different window lengths
  let clonePcDistributions = [...pcDistributions].map((pcv) => {
    let newPcv = new Pcv();
    newPcv.add(pcv);
    return newPcv;
  });

  clonePcDistributions.forEach((pcv) => {
    let sum = 0;
    for (let note in pcv) sum += pcv[note];

    if (sum !== 0) {
      for (let note in pcv) pcv[note] = pcv[note] / sum;
    }
  });

  return clonePcDistributions;
}

/**
 * Normalize pc distributions with power
 * @param {array} pcDistributions
 */
function powerNorm(pcDistributions) {
  //Cloning unnormalized pcvs distribution for normalization with different window lengths
  let clonePcDistributions = [...pcDistributions].map((pcv) => {
    let newPcv = new Pcv();
    newPcv.add(pcv);
    return newPcv;
  });

  clonePcDistributions.forEach((pcv) => {
    let power = 0;
    for (let note in pcv) power += Math.pow(pcv[note], 2);
    power = power / 12;

    if (power != 0) {
      for (let note in pcv) pcv[note] = Math.sqrt(pcv[note] / power);
    }
  });

  return clonePcDistributions;
}

function winCentered(pcDistributions, windowLen) {
  let windowedPcvs = [];
  for (let i = 0; i <= pcDistributions.length - windowLen; i++) {
    let windowedPcv = new Pcv();
    for (let j = 0; j < windowLen; j++) {
      windowedPcv.add(pcDistributions[i + j]);
    }
    windowedPcvs.push(windowedPcv);
  }

  return windowedPcvs;
}

function winIncremental(pcDistributions, windowLen) {
  let windowedPcvs = [];
  let halfWndLen = Math.ceil(windowLen / 2);
  let incrementalWndLen = halfWndLen;

  //First windowLen/2 samples
  for (let i = 0; i < halfWndLen; i++) {
    let windowedPcv = new Pcv();
    for (let j = 0; j < incrementalWndLen; j++) {
      windowedPcv.add(pcDistributions[j]);
    }
    windowedPcvs.push(windowedPcv);

    incrementalWndLen++;
  }

  //Moving window
  for (let i = 0; i <= pcDistributions.length - windowLen; i++) {
    let windowedPcv = new Pcv();
    for (let j = 0; j < windowLen; j++) {
      windowedPcv.add(pcDistributions[i + j]);
    }
    windowedPcvs.push(windowedPcv);
  }

  //Last windowLen samples
  incrementalWndLen = halfWndLen;
  for (let i = 0; i < halfWndLen; i++) {
    let windowedPcv = new Pcv();
    for (let j = 0; j < incrementalWndLen; j++) {
      windowedPcv.add(pcDistributions[pcDistributions.length - j - 1]);
    }
    windowedPcvs.push(windowedPcv);

    incrementalWndLen++;
  }

  return windowedPcvs;
}

function generateTraces(dftCoeffsSubdivision) {
  //Generating the traces by subdividing for the coefficient number
  let traces = [];
  //Skipping coefficient zero since it will not be plotted
  for (let i = 1; i < 7; i++) {
    let temp = [];
    for (let j = 0; j < dftCoeffsSubdivision.length; j++) {
      temp.push({
        x: dftCoeffsSubdivision[j][i].re,
        y: dftCoeffsSubdivision[j][i].im,
      });
    }
    traces.push(temp);
  }

  return traces;
}
