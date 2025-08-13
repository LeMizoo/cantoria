// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const links = [
  { to: '/',            label: 'Accueil' },
  { to: '/vision',      label: 'Vision' },
  { to: '/team',        label: 'Équipe' },
  { to: '/in-memoriam', label: 'Hommages' },
  { to: '/locations',   label: 'Lieux' },
  { to: '/repertoire',  label: 'Répertoire' },
  { to: '/collaborations', label: 'Collaborations' },
  { to: '/distribution',   label: 'Distribution' },
  { to: '/contact',      label: 'Contact' },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <button
        className="navbar__toggle"
        onClick={() => setOpen(o => !o)}
      >
        ☰
      </button>
      <ul className={`navbar__list ${open ? 'open' : ''}`}>
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar; // ✅ export par défaut