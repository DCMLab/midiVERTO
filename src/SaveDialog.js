import { useEffect, useState } from 'react';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import CircleSVG from './CircleSVG';
import WavescapeSVG from './WavescapeSVG';
import ReactDOMServer from 'react-dom/server';

import { prototypesData } from './prototypesData';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';

function SaveDialog({ traces, userPcvs, wavescapesData }) {
  const [open, setOpen] = useState(false);
  const [subdivUserPcvs, setSubdivUserPcvs] = useState([]);

  const [checkNumb, setCheckNumb] = useState(true);
  const [checkTrace, setCheckTrace] = useState(true);
  const [checkProto, setCheckProto] = useState(true);
  const [checkPcvs, setCheckPcvs] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    //Subdividing the coeffs for each circle
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

  function generateWavescapeSVG(k) {
    let data = (
      <WavescapeSVG
        wavescapeMatrix={wavescapesData.length > 0 ? wavescapesData[k - 1] : []}
        wsNumber={k}
        showNumber={checkNumb}
      />
    );

    return ReactDOMServer.renderToStaticMarkup(data);
  }

  function generateCircleSVG(k) {
    let data = (
      <CircleSVG
        traceData={traces.length > 0 && checkTrace ? traces[k - 1] : []}
        prototypesData={checkProto ? prototypesData[k - 1] : []}
        userPcv={checkPcvs ? subdivUserPcvs[k - 1] : []}
        coeffNumber={k}
        showNumber={checkNumb}
      />
    );

    return ReactDOMServer.renderToStaticMarkup(data);
  }

  const saveImages = () => {
    let zip = new JSZip();

    [1, 2, 3, 4, 5, 6].forEach((i) => {
      //Generate SVGs
      let circleSVG = generateCircleSVG(i);
      let wavescapeSVG = generateWavescapeSVG(i);

      //Adding files to zip
      zip.file(`wavescapes/wavescape${i}.svg`, wavescapeSVG);
      zip.file(`fourier/space${i}.svg`, circleSVG);
    });

    //Generate zip and save it
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'images.zip');
    });

    setOpen(false);
  };

  return (
    <>
      <Button
        variant='contained'
        size='small'
        color='primary'
        sx={{
          width: '35%',
          margin: 'auto',
          marginTop: 1,
          marginBottom: 1,
        }}
        onClick={handleClickOpen}
      >
        Export images
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Saving options'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography sx={{ color: 'black' }}>
              Check if you want to include the following elements in the
              exported images:
            </Typography>

            <Box sx={{ marginLeft: 2, marginTop: 1 }}>
              <FormGroup sx={{ color: 'black' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={checkNumb}
                      onChange={() => {
                        setCheckNumb(!checkNumb);
                      }}
                    />
                  }
                  label='Coefficients numbers'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={checkTrace}
                      onChange={() => {
                        setCheckTrace(!checkTrace);
                      }}
                    />
                  }
                  label='Full trace'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={checkProto}
                      onChange={() => {
                        setCheckProto(!checkProto);
                      }}
                    />
                  }
                  label='Prototypes'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={checkPcvs}
                      onChange={() => {
                        setCheckPcvs(!checkPcvs);
                      }}
                    />
                  }
                  label='Custom pitch-class vectors'
                />
              </FormGroup>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={saveImages} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SaveDialog;
