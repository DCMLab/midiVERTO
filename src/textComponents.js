import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export const Info = (props) => {
  return (
    <Box
      sx={{
        padding: 1,
        color: '#31708f',
        backgroundColor: '#d9edf7',
        borderRadius: '10px',
        width: '90%',
        margin: 'auto',
      }}
    >
      {props.children}
    </Box>
  );
};

export const Image = ({ scale, alt, src }) => {
  return (
    <Box sx={{ width: scale, margin: 'auto', marginBottom: 2 }}>
      <img
        alt={alt}
        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        src={src}
      ></img>
    </Box>
  );
};

export const Paragraph = ({ ...props }) => {
  return (
    <Typography
      variant={'body1'}
      sx={{ marginBottom: 3, fontSize: 20 }}
      {...props}
    ></Typography>
  );
};

export const BlueLink = ({ href, ...props }) => {
  return (
    <Link
      target='_blank'
      underline='hover'
      href={href}
      {...props}
      sx={{ color: '#1976d2', textDecorationColor: '#1976d266', ...props.sx }}
    >
      {props.children}
    </Link>
  );
};
