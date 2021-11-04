import Circle from './Circle';
import { useEffect, useState } from 'react';
import { prototypesData } from './prototypesData';

import Box from '@mui/material/Box';

function CoefficientsModule({
  coeffTracesData,
  showPrototypes,
  userPcvs,
  currentSubdiv,
  midiDevNotesDftCoeffs,
  elemsWidth,
}) {
  const [selectedProtoPitchClasses, setSelectedProtoPitchClasses] =
    useState(prototypesData);

  const [subdivUserPcvs, setSubdivUserPcvs] = useState([]);

  useEffect(() => {
    if (showPrototypes) {
      setSelectedProtoPitchClasses(prototypesData);
    } else setSelectedProtoPitchClasses([]);
  }, [showPrototypes]);

  useEffect(() => {
    //Subdividing the coeffs for each circle
    let tempSubdivUserPcvs = [];
    for (let i = 1; i < 7; i++) {
      let temp = [];
      for (let j = 0; j < userPcvs.length; j++) {
        temp.push({
          x: userPcvs[j].coeffs[i].re,
          y: userPcvs[j].coeffs[i].im,
          color: userPcvs[j].colours[i],
          isDisabled: userPcvs[j].isDisabled,
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
      {[1, 2, 3, 4, 5, 6].map((coeffNum) => (
        <Circle
          coeffNumber={coeffNum}
          key={`w.${coeffNum}`}
          protoDataCoeff={selectedProtoPitchClasses[coeffNum - 1]}
          traceDataCoeff={coeffTracesData[coeffNum - 1]}
          userPcvsCoeff={subdivUserPcvs[coeffNum - 1]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={midiDevNotesDftCoeffs[coeffNum]}
          targetCircleWidth={elemsWidth}
        />
      ))}

      {/* <Circle
        protoDataCoeff={selectedProtoPitchClasses[0]}
        traceDataCoeff={coeffTracesData[0]}
        userPcvsCoeff={subdivUserPcvs[0]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[1]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[1]}
        traceDataCoeff={coeffTracesData[1]}
        userPcvsCoeff={subdivUserPcvs[1]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[2]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[2]}
        traceDataCoeff={coeffTracesData[2]}
        userPcvsCoeff={subdivUserPcvs[2]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[3]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[3]}
        traceDataCoeff={coeffTracesData[3]}
        userPcvsCoeff={subdivUserPcvs[3]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[4]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[4]}
        traceDataCoeff={coeffTracesData[4]}
        userPcvsCoeff={subdivUserPcvs[4]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[5]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[5]}
        traceDataCoeff={coeffTracesData[5]}
        userPcvsCoeff={subdivUserPcvs[5]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[6]}
      /> */}
    </Box>
  );
}

export default CoefficientsModule;
