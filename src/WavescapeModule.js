import { useState, useEffect } from 'react';

import { Wavescape } from './Wavescape';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';

function WavescapeModule({ wavescapesData }) {
  const [showModule, setShowModule] = useState(false);

  useEffect(() => {
    if (wavescapesData.length > 0) setShowModule(true);
  }, [wavescapesData]);

  return (
    <Box>
      <Switch
        onChange={() => setShowModule(!showModule)}
        checked={showModule}
      />

      <Typography variant='h6'>Static Analysis</Typography>
      <Collapse in={showModule}>
        {wavescapesData.map((data, i) => (
          <Wavescape key={`w.${i}`} wavescapeMatrix={data} />
        ))}
      </Collapse>
    </Box>
  );
}

export default WavescapeModule;
