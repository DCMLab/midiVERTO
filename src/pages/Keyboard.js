import * as Tone from 'tone';
import { useEffect, useState, useRef } from 'react';
import dft from '../DFT';
import Circle from '../Circle';
import { prototypesData } from '../prototypesData';

function Keyboard() {
  const [currentNotesDftCoeffs, setCurrentNotesDftCoeffs] = useState(
    dft([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map((coeff) => {
      return { x: coeff.re, y: coeff.im };
    })
  );

  const [selectedProtoPitchClasses, setSelectedProtoPitchClasses] =
    useState(prototypesData);
  const [showPrototypes, setShowPrototypes] = useState(true);
  function handleShowPrototypes(showing) {
    let temp = selectedProtoPitchClasses.slice();

    if (showing) temp.push(...prototypesData);
    else temp = [];

    setSelectedProtoPitchClasses(temp);
    setShowPrototypes(showing);
  }

  useEffect(() => {
    //INIT
    let currentNotes = [];
    const sampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3',
        C1: 'C1.mp3',
        'D#1': 'Ds1.mp3',
        'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',
        C2: 'C2.mp3',
        'D#2': 'Ds2.mp3',
        'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',
        C3: 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
        C5: 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',
        C6: 'C6.mp3',
        'D#6': 'Ds6.mp3',
        'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',
        C7: 'C7.mp3',
        'D#7': 'Ds7.mp3',
        'F#7': 'Fs7.mp3',
        A7: 'A7.mp3',
        C8: 'C8.mp3',
      },
      release: 1,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
    }).toDestination();
    sampler.volume.value = -30;

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(success, failure);
    }

    function computeDftCoeffs(playedNotes) {
      let pcv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      playedNotes.forEach((note) => {
        let pitch;
        if (note.includes('#')) {
          pitch = note.slice(0, 2);
        } else pitch = pitch = note.slice(0, 1);

        switch (pitch) {
          case 'C':
            pcv[0] = 1;
            break;
          case 'C#':
            pcv[1] = 1;
            break;
          case 'D':
            pcv[2] = 1;
            break;
          case 'D#':
            pcv[3] = 1;
            break;
          case 'E':
            pcv[4] = 1;
            break;
          case 'F':
            pcv[5] = 1;
            break;
          case 'F#':
            pcv[6] = 1;
            break;
          case 'G':
            pcv[7] = 1;
            break;
          case 'G#':
            pcv[8] = 1;
            break;
          case 'A':
            pcv[9] = 1;
            break;
          case 'A#':
            pcv[10] = 1;
            break;
          case 'B':
            pcv[11] = 1;
            break;
          default:
            break;
        }
      });

      let dftCoeffs = dft(pcv);
      dftCoeffs = dftCoeffs.map((coeff) => {
        return { x: coeff.re, y: coeff.im };
      });
      //console.log(dftCoeffs);
      setCurrentNotesDftCoeffs(dftCoeffs);
    }

    function handleInput(input) {
      const command = input.data[0];
      const note = Tone.Frequency(input.data[1], 'midi').toNote();
      const velocity = Math.round(input.data[2] * 0.05);
      //const velocity = input.data[2];

      switch (command) {
        case 144: //noteOn
          if (velocity > 0) {
            //Note is on
            sampler.triggerAttack(note, Tone.immediate(), velocity);
            currentNotes.push(note);
          } else {
            //Note is off
            sampler.triggerRelease(note, Tone.immediate());
            currentNotes.filter((currentNote) => currentNote !== note);
          }
          break;
        case 128: //noteOff
          sampler.triggerRelease(note, Tone.immediate());
          currentNotes = currentNotes.filter(
            (currentNote) => currentNote !== note
          );
          break;
        default:
          break;
      }

      computeDftCoeffs(currentNotes);
    }

    function success(midiAccess) {
      midiAccess.onstatechange = updateDevices;

      const inputs = midiAccess.inputs;

      inputs.forEach((input) => {
        input.onmidimessage = handleInput;
      });
    }

    function failure() {
      console.log('Could not connect MIDI');
    }

    function updateDevices(event) {
      console.log(
        `Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`
      );
    }
  }, []);

  return (
    <div>
      <div>
        <label htmlFor='showPrototypes'>Show prototypes: </label>
        <input
          type='checkbox'
          id='showPrototypes'
          name='showPrototypes'
          onChange={() => handleShowPrototypes(!showPrototypes)}
          checked={showPrototypes}
        ></input>
      </div>
      {currentNotesDftCoeffs.map((coeff, i) => (
        <h4 key={i}>{`coeff${i}:{Re:${coeff.x}, Im:${coeff.x}}`}</h4>
      ))}
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[0]}
        performanceCoeff={currentNotesDftCoeffs[1]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[1]}
        performanceCoeff={currentNotesDftCoeffs[2]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[2]}
        performanceCoeff={currentNotesDftCoeffs[3]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[3]}
        performanceCoeff={currentNotesDftCoeffs[4]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[4]}
        performanceCoeff={currentNotesDftCoeffs[5]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[5]}
        performanceCoeff={currentNotesDftCoeffs[6]}
      />
    </div>
  );
}

export default Keyboard;
