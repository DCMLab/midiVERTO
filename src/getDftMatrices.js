import { Midi } from '@tonejs/midi';
import dft from './DFT';

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
      case 'Gs':
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
}

//Resolution is in seconds
export function getDftMatricesFromMidi(midiFile, resolution) {
  //For now, we don't take into account tempo changes
  let midiData = new Midi(midiFile);
  //const bpm = midiData.header.tempos[0].bpm; //For quarter-note conversion
  let duration = midiData.duration;
  let trackMatrices = [];

  //TODO: check and delete percussive tracks!

  midiData.tracks.forEach((track) => {
    let tempMat = [];

    for (let wndLen = resolution; wndLen < duration; wndLen += resolution) {
      tempMat.push(getRow(track.notes, wndLen, resolution, duration));
    }
    //Since wndLen < duration, the for cycle do not include the top vertex of the triangle
    tempMat.push(getRow(track.notes, duration, duration, duration)); //manually added

    trackMatrices.push(tempMat);
  });

  //Computing the pcvs for each subdivision
  let pcvMatrix = [];

  for (let i = 0; i < trackMatrices[0].length; i++) {
    let temp = [];
    for (let k = 0; k < trackMatrices[0][i].length; k++) {
      temp.push(new Pcv());
    }
    pcvMatrix.push(temp);
  }

  trackMatrices.forEach((track) => {
    for (let i = 0; i < track.length; i++) {
      for (let j = 0; j < track[i].length; j++) {
        for (let k = 0; k < track[i][j].length; k++) {
          let { pitch, duration } = track[i][j][k];
          pcvMatrix[i][j].addNoteDuration(pitch, duration);
        }
      }
    }
  });

  //Computing the dft coeff matrix
  let dftCoeffMatrix = [];

  for (let i = 0; i < pcvMatrix.length; i++) {
    let temp = [];
    for (let j = 0; j < pcvMatrix[i].length; j++) {
      temp.push(dft(pcvMatrix[i][j].getPcvAsArray()));
    }
    dftCoeffMatrix.push(temp);
  }

  return dftCoeffMatrix;
}

function getRow(notes, wndLen, resolution, duration) {
  let row = [];
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

    row.push(temp);
  }

  return row;
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
