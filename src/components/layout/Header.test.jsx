import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('renders Header component', () => {
    render(<Header />);
    const element = screen.getByText(/welcome to cantoria/i);
    expect(element).toBeInTheDocument();
  });
});