//React
import { useEffect, useState } from 'react';

//Import material UI components
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Footer from '../Footer';

//Markdown tests
import Markdown from '../Markdown';
import HomeMarkdown from '../HomeMarkdown.md';
/* import Markdown from '../Markdown'; */

//Home component
export default function Home({ setOpen, setInAnalysisPage }) {
  const [content, setContent] = useState(``);

  useEffect(() => {
    setInAnalysisPage(false);
    setOpen(false);

    //Fetch the text of the markdown file as a string
    fetch(HomeMarkdown)
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
      });
  }, []);

  return (
    <>
      <Paper sx={{ margin: 'auto', maxWidth: '1200px' }}>
        <Box sx={{ padding: 3 }}>
          <Markdown>{content}</Markdown>
        </Box>
      </Paper>
      <Footer />
    </>
  );
}
