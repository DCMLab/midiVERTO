import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function PcvChipsBox({ userPcvs, setUserPcvs, rosesMat }) {
  const handleDelete = (chipToDelete) => () => {
    //on detele, set the rose icon to unused
    //matrix coeffs are i = d-1, j=d-1
    rosesMat[chipToDelete.d - 1][chipToDelete.n - 1].used = false;

    setUserPcvs((chips) =>
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
        p: '5px',
        overflow: 'auto',
        minHeight: '50%',
        width: '100%',
      }}
      component='ul'
    >
      {userPcvs.map((data, i) => {
        return (
          <ListItem key={`${i}`}>
            <Chip
              variant={data.isDisabled ? 'outlined' : 'filled'}
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                >
                  <g /* fill='none' fill-rule='evenodd' */>
                    {/* <rect
                      width='20'
                      height='20'
                      x='2'
                      y='2'
                      fill='#FFF'
                      rx='10'
                    /> */}
                    <polyline
                      transform={`translate(${12},${12})`}
                      fill='none'
                      stroke='black'
                      strokeWidth='1px'
                      points={data.rosePoints}
                    />
                  </g>
                </svg>
              }
              label={data.label}
              onDelete={handleDelete(data)}
              onClick={() => {
                data.isDisabled = !data.isDisabled;
                setUserPcvs([...userPcvs]);
              }}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}
