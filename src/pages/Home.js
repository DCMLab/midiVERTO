import { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import Markdown from '../Markdown';
import Box from '@mui/material/Box';
import HomeMarkdown from '../HomeMarkdown.md';

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
    <Paper sx={{ margin: 'auto', maxWidth: '1200px' }}>
      <Box sx={{ padding: 3 }}>
        <Markdown>{content}</Markdown>
      </Box>
    </Paper>
  );
}
