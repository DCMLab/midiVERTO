import { useRef } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

function ResolutionSelector({ resolutionMode, setResolutionMode }) {
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
    <>
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
            value='sixteenth'
            control={<Radio />}
            label=' &#119137;'
          />
          <FormControlLabel
            value='eighth'
            control={<Radio />}
            label=' &#119136;'
          />
          <FormControlLabel
            value='quarter'
            control={<Radio />}
            label='&#9833;'
          />
          <FormControlLabel
            value='half'
            control={<Radio />}
            label='&#119134;'
          />
          <FormControlLabel
            value='whole'
            control={<Radio />}
            label='&#119133;'
          />
          <FormControlLabel
            value='seconds'
            control={<Radio />}
            label={
              <TextField
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
                  setResolutionMode(newResolutionMode);
                }}
                inputRef={resolutionTextRef}
              />
            }
          />
        </RadioGroup>
      </FormControl>
    </>
  );
}

export default ResolutionSelector;
