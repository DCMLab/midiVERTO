//React
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

//Import libraries
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

//Import components
import CircleSVG from './CircleSVG';
import WavescapeSVG from './WavescapeSVG';
import { prototypesData } from './prototypesData';

//Import material UI components
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
import Popover from '@mui/material/Popover';

//Save dialog component
function SaveDialog({ traces, userPcvs, wavescapesData }) {
  // ----- DIALOG WINDOW ----- //
  //State: boolean
  //True if the dialog window is opened
  const [open, setOpen] = useState(false);

  //States: boolean
  //True to include the correspondent elements in the exported images
  const [checkNumb, setCheckNumb] = useState(true);
  const [checkTrace, setCheckTrace] = useState(true);
  const [checkProto, setCheckProto] = useState(true);
  const [checkPcvs, setCheckPcvs] = useState(true);

  //State: array
  //PCVs to be include in the exported images
  const [subdivUserPcvs, setSubdivUserPcvs] = useState([]);

  //HOTFIX RGBA POWERPOINT
  const [wavescapesRGBA, setWavescapesRGBA] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ----- POPOVER ----- //
  //State: boolean
  //If true images can be exported, else there is no MIDI data
  const [canSave, setCanSave] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickPopover = (event) => {
    if (canSave) saveImages();
    else setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  //Effect: update canSave if there is data in wavescapes
  useEffect(() => {
    wavescapesData.length > 0 ? setCanSave(true) : setCanSave(false);
    //HOT FIX FOR BLACK TRANSPARENCY IN POWER POINT, INKSCAPE
    let newWavescapes = [];
    for (let i = 0; i < wavescapesData.length; i++) {
      let wavescape = [];
      for (let j = 0; j < wavescapesData[i].length; j++) {
        let row = [];
        for (let k = 0; k < wavescapesData[i][j].length; k++) {
          let newElem = {};
          let rgb = wavescapesData[i][j][k].replace(/[^\d,]/g, '').split(',');
          newElem.rgb = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          newElem.alpha = `0.${rgb[3].substring(1, rgb[3].length)}`;
          row.push(newElem);
        }
        wavescape.push(row);
      }
      newWavescapes.push(wavescape);
    }
    setWavescapesRGBA(newWavescapes);
  }, [wavescapesData]);

  //Effect: on user PCVs update, subdivide by coefficient number
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

  /**
   * Generate the static markup for the exported wavescapes
   * @param {number} k coefficient number
   * @returns string
   */
  function generateWavescapeSVG(k) {
    let data = (
      <WavescapeSVG
        wavescapeMatrix={wavescapesData.length > 0 ? wavescapesRGBA[k - 1] : []}
        wsNumber={k}
        showNumber={checkNumb}
      />
    );

    return ReactDOMServer.renderToStaticMarkup(data);
  }

  /**
   * Generate the static markup for the exported Fourier spaces
   * @param {number} k coefficient number
   * @returns string
   */
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

  /**
   * Export the generated images
   */
  const saveImages = () => {
    let zip = new JSZip();

    //For each coefficient number
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

    //Close the dialog window
    setOpen(false);
  };

  return (
    <>
      {/* EXPORT BUTTON */}
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

      {/* DIALOG WINDOW */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Saving options'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography sx={{ color: 'black' }}>
              Check the box in order to include the correspondent element in the
              exported images:
            </Typography>

            {/* CHECKS */}
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
          <Button onClick={handleClickPopover} autoFocus>
            Save
          </Button>

          {/* POPOVER */}
          <Popover
            id={id}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
          >
            <Typography color='error' sx={{ p: 2 }}>
              Upload a MIDI file
            </Typography>
          </Popover>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SaveDialog;
