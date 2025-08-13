// src/MainRouter.jsx
import { Routes, Route } from 'react-router-dom';
import MarkdownPage from './components/MarkdownPage';
import Home from './pages/Home';

const MainRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/vision" element={<MarkdownPage slug="vision" />} />
    <Route path="/team" element={<MarkdownPage slug="team" />} />
    <Route path="/in-memoriam" element={<MarkdownPage slug="in-memoriam" />} />
    <Route path="/locations" element={<MarkdownPage slug="locations" />} />
    <Route path="/repertoire" element={<MarkdownPage slug="repertoire" />} />
    <Route path="/collaborations" element={<MarkdownPage slug="collaborations" />} />
    <Route path="/distribution" element={<MarkdownPage slug="distribution" />} />
    <Route path="/contact" element={<MarkdownPage slug="contact" />} />
    {/* autres routes */}
  </Routes>
);

export default MainRouter;