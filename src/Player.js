import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';

import Box from '@mui/material/Box';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import IconButton from '@mui/material/IconButton';

export function setPlayerMidiData(midiData, resolution, setCurrentSubdiv) {
  //Remove the scheduled previous song
  Tone.Transport.cancel(0);
  setCurrentSubdiv(0);
  Tone.Transport.stop();

  let partNotes = [];
  midiData.tracks.forEach((track) =>
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
      //console.log(note.subdiv);
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

export default function Player() {
  return (
    <Box>
      <IconButton
        onClick={() => {
          console.log('stop');
          Tone.Transport.stop();
        }}
        size='large'
        children={<StopRoundedIcon fontSize='large' />}
      />
      <IconButton
        onClick={() => {
          console.log('pause');
          Tone.Transport.pause();
        }}
        size='large'
        children={<PauseRoundedIcon fontSize='large' />}
      />
      <IconButton
        onClick={() => {
          console.log('play');
          if (Tone.context.state !== 'running') {
            console.log('state running');
            Tone.context.resume();
          }
          Tone.Transport.start();
        }}
        size='large'
        children={<PlayArrowRoundedIcon fontSize='large' />}
      />
    </Box>
  );
}
