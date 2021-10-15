import Circle from './Circle';
import { useEffect, useState } from 'react';
import { prototypesData } from './prototypesData';

function CoefficientsModule({
  coeffTracesData,
  showPrototypes,
  userPcvs,
  currentSubdiv,
  midiDevNotesDftCoeffs,
}) {
  const [selectedProtoPitchClasses, setSelectedProtoPitchClasses] =
    useState(prototypesData);

  useEffect(() => {
    if (showPrototypes) {
      setSelectedProtoPitchClasses(prototypesData);
    } else setSelectedProtoPitchClasses([]);
  }, [showPrototypes]);

  useEffect(() => {
    console.log(selectedProtoPitchClasses);
  }, [selectedProtoPitchClasses]);

  return (
    <>
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[0]}
        traceDataCoeff={coeffTracesData[0]}
        userPcvsCoeff={userPcvs[0]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[1]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[1]}
        traceDataCoeff={coeffTracesData[1]}
        userPcvsCoeff={userPcvs[1]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[2]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[2]}
        traceDataCoeff={coeffTracesData[2]}
        userPcvsCoeff={userPcvs[2]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[3]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[3]}
        traceDataCoeff={coeffTracesData[3]}
        userPcvsCoeff={userPcvs[3]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[4]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[4]}
        traceDataCoeff={coeffTracesData[4]}
        userPcvsCoeff={userPcvs[4]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[5]}
      />
      <Circle
        protoDataCoeff={selectedProtoPitchClasses[5]}
        traceDataCoeff={coeffTracesData[5]}
        userPcvsCoeff={userPcvs[5]}
        currentSubdiv={currentSubdiv}
        performanceCoeff={midiDevNotesDftCoeffs[6]}
      />
    </>
  );
}

export default CoefficientsModule;
