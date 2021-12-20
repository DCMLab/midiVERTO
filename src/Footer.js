//React
import React from 'react';

//Import images
import logo from './logos/placeholder.png';

//Import material UI components
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

//Footer component
function Footer() {
  let logoSize = 100;
  return (
    <Box sx={{ marginTop: 1, textAlign: 'center' }}>
      {/* LOGOS */}
      <Stack sx={{ justifyContent: 'center' }} direction='row'>
        <img width={logoSize} height={logoSize} src={logo} />
        <img width={logoSize} height={logoSize} src={logo} />
        <img width={logoSize} height={logoSize} src={logo} />
      </Stack>

      {/* TEXT */}
      <Typography>
        Project “Enabling interactive music visualization for a wider community”
      </Typography>

      {/* PEOPLE */}
      <Stack sx={{ justifyContent: 'center' }} direction='row'>
        <Typography sx={{ marginRight: 1 }}>
          Project lead: Fabian C. Moss; Daniel Harasim
        </Typography>
        <span>{`\u2013`}</span>
        <Typography sx={{ marginLeft: 1 }}>
          Developer: Giovanni Affatato
        </Typography>
      </Stack>

      {/* LINKS */}
      <Stack sx={{ justifyContent: 'center' }} direction='row'>
        <Link sx={{ marginRight: 1 }} href='https://github.com/DCMLab/MIDFT'>
          GitHub repo
        </Link>
        <span>{`\u2022`}</span>
        <Link
          sx={{ marginLeft: 1, marginRight: 1 }}
          href='https://www.epfl.ch/labs/dcml/'
        >
          DCML page
        </Link>
        <span>{`\u2022`}</span>
        <Typography sx={{ marginLeft: 1 }} href=''>
          Copyright
        </Typography>
      </Stack>
    </Box>
  );
}

export default Footer;
