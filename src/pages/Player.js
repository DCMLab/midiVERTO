import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';

let currentSubdiv = 0;
let intervalId;

export function setPlayerMidiData(toneMidi, resolution, setCurrentSubdiv) {
  let midiData = new Midi(toneMidi);

  let nonPercussiveTracks = midiData.tracks.filter(
    (track) => track.instrument.percussion === false
  );

  let partNotes = [];
  nonPercussiveTracks.forEach((track) =>
    track.notes.forEach((note) => {
      partNotes.push(note);
    })
  );

  partNotes.forEach(
    (note) => (note.subdiv = Math.floor(note.time / resolution))
  );

  const part = new Tone.Part(
    (time, note) => {
      sampler.triggerAttackRelease(
        note.name,
        note.duration,
        time,
        note.velocity
      );
      setCurrentSubdiv(note.subdiv);
    },
    [...partNotes]
  ).start(0);
}

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

export default function Player({ resolution }) {
  return (
    <div id='playStopButtons'>
      <div
        id='stop'
        className='btn fas fa-stop fa-4x'
        onClick={() => {
          console.log('stop');
          Tone.Transport.stop();
          //clearInterval(intervalId);
        }}
      ></div>
      <div
        id='play'
        className='btn fas fa-play fa-4x'
        onClick={() => {
          console.log('click');
          if (Tone.context.state !== 'running') {
            console.log('state running');
            Tone.context.resume();
          }
          Tone.Transport.start();
          /* intervalId = setInterval(() => {
            currentSubdivStateHandler(currentSubdiv);
            currentSubdiv++;
          }, resolution); */
        }}
      ></div>
      <div
        id='pause'
        className='btn fas fa-pause fa-4x'
        onClick={() => {
          console.log('tone ok');
          Tone.start();
        }}
      ></div>
    </div>
  );
}
