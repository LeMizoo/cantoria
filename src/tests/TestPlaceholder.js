import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TestPlaceholder from '../components/spiritual/TestPlaceholder/TestPlaceholder.jsx';

describe('TestPlaceholder', () => {
  it('devrait s\'afficher correctement', () => {
    render(<TestPlaceholder />);
    expect(screen.getByText('TestPlaceholder component')).toBeInTheDocument();
  });
});