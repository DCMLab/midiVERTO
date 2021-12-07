import * as React from 'react';
/* import ReactMarkdown from 'markdown-to-jsx'; */
import Typography from '@mui/material/Typography';
/* import { Link } from 'react-router-dom'; */
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

function MarkdownListItem(props) {
  return <Box component='li' sx={{ mt: 1, typography: 'body1' }} {...props} />;
}

function LinkReference({ to, ...props }) {
  const myRef = React.useRef(null);

  //Check for reference links, prevent default to not reload the page
  //and scrollIntoView to focus on the footer when clicked
  if (!isNaN(parseInt(props.href[1]))) {
    return (
      <Link
        ref={myRef}
        onClick={(event) => {
          event.preventDefault();
          myRef.current.scrollIntoView({
            behavior: 'smooth',
          });
        }}
        {...props}
        id={`reference${props.href[1]}`}
        href={`/#${props.href[1]}`}
      />
    );
  } else return <Link {...props} />; //Else it is a normal external link
}

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4',
        component: 'h1',
      },
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h6', component: 'h2' },
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'subtitle1' },
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'caption',
        paragraph: true,
      },
    },
    p: {
      component: Typography,
      props: { paragraph: true },
    },
    a: {
      component: LinkReference,
    },
    li: {
      component: MarkdownListItem,
    },
  },
};

export default function Markdown(props) {
  return {
    /* <ReactMarkdown options={options} {...props} /> */
  };
}
