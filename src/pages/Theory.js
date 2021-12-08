import { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Footer from '../Footer';
import TheoryMarkdown from '../TheoryMarkdown.md';
import Markdown from '../Markdown';
import Tex from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';

const testContent = `
Given a **formula** below
$$
s = ut + \\frac{1}{2}at^{2}
$$
Calculate the value of $s$ when $u = 10\\frac{m}{s}$ and $a = 2\\frac{m}{s^{2}}$ at $t = 1s$
`;

const testRemark = `**Below me will be displayed as a block:**
$$ 
Block Math 
$$
**Next to me will be displayed as inline ->** $Inline Math$`;

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
          <Markdown>{`TEST Given a **formula** below`}</Markdown>
          <Tex math='s = ut + \frac{1}{2}at^{2}' block />
          <Markdown>{`TEST Given this **inline formula** `}</Markdown>
          <Tex math=' s = ut + \frac{1}{2}at^{2}' />
          <Markdown>{` I can continue writing on the same line`}</Markdown>
        </Box>
      </Paper>
      <Footer />
    </>
  );
}
