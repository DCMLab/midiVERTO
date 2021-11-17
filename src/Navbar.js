import React from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';

const drawerWidth = 400;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Navbar({ open, setOpen, inAnalysisPage }) {
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' open={open}>
        <Toolbar>
          <IconButton
            disabled={!inAnalysisPage}
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <ChevronRightIcon />
          </IconButton>
          <Typography variant='h3' component='div' sx={{ flexGrow: 1 }}>
            Mi_DFT
          </Typography>
          <ButtonGroup aria-label='outlined button group'>
            <Button
              component={Link}
              to='/'
              variant='contained'
              disableElevation={true}
            >
              Home
            </Button>
            <Button
              component={Link}
              to='/theory'
              variant='contained'
              disableElevation={true}
            >
              Theory
            </Button>
            <Button
              component={Link}
              to='/analysis'
              variant='contained'
              disableElevation={true}
            >
              Analysis
            </Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
