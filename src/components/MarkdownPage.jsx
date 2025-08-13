import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../styles/markdown.css';

const MarkdownPage = () => {
  const { slug } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    import(`../../docs/${slug}.md`)
      .then(res => fetch(res.default))
      .then(res => res.text())
      .then(setContent)
      .catch(() => setContent('# Page non trouvée'));
  }, [slug]);

  return (
    <div className="markdown-container">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownPage;