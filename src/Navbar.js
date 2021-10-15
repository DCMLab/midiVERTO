import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h3' component='div' sx={{ flexGrow: 1 }}>
            Mi_DFT
          </Typography>
          <ButtonGroup variant='outlined' aria-label='outlined button group'>
            <Button component={Link} to='/' variant='contained' color='primary'>
              Home
            </Button>
            <Button
              component={Link}
              to='/visualization'
              variant='contained'
              color='primary'
            >
              Wavescape
            </Button>
            <Button
              component={Link}
              to='/live'
              variant='contained'
              color='primary'
            >
              Live
            </Button>
            <Button
              component={Link}
              to='/keyboard'
              variant='contained'
              color='primary'
            >
              Keyboard
            </Button>
            <Button
              component={Link}
              to='/analysis'
              variant='contained'
              color='primary'
            >
              Analysis
            </Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
