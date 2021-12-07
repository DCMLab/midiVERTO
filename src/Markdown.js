import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import Tex from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';

const _mapProps = (props) => ({
  ...props,
  escapeHtml: false,
  plugins: [RemarkMathPlugin],
  renderers: {
    ...props.renderers,
    math: (props) => <Tex math={props.value} block />,
    inlineMath: (props) => <Tex math={props.value} />,
  },
});

const Markdown = (props) => <ReactMarkdown {..._mapProps(props)} />;

export default Markdown;
