import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders Footer component', () => {
    render(<Footer />);
    const element = screen.getByText(/footer component placeholder/i);
    expect(element).toBeInTheDocument();
  });
});