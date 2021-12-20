//React
import { useEffect, useState } from 'react';

//Import components
import Circle from './Circle';
import { prototypesData } from './prototypesData';

//Import material UI components
import Box from '@mui/material/Box';

//Fourier spaces module component
function CoefficientsModule({
  fullTraces,
  coeffTracesData,
  showPrototypes,
  showMagAndPhase,
  userPcvs,
  currentSubdiv,
  midiDevNotesDftCoeffs,
  elemsWidth,
  showFullTrace,
}) {
  //State: array
  //Array that contains all the prototypes if showPrototypes is true,
  //empty array if false.
  const [selectedProtoPitchClasses, setSelectedProtoPitchClasses] =
    useState(prototypesData);

  //State: array
  //Array that contains points of the PCVs inserted by the user
  //divided for each Fourier space (from 1st to 6th).
  const [subdivUserPcvs, setSubdivUserPcvs] = useState([]);

  useEffect(() => {
    console.log(subdivUserPcvs);
  }, [subdivUserPcvs]);

  //Effect: show/unshow prototypes when showPrototypes is toggled.
  useEffect(() => {
    if (showPrototypes) {
      setSelectedProtoPitchClasses(prototypesData);
    } else setSelectedProtoPitchClasses([]);
  }, [showPrototypes]);

  //Effect: when user add or remove PCVs, update subdivUserPcvs
  //by subdividing for the coefficient number
  useEffect(() => {
    //Subdividing the coeffs for each Fourier space
    let tempSubdivUserPcvs = [];
    for (let i = 1; i < 7; i++) {
      let temp = [];
      for (let j = 0; j < userPcvs.length; j++) {
        temp.push({
          x: userPcvs[j].coeffs[i].re,
          y: userPcvs[j].coeffs[i].im,
          rosePoints: userPcvs[j].rosePoints,
          isDisabled: userPcvs[j].isDisabled,
          label: userPcvs[j].label,
        });
      }
      tempSubdivUserPcvs.push(temp);
    }

    setSubdivUserPcvs(tempSubdivUserPcvs);
  }, [userPcvs]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}
    >
      {/* PLOT THE SPACES FROM 1st TO 6th */}
      {[1, 2, 3, 4, 5, 6].map((coeffNum) => (
        <Circle
          coeffNumber={coeffNum}
          key={`w.${coeffNum}`}
          protoDataCoeff={selectedProtoPitchClasses[coeffNum - 1]}
          fullTrace={fullTraces[coeffNum - 1]}
          traceDataCoeff={coeffTracesData[coeffNum - 1]}
          userPcvsCoeff={subdivUserPcvs[coeffNum - 1]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={midiDevNotesDftCoeffs[coeffNum]}
          targetCircleWidth={elemsWidth}
          showMagAndPhase={showMagAndPhase}
          showFullTrace={showFullTrace}
        />
      ))}
    </Box>
  );
}

export default CoefficientsModule;
