import { useRef, useState } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import wholeSvg from './svgNotation/whole.svg';
import halfSvg from './svgNotation/half.svg';
import quarterSvg from './svgNotation/quarter.svg';
import eighthSvg from './svgNotation/eighth.svg';
import sixteenthSvg from './svgNotation/sixteenth.svg';

function ResolutionSelector({
  resolutionMode,
  setResolutionMode,
  retriggerAnalysis,
}) {
  //State: input error
  const [isInputSecondsInvalid, setIsInputSecondsInvalid] = useState(false);
  const resolutionTextRef = useRef(null);

  function onChangeResolutionSelection(event) {
    let newResolutionMode = { ...resolutionMode };
    newResolutionMode.seconds = parseFloat(resolutionTextRef.current.value);

    switch (event.target.value) {
      case 'sixteenth':
        newResolutionMode.noteResolutionValue = 0.25;
        newResolutionMode.useSeconds = false;
        break;
      case 'eighth':
        newResolutionMode.noteResolutionValue = 0.5;
        newResolutionMode.useSeconds = false;
        break;
      case 'quarter':
        newResolutionMode.noteResolutionValue = 1;
        newResolutionMode.useSeconds = false;
        break;
      case 'half':
        newResolutionMode.noteResolutionValue = 2;
        newResolutionMode.useSeconds = false;
        break;
      case 'whole':
        newResolutionMode.noteResolutionValue = 4;
        newResolutionMode.useSeconds = false;
        break;
      case 'seconds':
        newResolutionMode.useSeconds = true;
        break;
      default:
        break;
    }

    setResolutionMode(newResolutionMode);
  }

  return (
    <Box>
      <FormControl component='fieldset'>
        <RadioGroup
          row
          defaultValue='quarter'
          onChange={onChangeResolutionSelection}
          aria-label='resolution'
          name='row-radio-buttons-group'
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <FormControlLabel
            value='sixteenth'
            control={<Radio size='small' />}
            label={
              <img
                style={{
                  width: 10,
                  height: 10,
                  transform: 'scale(3, 3)',
                }}
                src={sixteenthSvg}
              />
            }
          />
          <FormControlLabel
            value='eighth'
            control={<Radio size='small' />}
            label={
              <img
                style={{
                  width: 10,
                  height: 10,
                  transform: 'scale(3, 3) translate(0, 0)',
                }}
                src={eighthSvg}
              />
            }
          />
          <FormControlLabel
            value='quarter'
            control={<Radio size='small' />}
            label={
              <img
                style={{
                  width: 10,
                  height: 10,
                  marginTop: 8,
                  transform: 'scale(1, 3)',
                }}
                src={quarterSvg}
              />
            }
          />
          <FormControlLabel
            value='half'
            control={<Radio size='small' />}
            label={
              <img
                style={{
                  width: 10,
                  height: 10,
                  marginTop: 8,
                  transform: 'scale(3.7, 3.2) ',
                }}
                src={halfSvg}
              />
            }
          />
          <FormControlLabel
            value='whole'
            control={<Radio size='small' />}
            label={
              <img
                style={{
                  width: 10,
                  height: 10,
                  marginTop: 0,
                  transform: 'scale(1.5, 1)',
                }}
                src={wholeSvg}
              />
            }
          />

          <FormControlLabel
            value='seconds'
            control={<Radio size='small' />}
            label={
              <TextField
                sx={{ minHeight: '4.4rem', maxWidth: '5rem' }}
                error={isInputSecondsInvalid}
                helperText={isInputSecondsInvalid && 'Invalid input'}
                label='in seconds'
                id='standard-size-small'
                defaultValue='1.5'
                size='small'
                variant='standard'
                onChange={() => {
                  let newResolutionMode = { ...resolutionMode };
                  newResolutionMode.seconds = parseFloat(
                    resolutionTextRef.current.value
                  );
                  if (isNaN(newResolutionMode.seconds))
                    setIsInputSecondsInvalid(true);
                  else {
                    setResolutionMode(newResolutionMode);
                    setIsInputSecondsInvalid(false);
                  }
                }}
                inputRef={resolutionTextRef}
              />
            }
          />
          <Button
            variant='contained'
            onClick={retriggerAnalysis}
            sx={{ width: '22%', height: '15%', marginTop: 2 }}
          >
            Change
          </Button>
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

export default ResolutionSelector;
