import { Wavescape } from './Wavescape';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function WavescapeModule({
  wavescapesData,
  currentWavescapeSubdiv,
  elemsWidth,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}
    >
      {wavescapesData.length > 0 ? (
        wavescapesData.map((data, i) => (
          <Wavescape
            key={`w.${i}`}
            wavescapeMatrix={data}
            currentWavescapeSubdiv={currentWavescapeSubdiv}
            wavescapeWidth={elemsWidth}
          />
        ))
      ) : (
        <Typography>Upload a midi file first</Typography>
      )}
    </Box>
  );
}

export default WavescapeModule;
