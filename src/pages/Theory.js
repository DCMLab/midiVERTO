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
  let ref7 = useRef(null);
  let ref8 = useRef(null);
  let ref9 = useRef(null);

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
                    ref8.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#DFT'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  Discrete Fourier Transform of Pitch-Class Vectors
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
                    ref9.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#Download images'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  Coefficient Products and Phase Spaces
                </Link>
              </li>
              <li>
                <Link
                  underline='hover'
                  onClick={(event) => {
                    event.preventDefault();
                    ref7.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  href={'#Using midiVERTO with MuseScore'}
                  sx={{ color: '#1976d2', textDecorationColor: '#1976d266' }}
                >
                  Using midiVERTO with MuseScore
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
          {/* Discrete Fourier Transform of Pitch-Class Vectors */}
          <Box sx={{ paddingBottom: 5 }}>
            <Typography ref={ref8} variant='h4' style={{ fontWeight: 'bold' }}>
              Discrete Fourier Transform of Pitch-Class Vectors
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              The analyses performed by midiVERTO are all based on the discrete
              Fourier transform (DFT) of pitch-class vectors (pc vectors). A pc
              vector is a 12-dimensional vector where each entry contains a
              weighting for a specific pitch class, starting with C and going up
              chromatically. In midiVERTO, these entries correspond to
              duration-weighted counts of occurrences of the pitch class within
              some time window of the MIDI file.
            </Paragraph>
            <Paragraph>
              The DFT converts these pc vectors to a different 12-D vector where
              the entries (called <i>coefficients</i>) represent periodic
              functions over the octave rather than individual pitch classes. We
              ignore the zeroeth coefficient (which is a constant representing
              the sum of all weights) and entries beyond the sixth, which
              reproduce information from coefficients 1 through 6. The number of
              a coefficient corresponds to a division of the octave.
              Coefficients have a <i>magnitude</i>, which indicates how similar
              that pc vector is to a simple periodic function with that division
              of the octave, and a <i>phase</i>, which indicates where that
              function is centered on the pitch-class circle.
            </Paragraph>
            <Paragraph>
              Thus, the <i>first</i> coefficient reflects how concentrated the
              pitch-class vector is at one place in the pitch-class circle. The
              <i>second</i> coefficient reflects how concentrated it is on two
              points a tritone apart. The <i>third</i> coefficient shows how
              concentrated it is on three points on the pitch-class circle
              separated by major thirds, i.e., how triad-like it is, and the
              <i>fourth</i> coefficient on four points separated by minor
              thirds, how much it resembles a diminished seventh chord. A
              periodic function for the <i>fifth</i> coefficient does not divide
              the 12 pitch-classes evenly, but the peaks of this function
              arrange the pitch classes in circle-of-fifths order, which means
              that the fifth coefficient reflects how concentrated the pc vector
              is on the circle of fifths, or its <i>diatonicity</i>. Finally,
              the <i>sixth</i> coefficient splits the pitch classes into two
              whole tone scales and shows how much the pc vector is weighted to
              one or the other.
            </Paragraph>
            <Paragraph>
              Phase values for all coefficients are set to 0 = C and go
              clockwise as the pitch-class value ascends. For instance a phase
              value of 0 on coefficient 1 means that the pc vector is balanced
              around C on the pitch-class circle, a phase value of{' '}
              <Tex math='\pi / 6' /> would mean it is balanced around C#, and so
              on. For coefficient 2, a phase value of 0 means that the pc vector
              is balanced around C and F#, a phase value of{' '}
              <Tex math='\pi / 3' /> means it's balanced around C# and G, and so
              on.
            </Paragraph>
            <Paragraph>
              For more on the DFT on pc vectors, see:{' '}
              <ul>
                <li>
                  <BlueLink href='https://www.jstor.org/stable/25164642'>
                    General Equal-Tempered Harmony: Parts 2 and 3
                  </BlueLink>
                </li>
                <li>
                  <BlueLink href='https://link.springer.com/book/10.1007/978-3-319-45581-5'>
                    Music Through Fourier Space
                  </BlueLink>
                </li>
                <li>
                  <BlueLink href='https://sites.bu.edu/jyust/files/2022/09/JNMRsub-pcdistRev.pdf'>
                    Stylistic Information in Pitch-Class Distributions
                  </BlueLink>
                </li>
                <li>
                  <BlueLink href='https://open.bu.edu/handle/2144/39069'>
                    Harmonic qualities in Debussy's{' '}
                    <i>"Les sons et les parfums tournent dans l'air du soir"</i>
                  </BlueLink>
                </li>
                <li>
                  <BlueLink href='https://hal.archives-ouvertes.fr/JIM/hal-03362929'>
                    Fourier Methods For Computational Analysis Of Enharmonicism
                    And Other Harmonic Properties
                  </BlueLink>
                </li>
                <li>
                  <BlueLink href='https://mtosmt.org/issues/mto.21.27.3/mto.21.27.3.chiu.html'>
                    Macroharmonic Progressions through the Discrete Fourier
                    Transform: An Analysis from Maurice Duruflé's Requiem
                  </BlueLink>
                </li>
                <li>
                  <BlueLink href='https://hcommons.org/deposits/item/hc:31937/'>
                    Computer-Aided Analysis Across the Tonal Divide:
                    Cross-Stylistic Applications of the Discrete Fourier
                    Transform
                  </BlueLink>
                </li>
                <li>
                  <BlueLink href='https://link.springer.com/chapter/10.1007/978-3-319-46282-0_15'>
                    Conchord: An Application for Generating Musical Harmony by
                    Navigating in the Tonal Interval Space
                  </BlueLink>
                </li>
                <li>
                  <BlueLink href='https://www.tandfonline.com/doi/full/10.1080/09298215.2016.1182192'>
                    A multi-level tonal interval space for modelling pitch
                    relatedness and musical consonance
                  </BlueLink>
                </li>
              </ul>
            </Paragraph>
          </Box>
          {/* WAVESCAPES */}
          <Box sx={{ paddingBottom: 5 }}>
            <Typography ref={ref2} variant='h4' style={{ fontWeight: 'bold' }}>
              Wavescapes
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              Depending on the length of the piece and the chosen time
              resolution, the app might take a while until the file is
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
              Wavescapes display the DFT on pc vectors, described in the
              previous section, at all possible different segmentations of the
              MIDI file. The bottom rows of the wavescapes show DFTs at the
              minimal time resolution set by the user, and the top points show
              DFTs for the pc content of entire piece. The intensity values at
              each point reflect the magnitude of the given coefficient while
              the colors indicate the phase values (using a color wheel with red
              set to zero).
            </Paragraph>
            <Paragraph>
              Back to the <i>Phantom</i> example: there are a number of
              interesting observations about the tonality of this piece that we
              can draw from the wavescapes.
            </Paragraph>
            <Paragraph>
              <b>Wavescapes 3 and 5</b> have the strongest colors, meaning that
              diatonic scales as well as augmented triads play and important
              role for the harmonic organization of the piece.
            </Paragraph>
            <Paragraph>
              <b>On the lower levels of the 3rd wavescape,</b> the colors blue -
              green - yellow - pink ( - green - ) pink change in regular time
              intervals. Tracing this sequence of colors in the corresponding
              Fourier Coefficient Space (see also below), we observe that these
              colors correspond to the labels <Tex math='H_{1,2}' />,{' '}
              <Tex math='H_{2,3}' />
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
              descending minor thirds, and at the end it briefly moves across
              the plane to its hexatonic pole.
            </Paragraph>
            <Paragraph>
              <b>On the lower levels of the 5th wavescape,</b> the color pattern
              is roughly orange/red - green - pink, showing that the initial,
              middle, and final parts of this piece modulate through different
              keys. Note that the red and pink areas are adjacent to each other
              but opposite to the green area, again showing a symmetrical
              organization in terms of keys.
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
              one of the MIDI file&#39;s segments at the specified resolution.
              The color and intensity coding is the same as for the wavescapes
              described above. Distances from the center correspond to
              magnitudes, and angles correspond to phases. (Fourier coefficients
              can also be defined as <i>complex numbers</i>, and in these spaces
              the real value is given by the x-coordinate and the imaginary
              value by the y-coordinate.)
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/d8Pzxs6.png'
              scale='90%'
            ></Image>
            <Paragraph>
              Change the window length and see how the arrangement of the points
              changes, too.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/pA1WR1E.png'
              scale='45%'
            ></Image>
            <Paragraph>
              Very short window lengths tend to distribute the segments of the
              piece more evenly throughout the circles. In contrast, long window
              lengths collapse the segments into a small area, and even into a
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
              <b>Custom pitch-class vectors</b> field which allows for two basic
              input formats.
            </Paragraph>
            <Typography sx={{ fontSize: 20 }} component={'span'}>
              <ol>
                <li>
                  Pitch-class (multi-)sets are enclosed in curly braces{' '}
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
              <b>Note</b>: white space is ignored in the custom input field.
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
              the respective Fourier coefficient spaces.
            </Paragraph>
            <Image
              alt={' '}
              src='https://i.imgur.com/9x6GLVG.png'
              scale='90%'
            ></Image>
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

          {/* Coefficient Products and Phase Spaces */}
          <Box sx={{ paddingBottom: 5 }}>
            <Typography ref={ref9} variant='h4' style={{ fontWeight: 'bold' }}>
              Coefficient Products and Phase Spaces
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              At the bottom of the results is a section that can do analyses
              involving multiple DFT coefficients at the same time. Dropdown
              menus allow users to select two coefficients (x and y). midiVERTO
              produces uses these selections to produce four visualizations: two
              coefficient product spaces, a phase space, and a phase space for
              the two coefficient products.
            </Paragraph>
            <Paragraph>
              The coefficient products multiply three DFT coefficients as
              complex numbers, where the indexes of these three coefficients
              must add up to 12. The user chooses the first coefficient, x,
              (index from 1 to 6) and the second, y, (from 1 to 5), and the
              third is given by the difference <Tex math='12 – x – y' />. For
              instance if the user chooses coefficients 3 and 5, the third
              coefficient index is <Tex math='12 – 3 – 5 = 4' />. Interesting
              properties of this type of coefficient product include:
              <ul>
                <li>
                  They are transposition invariant (the phases in addition to
                  the magnitudes). This means if you transpose a set the
                  coefficient product does not change.
                </li>
                <li>
                  Inversion reverses the imaginary part but does not affect the
                  real part. In other words, inversion is a reflection over the
                  real axis.
                </li>
                <li>
                  Complementation reverse both the real and imaginary parts. In
                  other words, complementation (or, subtracting all the values
                  in the pc vector from a constant) is a 180° rotation.
                </li>
                <li>A single pitch class is always positive real.</li>
              </ul>
              These are discussed in more detail in{' '}
              <BlueLink href='https://link.springer.com/chapter/10.1007/978-3-031-07015-0_23'>
                Yust &amp; Amiot 2022
              </BlueLink>{' '}
              [
              <BlueLink
                href={
                  'https://sites.bu.edu/jyust/files/2022/09/nonSpectralrevFin.pdf'
                }
              >
                PDF
              </BlueLink>
              ].
            </Paragraph>
            <Paragraph>
              The magnitude of a coefficient product is a product of the
              magnitudes and its phase is the sum of phases mod{' '}
              <Tex math='2\pi' />. The transposition invariance of the
              magnitudes of coefficient products is therefore unremarkable,
              since magnitudes of individual coefficients are transposition
              invariant. On the other hand, the transposition invariance of the
              phases <i>is</i> remarkable, since individual phases are
              determined by transposition.
            </Paragraph>
            <Paragraph>
              The lower of the two coefficient product spaces uses the same
              first coefficient entered by the user, but takes the complement of
              the second coefficient entered by the user, which can lead to a
              different product. For instance the default setting of{' '}
              <Tex math='x = 3' /> and <Tex math='y = 5' /> results in a product
              of coefficients 3, 5, and 4, and a compementary product of 3, 7,
              and 2. Coefficient 7 is the complex conjugate of coefficient 5,
              meaning it has the same magnitude but negative phase. Yet
              coefficients 4 and 2, which arise from the constraint that factors
              of coefficient products must sum to 12, are completely different.
            </Paragraph>
            <Paragraph>
              The right side of the lower panel has two phase spaces, meaning
              spaces that take phase values as coordinates, and ignore
              magnitudes. The one on top uses the individual phases for the
              coefficients selected by the user. This kind of phase space is
              discussed in{' '}
              <BlueLink
                href={
                  'https://read.dukeupress.edu/journal-of-music-theory/article-abstract/59/1/121/14499/Schubert-s-Harmonic-Language-and-Fourier-Phase'
                }
              >
                Yust 2015
              </BlueLink>{' '}
              [
              <BlueLink
                href={'https://people.bu.edu/jyust/revFinal_SchubertDFT.pdf'}
              >
                PDF
              </BlueLink>
              ] and{' '}
              <BlueLink
                href={
                  'https://read.dukeupress.edu/journal-of-music-theory/article-abstract/60/2/213/14521/Special-CollectionsRenewing-Set-Theory'
                }
              >
                Yust 2016
              </BlueLink>{' '}
              [
              <BlueLink href={'https://open.bu.edu/handle/2144/39071'}>
                PDF
              </BlueLink>
              ] . The second phase space uses the phase values for the two
              coefficient product spaces to the left.
            </Paragraph>
            <Paragraph>
              The default setting of coefficients 3 and 5 produces spaces that
              are of interest for music based on major and minor keys and
              functional harmony. Specifically, for sufficiently large windows,
              regions in the phase space on coefficients 3 and 5 correspond to
              keys. Vertical positions (coefficient 5) correspond to key
              signatures, while horizontal positions (coefficient 3) indicate a
              triadic balance and distinguish modes. The coefficient product on
              3, 7, and 2 (lower left) is typically large and positive-real for
              triadic harmony and major/minor keys. Smaller values and negative
              real values may indicate harmonic ambiguity or chromaticism.
            </Paragraph>
            <Paragraph>
              The coefficient product spaces are normalized to make the
              visualization as useful as possible, by setting 1 (the outer rim
              of the circle) to a maximum possible value given the total pc
              weighting (or zeroeth coefficient). This maximum varies depending
              on the kind of product the user enters. Larger maxima are possible
              if the product includes duplicates of a single coefficient (or a
              coefficient and its complement), and they are also larger if
              coefficient 6 (which has no complement) is included.
            </Paragraph>
          </Box>

          {/* Use midiVERTO with MuseScore */}
          <Box sx={{ paddingBottom: 5 }}>
            <Typography ref={ref7} variant='h4' style={{ fontWeight: 'bold' }}>
              Using midiVERTO with MuseScore
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Paragraph>
              The application and MuseScore can interact via MIDI messages. In
              order to communicate, we have to set up a virtual MIDI cable that
              connects MuseScore to the application:
              <ul>
                <li>
                  <b>Windows</b>
                  <ul>
                    <li>
                      Download and install{' '}
                      <BlueLink href='http://www.tobias-erichsen.de/software/loopmidi.html'>
                        loopMIDI
                      </BlueLink>
                    </li>
                    <li>
                      Open loopMIDI and use the “+” and “-” buttons on the
                      bottom to add or remove MIDI loopbacks. At least one
                      loopback must be active
                    </li>
                  </ul>
                </li>
                <li>
                  <b>macOS</b>
                  <ul>
                    <li>
                      Open Audio MIDI Setup in Applications → Utilities
                      directory
                    </li>
                    <li>
                      Double click on IAC Driver and check the "Device is
                      online" box
                    </li>
                    <li>
                      Add and remove buses in Ports tab, at least one must be
                      active
                    </li>
                  </ul>
                </li>
                <li>
                  <b>Linux</b>
                  <ul>
                    <li>
                      One virtual cable activated by default called "Midi
                      Through Port-0"
                    </li>
                    <li>
                      To add more virtual cables (3 in this example), use the
                      commands: <br />
                      <code>sudo modprobe -r snd-seq-dummy</code> <br />
                      <code>sudo modprobe snd-seq-dummy ports=3</code>
                    </li>
                    <li>
                      To visualize and edit connections, install{' '}
                      <code>acconectgui</code>
                    </li>
                  </ul>
                </li>
              </ul>
              Now we have to set up MuseScore to send MIDI messages via the
              virtual MIDI cable. In Edit → Preferences… → I/O → PortAudio →
              MIDI output, select the just created port. And only at the end
              open midiVERTO.
            </Paragraph>

            <Info>
              <b>Note:</b> Follow the steps in the suggested order. It may
              happen that MuseScore does not detect the MIDI port if it is
              already in use (for example by the application itself). Thus, set
              up the cable first, then open MuseScore and change the preferences
              and at the end open midiVERTO.
            </Info>
          </Box>
          {/* Download images */}
          <Box sx={{ paddingBottom: 5 }}>
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
