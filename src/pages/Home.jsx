import React from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
// Assure-toi que intro.md est bien dans src/docs/
import introContent from '../docs/intro.md?raw';

export default function Home() {
  return (
    <div className="page-home">
      <header className="home-hero">
        <h1>C.A.S.T. – Quand l’art devient prière</h1>
        <p>
          Le Chœur Artistique & Spirituel de Tanà, une cathédrale vivante de foi et d’harmonie.
        </p>
      </header>

      <section className="home-intro">
        <MarkdownRenderer content={introContent} />
      </section>
    </div>
  );
}