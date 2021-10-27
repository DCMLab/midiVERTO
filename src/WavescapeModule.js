import { useState, useEffect } from 'react';

import { Wavescape } from './Wavescape';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function WavescapeModule({ wavescapesData }) {
  return (
    <Box>
      {wavescapesData.length > 0 ? (
        wavescapesData.map((data, i) => (
          <Wavescape key={`w.${i}`} wavescapeMatrix={data} />
        ))
      ) : (
        <Typography>Upload a midi file first</Typography>
      )}
    </Box>
  );
}

export default WavescapeModule;
