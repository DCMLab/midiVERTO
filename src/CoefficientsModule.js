import Circle from './Circle';

function CoefficientsModule({
  selectedProtoPitchClasses,
  tracesData,
  userPcvs,
  currentSubdiv,
  performanceCoeff,
}) {
  if (selectedProtoPitchClasses !== undefined) {
    return (
      <div>
        <Circle
          protoDataCoeff={selectedProtoPitchClasses[0]}
          traceDataCoeff={tracesData[0]}
          userPcvsCoeff={userPcvs[0]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />

        <Circle
          protoDataCoeff={selectedProtoPitchClasses[1]}
          traceDataCoeff={tracesData[1]}
          userPcvsCoeff={userPcvs[1]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />

        <Circle
          protoDataCoeff={selectedProtoPitchClasses[2]}
          traceDataCoeff={tracesData[2]}
          userPcvsCoeff={userPcvs[2]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />

        <Circle
          protoDataCoeff={selectedProtoPitchClasses[3]}
          traceDataCoeff={tracesData[3]}
          userPcvsCoeff={userPcvs[3]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />

        <Circle
          protoDataCoeff={selectedProtoPitchClasses[4]}
          traceDataCoeff={tracesData[4]}
          userPcvsCoeff={userPcvs[4]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />

        <Circle
          protoDataCoeff={selectedProtoPitchClasses[5]}
          traceDataCoeff={tracesData[5]}
          userPcvsCoeff={userPcvs[5]}
          currentSubdiv={currentSubdiv}
          performanceCoeff={{ x: 0, y: 0 }}
        />
      </div>
    );
  } else return null;
}

export default CoefficientsModule;
