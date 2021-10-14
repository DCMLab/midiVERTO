import React from 'react';

import { Wavescape } from './Wavescape';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Typography } from '@mui/material';

function WavescapeModule({ wavescapesData }) {
  return (
    <Box>
      <Switch onChange={() => console.log('changed')} checked={true} />
      <Typography variant='h6'>Static Analysis</Typography>
      {wavescapesData.map((data, i) => (
        <Wavescape key={`w.${i}`} wavescapeMatrix={data} />
      ))}
    </Box>
  );
}

export default WavescapeModule;
