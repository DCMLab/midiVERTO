//React
import { useEffect, useRef } from 'react';

//Import material UI components
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Footer from '../Footer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { BlueLink, Info, Image, Paragraph } from '../textComponents';

//Markdown tests
import Tex from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';

export default function Theory({ setOpen, setInAnalysisPage }) {
  let ref1 = useRef(null);
  let ref2 = useRef(null);
  let ref3 = useRef(null);
  let ref4 = useRef(null);
  let ref5 = useRef(null);
  let ref6 = useRef(null);

  useEffect(() => {
    setInAnalysisPage(false);
    setOpen(false);
  }, []);

  return (
    <>
      <Paper sx={{ margin: 'auto', maxWidth: '1200px' }}>
        <Box sx={{ padding: 3, width: '1060px', margin: 'auto' }}>
          <Typography
            variant='h2'
            style={{ fontWeight: 'bold', marginLeft: 20 }}
          >
            Manual
          </Typography>
          <Divider />

          <Typography component='span'>
            <ul>
              <li>
                <Link
                  underline='hover'
                  onClick={(event) => {
                    event.preventDefault();
                    ref1.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#File upload'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  File upload
                </Link>
              </li>
              <li>
                <Link
                  underline='hover'
                  onClick={(event) => {
                    event.preventDefault();
                    ref2.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#Wavescapes'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  Wavescapes
                </Link>
              </li>
              <li>
                <Link
                  underline='hover'
                  onClick={(event) => {
                    event.preventDefault();
                    ref3.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#Fourier Coefficient Spaces'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  Fourier Coefficient Spaces
                </Link>
              </li>
              <li>
                <Link
                  underline='hover'
                  onClick={(event) => {
                    event.preventDefault();
                    ref4.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#MIDI playback and overall layout'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  MIDI playback and overall layout
                </Link>
              </li>
              <li>
                <Link
                  underline='hover'
                  onClick={(event) => {
                    event.preventDefault();
                    ref5.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#Manual entry of chords'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  Manual entry of chords
                </Link>
              </li>
              <li>
                <Link
                  underline='hover'
                  onClick={(event) => {
                    event.preventDefault();
                    ref6.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#Download images'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  Download images
                </Link>
              </li>
            </ul>
          </Typography>

          {/* FILE UPLOAD */}
          <Box sx={{ paddingBottom: 5, paddingTop: 5 }}>
            <Typography ref={ref1} variant='h4' style={{ fontWeight: 'bold' }}>
              File upload
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Paragraph>
              The easiest way to get started using the app is to find a MIDI
              file on the web and upload it. For example, we can use the main
              theme of the musical{' '}
              <BlueLink
                sx={{ fontStyle: 'italic' }}
                href='https://bitmidi.com/uploads/6508.mid'
              >
                Phantom of the Opera
              </BlueLink>
              . (Right-)Click on the link to download the file, switch to the{' '}
              <BlueLink target='_self' href='#/analysis'>
                Analysis
              </BlueLink>{' '}
              tab of this app, and upload it.{' '}
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/8JdAyNM.png'
              scale='50%'
            ></Image>

            <Paragraph>
              Before or after uploading the file, you can choose a{' '}
              <b>Time resolution</b> either as a musical note value or as a
              duration in seconds. This affects into how many segments the MIDI
              file will be divided for analysis. If you change the resolution
              after the upload, you have to click on <b>CHANGE</b> so that the
              time-resolution change takes effect. For the{' '}
              <i>Phantom of the Opera</i> example, we recommend a resolution of
              an eighth note.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/ykmKgrB.png'
              scale='45%'
            ></Image>
          </Box>

          {/* WAVESCAPES */}
          <Box sx={{ paddingBottom: 5 }}>
            <Typography ref={ref2} variant='h4' style={{ fontWeight: 'bold' }}>
              Wavescapes
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              Depending on the length of the piece and the chosen time
              resulution, the app might take a while until the file is
              processed. When processing has finished, the app visualizes the
              piece with six triangular plots called <i>Wavescapes</i> (details
              about this analysis method are described{' '}
              <BlueLink href='https://doi.org/10.1177/10298649211034906'>
                in this paper
              </BlueLink>
              ).
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/ySOPcoP.png'
              scale='90%'
            ></Image>
            <Paragraph>
              In short, wavescapes use a mathematical formalism called the{' '}
              <BlueLink
                sx={{ fontStyle: 'italic' }}
                href='https://en.wikipedia.org/wiki/Discrete_Fourier_transform'
              >
                Discrete Fourier Transform
              </BlueLink>{' '}
              (DFT), to display regularities with respect to scales that divide
              the octave into equal parts. Concretely, the wavescapes from 1 to
              6 correspond to specific divisions of the octave: into 12
              semitones, 6 tritones, 4 augmented triads, 3 diminished-seventh
              chords, 12 diatonic/pentatonic scales, and two whole-tone scales.
              If a part of a piece predominantly uses pitches from such a
              collection, the corresponding areas in the wavescapes will be
              relatively homogeneous in color. For example, if the notes of the
              B diminished triad <code>B° = (11, 2, 5, 8)</code> are used
              recurrently then this is shown in green in the fourth wavescape.
              For more details, see{' '}
              <BlueLink href={'https://doi.org/10.1177/10298649211034906'}>
                this paper
              </BlueLink>
              .
            </Paragraph>
            <Paragraph>
              Back to the <i>Phantom</i> example: there are a number of
              interesting observations about the tonality of this piece that we
              can draw from the wavescapes.
            </Paragraph>
            <Paragraph>
              <b>Wavescapes 3 and 5</b> have the strongest colors, meaning that
              diating scales as well as augmented triads play and important role
              for the harmonic organization of the piece.
            </Paragraph>
            <Paragraph>
              <b>On the lower levels of the 3rd wavescape,</b> the colors blue -
              green - yellow - pink ( - green - ) pink change in regular time
              intervals. Tracing this sequence of colors in the corresponding
              Fourier Coefficient Space (see also below), we observe that these
              colors corresponding Fourier Coefficient Space (see also below),
              we observe that these colors correspond to the lables{' '}
              <Tex math='H_{1,2}' />, <Tex math='H_{2,3}' />
              , <Tex math='H_{0, 3}' />
              , and <Tex math='H_{0, 1}' />, respectively (in clockwise
              direction). A label <Tex math='H_{i,j}' /> denotes the hexatonic
              scale that contains the{' '}
              <BlueLink href={'https://en.wikipedia.org/wiki/Pitch_class'}>
                pitch classes
              </BlueLink>{' '}
              <Tex math='i' /> and <Tex math='j' /> (e.g.,{' '}
              <Tex math='H_{1,2}=\{1,2,5,6,9,10\}' />
              ). The overall harmonic trajectory of this piece moves in
              descending minor thirds, and at the end briefly moves across the
              plane to its hexatonic pole.
            </Paragraph>
            <Paragraph>
              <b>On the lowever levels of the 5th wavescape,</b> the color
              pattern is roughly orange/red - green - pink, showing that the
              initial, middle, and final parts of this piece modulate through
              different keys. Note that the red and pink areas are adjacent to
              each other but opposite to the green area, again showing a
              symmetrical organization in terms of keys.
            </Paragraph>
            <Paragraph>
              <b>Finally, the 6th wavescape</b> shows that the first half of the
              piece is closer to the whole-tone scale containing C (
              <Tex math='WT_0' />, reddish) and the second half is closer to the
              whole-tone scale containing C# (<Tex math='WT_1' />, blueish).
            </Paragraph>
            <Paragraph>
              Observations like these can guide analyses and inspire hearings of
              musical pieces, in particular regarding the relation of harmony
              and form.
            </Paragraph>
          </Box>

          {/* Fourier Coefficient Spaces */}
          <Box sx={{ paddingBottom: 5 }}>
            <Typography ref={ref3} variant='h4' style={{ fontWeight: 'bold' }}>
              Fourier Coefficient Spaces
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              Below the wavescapes you see the respective{' '}
              <b>Fourier Coefficient Spaces</b>. Each point in one of these
              spaces corresponds to the value of that Fourier coefficient for
              one of the MIDI file's segments.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/d8Pzxs6.png'
              scale='90%'
            ></Image>
            <Paragraph>
              Change the window length and see, how the arrangement of the
              points changes, too.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/pA1WR1E.png'
              scale='45%'
            ></Image>
            <Paragraph>
              Very short window lengths tend to distribute the segments of the
              piece more evenly throughout the circles. In contrast, long window
              lengths collapse the semgents into a small area, and even into a
              single point if the window covers the entire piece (this
              corresponds to the topmost point of the wavescapes). It is
              therefore a good idea to try different window lengths in order to
              identify an appropriate level of detail, in which the piece moves
              along rather smooth paths in at least some coefficients. The gif
              below shows the effect of increasing the window size.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/j3OeT3d.gif'
              scale='90%'
            ></Image>
            <Paragraph>
              Changing the parameters time resolution and window length yield
              different analytical perspectives on the piece and allow for a
              scalable and dynamic reading of a piece.
            </Paragraph>

            <Info>
              <b>Note:</b> the wavescapes do not change because re-rendering
              them could last very long if the piece is long and the
              segmentation is too fine-grained.
            </Info>
          </Box>

          {/* MIDI playback and overall layout */}
          <Box sx={{ paddingBottom: 5 }}>
            <Typography ref={ref4} variant='h4' style={{ fontWeight: 'bold' }}>
              MIDI playback and overall layout
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              On the bottom of the main window, there are options to control the
              playback of the uploaded MIDI file.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/JOci5Ww.png'
              scale='40%'
            ></Image>
            <Paragraph>
              Several other options to change the visual layout of the app are
              available in the bottom menu. You can toggle:
            </Paragraph>
            <Typography sx={{ fontSize: 20 }} component={'span'}>
              <ul>
                <li>the full trace,</li>
                <li>the prototypes (circular legends), and</li>
                <li>
                  the values for phase and magnitude (<Tex math='\phi' /> and{' '}
                  <Tex math='\mu' />
                  ).
                </li>
              </ul>
            </Typography>
            <Image
              alt={' '}
              src='https://i.imgur.com/tD8U2GU.png'
              scale='40%'
            ></Image>
            <Paragraph>
              The size of the Fourier-space circles can also be adjusted
              relative to the size of your browser window.
            </Paragraph>
            <Paragraph>
              You can modify the overall layout by selecting one of the
              pre-defined options on the far left (1x6, 2x3, 3x2, 6x1); the
              default is 2x3. On the top left, next to the file upload, you find
              an arrow to hide/show the main menu, e.g., to focus on the
              wavescapes and Fourier coefficients.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/Ym4gr84.png'
              scale='90%'
            ></Image>
          </Box>

          {/* Manual entry of chords */}
          <Box sx={{ paddingBottom: 5 }}>
            <Typography ref={ref5} variant='h4' style={{ fontWeight: 'bold' }}>
              Manual entry of chords
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              Apart from uploading a musical piece as a MIDI file, the app also
              allows you to enter your favorite pitch-class sets. This can be
              useful if you want to show, for instance, certain chord
              progressions, harmonic sequences, or voice-leading chains. It can
              also be useful to display interesting pitch-class sets taken from
              a particular piece. Those can be entered in the{' '}
              <b>Custom pitch-class vectors</b> field and allow for two basic
              input formats.
            </Paragraph>
            <Typography sx={{ fontSize: 20 }} component={'span'}>
              <ol>
                <li>
                  Pitch-class (multi-)sets are enclosed in curyly braces{' '}
                  <code>&#123;</code> and <code>&#125;</code> and contain pitch
                  classes (integers ranging from 0 to 11). We allow for multiple
                  occurrences of pitch classes, for example you can enter{' '}
                  <code>(0, 0, 4, 7, 10)</code> for a C dominant-seventh chord
                  with doubled C.
                </li>
                <li>
                  (Weighted) pitch-class vectors are enclosed in parentheses{' '}
                  <code>(</code> and <code>)</code>, and must have twelve
                  comma-separated non-negative numbers. Internally, these
                  vectors are normalized to sum to one, so only the relative
                  weights are taken into account. For the C dominant-seventh
                  chord from above one would enter
                  <code>(2,0,0,0,1,0,0,1,0,0,1,0)</code>.
                </li>
              </ol>
            </Typography>

            <Image
              alt={' '}
              src='https://i.imgur.com/VLfxxV9.png'
              scale='40%'
            ></Image>
            <Info>
              <b>Note</b>: white spaces in the custom input are ignored.
            </Info>
            <Paragraph>
              The collection of manually entered pitch-class vectors is
              displayed below the input field. Entries in this collection can be
              toggled by clicking on them, or deleted by clicking on the x. When
              loading the app, three pitch-class vectors are already in the
              collection, and the first of them is active. They need to be
              deactivated or deleted if you don't want them to be displayed.
            </Paragraph>
            <Paragraph>
              This functionality can also be used to visualize pitch-class
              vectors from concrete compositions. Let's take the anacrusis of{' '}
              <BlueLink
                href={
                  'https://imslp.org/wiki/3_Pieces,_Op.52_(Scriabin,_Aleksandr)'
                }
              >
                Scriabin’s op. 52/3 (1907) "Languorous Poem"
              </BlueLink>{' '}
              as a real-world example.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/cG9J08Z.png'
              scale='35%'
            ></Image>
            <Paragraph>
              If we count each quarter note as 1 (and eight notes as 0.5), then
              its pitch-class content can be represented as the pitch-class
              vector <code>(1.5, 0, 1, 0, 1, 1, 0, 0.5, 0, 0, 1.5, 0)</code>.
              The figure below shows with an asterisk where it is mapped to in
              the respective Fourier coeffient spaces.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/9x6GLVG.png'
              scale='90%'
            ></Image>
            <Paragraph>
              If we count each quarter note as 1 (and eight notes as 0.5), then
              its pitch-class content can be represented as the pitch-class
              vector <code>(1.5, 0, 1, 0, 1, 1, 0, 0.5, 0, 0, 1.5, 0)</code>.
              The figure below shows with an asterisk where it is mapped to in
              the respective Fourier coeffient spaces.
            </Paragraph>
            <Paragraph>
              This chord can be understood as a C7/9/11 chord despite the fact
              that the key signature indicates B major / G <span>&#9839;</span>{' '}
              minor. Being a dominant, it strongly points to the F-major
              prototype (marked by <span>&#9837;</span> ) in the fifth
              coefficient. Connoisseurs of Scriabin's harmonic language will
              recognize this chord as the tritone substitution of the extended
              dominant on F<span>&#9839;</span>.
            </Paragraph>
            <Info>
              <b>Note</b>: Of course you are free to enter any pitch-class
              vector. It does not need to correspond to standard chords but can
              also, for example, refer to segments (potentially non-contiguous)
              in an atonal composition.
            </Info>
          </Box>

          {/* Download images */}
          <Box sx={{ paddingBottom: 5, paddingLeft: 2 }}>
            <Typography ref={ref6} variant='h4' style={{ fontWeight: 'bold' }}>
              Download images
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              Finally, to download the results (e.g., for teaching purposes, a
              presentation, or a publication) click on <b>EXPORT IMAGES</b> at
              the bottom of the main menu on the left.{' '}
            </Paragraph>
          </Box>
        </Box>
      </Paper>
      <Footer />
    </>
  );
}
