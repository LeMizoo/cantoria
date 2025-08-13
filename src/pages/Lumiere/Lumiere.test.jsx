import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Lumiere from './Lumiere';

describe('Lumiere', () => {
    it('renders the page title', () => {
        render(<Lumiere />);
        expect(screen.getByText('Lumiere')).toBeDefined();
    });
});
