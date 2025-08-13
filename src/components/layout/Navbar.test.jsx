import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

test('renders Navbar component', () => {
    render(<Navbar />);
    const element = screen.getByText(/component placeholder/i);
    expect(element).toBeInTheDocument();
});
