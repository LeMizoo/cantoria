import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CheckTest from '../components/spiritual/CheckTest/CheckTest.jsx';

describe('CheckTest', () => {
  it('devrait s\'afficher correctement', () => {
    render(<CheckTest />);
    expect(screen.getByText('CheckTest component')).toBeInTheDocument();
  });
});