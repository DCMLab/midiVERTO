import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function onChangeResolution(event) {}

function ResolutionSelector({ setResolution }) {
  return (
    <>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>Resolution</FormLabel>
        <RadioGroup
          row
          defaultValue='quarter'
          onChange={onChangeResolution}
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
                defaultValue='1'
                size='small'
                variant='standard'
                onChange={(event) => console.log(typeof event.target.value)}
              />
            }
          />
        </RadioGroup>
        <Button variant='contained' color='primary'>
          Change resolution
        </Button>
      </FormControl>
    </>
  );
}

export default ResolutionSelector;
