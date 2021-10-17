import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import CircleIcon from '@mui/icons-material/Circle';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function PcvChipsBox({ userPcvs, setUserPcvs }) {
  const [chipData, setChipData] = useState([
    { key: 0, label: 'Angular', isDisabled: false },
    { key: 1, label: 'jQuery', isDisabled: true },
    { key: 2, label: 'Polymer', isDisabled: true },
    { key: 3, label: 'React', isDisabled: true },
    { key: 4, label: 'Vue.js', isDisabled: true },
  ]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.label !== chipToDelete.label)
    );
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
        width: 0.5,
      }}
      component='ul'
    >
      {userPcvs.map((data, i) => {
        return (
          <ListItem key={`${i}`}>
            <Chip
              variant={data.isDisabled ? 'outlined' : 'filled'}
              icon={<CircleIcon style={{ color: data.colours[1] }} />}
              label={data.label}
              onDelete={data.label === 'React' ? undefined : handleDelete(data)}
              onClick={() => {
                console.log('disabled');
              }}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}
