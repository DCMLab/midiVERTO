//React
import { useEffect, useRef } from 'react';

//Images
import ws1 from '../images/wavescapes/wavescape1.svg';
import ws2 from '../images/wavescapes/wavescape2.svg';
import ws3 from '../images/wavescapes/wavescape3.svg';
import ws4 from '../images/wavescapes/wavescape4.svg';
import ws5 from '../images/wavescapes/wavescape5.svg';
import ws6 from '../images/wavescapes/wavescape6.svg';
import fs1 from '../images/fourier/space1.svg';
import fs2 from '../images/fourier/space2.svg';
import fs3 from '../images/fourier/space3.svg';
import fs4 from '../images/fourier/space4.svg';
import fs5 from '../images/fourier/space5.svg';
import fs6 from '../images/fourier/space6.svg';

//Import material UI components
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Footer from '../Footer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { BlueLink, Paragraph } from '../textComponents';

//Home component
export default function Home({ setOpen, setInAnalysisPage }) {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const imgSize = 170;

  useEffect(() => {
    setInAnalysisPage(false);
    setOpen(false);
  }, []);

  return (
    <>
      <Paper sx={{ margin: 'auto', maxWidth: '1200px' }}>
        <Box
          sx={{ padding: 2, width: '1060px', margin: 'auto', paddingBottom: 5 }}
        >
          <Typography
            variant='h2'
            style={{ fontWeight: 'bold', marginLeft: 20, textAlign: 'center' }}
          >
            Welcome!
          </Typography>
          <Divider sx={{ marginBottom: 5 }} />

          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            direction='row'
          >
            <img alt='' width={imgSize} height={imgSize} src={ws1} />
            <img alt='' width={imgSize} height={imgSize} src={ws2} />
            <img alt='' width={imgSize} height={imgSize} src={ws3} />
            <img alt='' width={imgSize} height={imgSize} src={ws4} />
            <img alt='' width={imgSize} height={imgSize} src={ws5} />
            <img alt='' width={imgSize} height={imgSize} src={ws6} />
          </Stack>

          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
            direction='row'
          >
            <img alt='' width={imgSize} height={imgSize} src={fs1} />
            <img alt='' width={imgSize} height={imgSize} src={fs2} />
            <img alt='' width={imgSize} height={imgSize} src={fs3} />
            <img alt='' width={imgSize} height={imgSize} src={fs4} />
            <img alt='' width={imgSize} height={imgSize} src={fs5} />
            <img alt='' width={imgSize} height={imgSize} src={fs6} />
          </Stack>

          <Paragraph>
            This web application is an open-source online tool for interactive
            music visualization. It aims at bridging the gap between
            mathematical music theory and music enthusiasts. In recent years,
            music theorists have discovered that the{' '}
            <BlueLink
              href={'https://en.wikipedia.org/wiki/Discrete_Fourier_transform'}
            >
              Discrete Fourier Transform (DFT)
            </BlueLink>{' '}
            can be used to analyze the pitch-class content of pieces of music,
            for instance to compare the tonal organization of different pieces.
            It may also reveal interesting sections in a piece that eluded a
            theorist’s inspection. This technique has consequently opened up new
            avenues for both theoretical and historical music research{' '}
            <Link
              underline='hover'
              onClick={(event) => {
                event.preventDefault();
                ref1.current.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              href={'#Manual entry of chords'}
              sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
            >
              <sup>[1]</sup>
            </Link>
            ,{' '}
            <Link
              underline='hover'
              onClick={(event) => {
                event.preventDefault();
                ref2.current.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              href={'#Manual entry of chords'}
              sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
            >
              <sup>[2]</sup>
            </Link>
            ,{' '}
            <Link
              underline='hover'
              onClick={(event) => {
                event.preventDefault();
                ref3.current.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              href={'#Manual entry of chords'}
              sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
            >
              <sup>[3]</sup>
            </Link>
            ,{' '}
            <Link
              underline='hover'
              onClick={(event) => {
                event.preventDefault();
                ref4.current.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              href={'#Manual entry of chords'}
              sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
            >
              <sup>[4]</sup>
            </Link>
            . However, applying the DFT to music requires advanced mathematical
            and computational skills. Harnessing the full power of such a
            complex method so far remained restricted to only a small group of
            researchers.The app’s interactive interface enables scholars and
            students of music, as well as musicians, to employ the DFT method in
            their research, teaching, and musical practice. It is moreover
            ideally suited to explore and to teach visualization techniques for
            complex cultural data, for example in Digital Humanities.
          </Paragraph>

          <Paragraph>
            The{' '}
            <BlueLink target='_self' href={'#theory'}>
              Theory
            </BlueLink>{' '}
            page describes how to use and interpret the DFT for music analysis.
            It also explains the interface of the{' '}
            <BlueLink target='_self' href={'#analysis'}>
              Analysis
            </BlueLink>{' '}
            page. On that page, users can explore the DFT method by either
            manually entering{' '}
            <BlueLink href={'https://en.wikipedia.org/wiki/Set_theory_(music)'}>
              pitch-class sets
            </BlueLink>
            , by uploading a music piece in{' '}
            <BlueLink href={'https://en.wikipedia.org/wiki/MIDI'}>
              MIDI
            </BlueLink>{' '}
            format, or by connecting a MIDI device (e.g. MIDI keyboard or
            software) to the app.
          </Paragraph>

          <Paragraph>
            No installation is required to use the app, and we hope that this
            will facilitate its adoption by the music theory community. The full
            feature set of the app is currently only supported with{' '}
            <BlueLink href={'https://www.google.com/chrome/index.html'}>
              chrome
            </BlueLink>
            . The program code is hosted on{' '}
            <BlueLink href={'https://github.com/DCMLab/MIDFT'}>GitHub</BlueLink>{' '}
            under a GPL3 licence.
          </Paragraph>

          <Typography variant='h5' sx={{ marginBottom: 1 }}>
            <b>References</b>
          </Typography>
          <Typography ref={ref1}>
            1: Amiot (2016). Music Through Fourier Space: Discrete Fourier
            Transform in Music Theory. Springer.
          </Typography>
          <Typography ref={ref2}>
            2: Noll (2019). Insiders’ Choice: Studying Pitch Class Sets Through
            Their Discrete Fourier Transformations. In{' '}
            <i>Mathematics and Computation in Music</i> (pp. 371–378). Springer.{' '}
            <BlueLink href={'https://doi.org/10.1007/978-3-030-21392-3_32'}>
              https://doi.org/10.1007/978-3-030-21392-3_32
            </BlueLink>
          </Typography>
          <Typography ref={ref3}>
            3: Tymoczko & Yust (2019). Fourier Phase and Pitch-Class Sum. In
            <i>Mathematics and Computation in Music</i> (pp. 46–58). Springer.{' '}
            {''}
            <BlueLink href={'https://doi.org/10.1007/978-3-030-21392-3_4'}>
              https://doi.org/10.1007/978-3-030-21392-3_4
            </BlueLink>
          </Typography>
          <Typography ref={ref4}>
            4: Viaccoz, Harasim, Moss, & Rohrmeier (in press). Wavescapes: A
            Visual Hierarchical Analysis of Tonality using the Discrete Fourier
            Transformation. <i>Musicae Scientiae</i>.{' '}
            <BlueLink href={'https://doi.org/10.1177/10298649211034906'}>
              https://doi.org/10.1177/10298649211034906
            </BlueLink>
          </Typography>
        </Box>
      </Paper>
      <Footer />
    </>
  );
}
