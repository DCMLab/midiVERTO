import { useRef, useState } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ResolutionSelector({ resolutionMode, setResolutionMode }) {
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
        <FormLabel component='legend'>Resolution</FormLabel>
        <RadioGroup
          row
          defaultValue='quarter'
          onChange={onChangeResolutionSelection}
          aria-label='resolution'
          name='row-radio-buttons-group'
        >
          <FormControlLabel
            sx={{ fontSize: '20px' }}
            value='sixteenth'
            control={<Radio size='small' />}
            label={<Typography sx={{ fontSize: '2rem' }}>&#119137;</Typography>}
          />
          <FormControlLabel
            value='eighth'
            control={<Radio size='small' />}
            label={<Typography sx={{ fontSize: '2rem' }}>&#119136;</Typography>}
          />
          <FormControlLabel
            value='quarter'
            control={<Radio size='small' />}
            label={<Typography sx={{ fontSize: '2rem' }}>&#9833;</Typography>}
          />
          <FormControlLabel
            value='half'
            control={<Radio size='small' />}
            label={<Typography sx={{ fontSize: '2rem' }}>&#119134;</Typography>}
          />
          <FormControlLabel
            value='whole'
            control={<Radio size='small' />}
            label={<Typography sx={{ fontSize: '2rem' }}>&#119133;</Typography>}
          />
          <FormControlLabel
            value='seconds'
            control={<Radio size='small' />}
            label={
              <TextField
                sx={{ minHeight: '5rem' }}
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
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

export default ResolutionSelector;
