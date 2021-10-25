import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link } from 'react-router-dom';

export default function Navbar({ open }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed' open={open}>
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
              to='/theory'
              variant='contained'
              color='primary'
            >
              Theory
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
