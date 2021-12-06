import { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import Markdown from '../Markdown';
import Box from '@mui/material/Box';
import Footer from '../Footer';
import TheoryMarkdown from '../TheoryMarkdown.md';

export default function Theory({ setOpen, setInAnalysisPage }) {
  const [content, setContent] = useState(``);

  useEffect(() => {
    setInAnalysisPage(false);
    setOpen(false);

    //Fetch the text of the markdown file as a string
    fetch(TheoryMarkdown)
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
