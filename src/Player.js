import * as Tone from 'tone';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

let part;
let currentSongDuration = 0; // seconds
let intervalID;

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

function formatDuration(value) {
  const minute = Math.floor(value / 60);
  const secondLeft = Math.floor(value - minute * 60);
  return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
}

export function setPlayerMidiData(midiData, resolution, setCurrentSubdiv) {
  //Remove the scheduled previous song
  Tone.Transport.cancel(0);
  setCurrentSubdiv(0);
  Tone.Transport.stop();

  currentSongDuration = midiData.duration;

  let partNotes = [];
  midiData.tracks.forEach((track) =>
    track.notes.forEach((note) => {
      partNotes.push(note);
    })
  );

  partNotes.forEach((note) => {
    note.subdiv = Math.floor(note.time / resolution);
  });

  part = new Tone.Part(
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

  part.loop = true;
  part.loopEnd = currentSongDuration;
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
sampler.volume.value = -20;

export default function Player({ fileName, currentWavescapeSubdiv }) {
  const [playbackSliderProgress, setPlaybackSliderProgress] = useState(0);

  function play() {
    console.log('play');
    if (Tone.context.state !== 'running') {
      console.log('state running');
      Tone.context.resume();
    }
    Tone.Transport.start();
    if (!intervalID && part)
      intervalID = setInterval(
        () => setPlaybackSliderProgress(part.progress),
        1000
      );
  }

  useEffect(() => {
    function handleKeyDown(e) {
      e.preventDefault();
      if (e.which === 32) {
        if (
          Tone.Transport.state === 'paused' ||
          Tone.Transport.state === 'stopped'
        )
          play();
        else if (Tone.Transport.state === 'started') {
          Tone.Transport.pause();
          stopInterval();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown.bind(this));
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '60%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Stack direction='row' sx={{ flexGrow: 1, paddingLeft: '10%' }}>
          <IconButton
            disableFocusRipple
            sx={{ padding: '0' }}
            onClick={() => {
              console.log('stop');
              Tone.Transport.stop();
              stopInterval();
            }}
            size='large'
            children={<StopRoundedIcon fontSize='large' />}
          />
          <IconButton
            disableFocusRipple
            sx={{ padding: '0' }}
            onClick={() => {
              console.log('pause');
              Tone.Transport.pause();
              stopInterval();
            }}
            size='large'
            children={<PauseRoundedIcon fontSize='large' />}
          />
          <IconButton
            disableFocusRipple
            sx={{ padding: '0' }}
            onClick={() => play()}
            size='large'
            children={<PlayArrowRoundedIcon fontSize='large' />}
          />
        </Stack>
        <Typography
          color={fileName ? 'primary' : 'error'}
          noWrap={true}
          sx={{ flexGrow: '2', paddingRight: '10%' }}
        >
          {fileName ? fileName : 'No midi file uploaded'}
        </Typography>
      </Box>
      <Slider
        aria-label='Playback'
        size='small'
        value={playbackSliderProgress ? playbackSliderProgress * 100 : 0}
        onChange={(event, newValue) => {
          setPlaybackSliderProgress(newValue / 100);
          Tone.Transport.seconds = (newValue / 100) * currentSongDuration;
        }}
        sx={{ width: '90%' }}
      />
      <Box
        sx={{
          display: 'flex',
          width: '90%',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: -1,
        }}
      >
        <TinyText>
          -
          {formatDuration(
            currentSongDuration - playbackSliderProgress * currentSongDuration
          )}
        </TinyText>
        <TinyText>{formatDuration(currentSongDuration)}</TinyText>
      </Box>
    </Box>
  );
}

function stopInterval() {
  clearInterval(intervalID);
  // release our intervalID from the variable
  intervalID = null;
}
