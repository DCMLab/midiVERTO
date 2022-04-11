//Import components
import { Wavescape } from './Wavescape';

//Import material UI components
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

//Wavescape module component
function WavescapeModule({
  wavescapesData,
  currentWavescapeSubdiv,
  elemsWidth,
  wsPhantomCurveHeight,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}
    >
      {/* If wavescapes' data is present plot the wavescapes, else 
      notify the user to upload a MIDI file */}
      {wavescapesData.length > 0 ? (
        wavescapesData.map((data, i) => (
          <Wavescape
            wsNumber={i + 1}
            key={`w.${i}`}
            wavescapeMatrix={data}
            currentWavescapeSubdiv={currentWavescapeSubdiv}
            wavescapeWidth={elemsWidth}
            wsPhantomCurveHeight={wsPhantomCurveHeight}
          />
        ))
      ) : (
        <Typography color='error'>No midi file uploaded</Typography>
      )}
    </Box>
  );
}

export default WavescapeModule;
