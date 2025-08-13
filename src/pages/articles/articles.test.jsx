import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import articles from './articles';

describe('articles', () => {
    it('renders the title', () => {
        render(<articles />);
        expect(screen.getByText('articles')).toBeDefined();
    });
});
