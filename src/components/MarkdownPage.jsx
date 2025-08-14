import React, { useEffect, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

// Vite raw loader fallback
const rawMarkdownFiles = import.meta.glob('../docs/*.md', { as: 'raw' });
// Vite-plugin-md loader (if compiled as component)
const mdComponents = import.meta.glob('../docs/*.md');

export default function MarkdownPage({ slug = 'intro' }) {
  const [content, setContent] = useState('');
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const filePath = `../docs/${slug}.md`;

    if (mdComponents[filePath]) {
      // Try to load as React component
      mdComponents[filePath]()
        .then(mod => setComponent(() => mod.default))
        .catch(() => setError(true));
    } else if (rawMarkdownFiles[filePath]) {
      // Fallback to raw content
      rawMarkdownFiles[filePath]()
        .then(setContent)
        .catch(() => setError(true));
    } else {
      setError(true);
    }
  }, [slug]);

  if (error) {
    return (
      <div className="markdown-error">
        <h2>Contenu introuvable</h2>
        <p>Aucun fichier Markdown trouvé pour <code>{slug}</code>.</p>
      </div>
    );
  }

  if (Component) {
    return <Component />;
  }

  return <MarkdownRenderer content={content} />;
}