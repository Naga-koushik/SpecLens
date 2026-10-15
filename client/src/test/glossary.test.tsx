import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { GlossaryTerm } from '../components/common/GlossaryTerm';
import { findGlossaryTerm } from '../constants/glossary';

describe('Glossary and GlossaryTerm Component', () => {
  it('finds definitions for known technical smartphone terms', () => {
    expect(findGlossaryTerm('AMOLED')).not.toBeNull();
    expect(findGlossaryTerm('ltpo')).not.toBeNull();
    expect(findGlossaryTerm('Refresh Rate')).not.toBeNull();
    expect(findGlossaryTerm('Chipset')).not.toBeNull();
    expect(findGlossaryTerm('NFC')).not.toBeNull();
    expect(findGlossaryTerm('eSIM')).not.toBeNull();
    expect(findGlossaryTerm('UnknownTerm123')).toBeNull();
  });

  it('renders known glossary term with keyboard accessibility and opens tooltip', () => {
    render(<GlossaryTerm term="AMOLED" />);

    const button = screen.getByRole('button', { name: /AMOLED/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Click button to toggle tooltip open
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(/Active-Matrix Organic Light-Emitting Diode/i);

    // Escape closes tooltip
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders plain text when term is not in glossary', () => {
    const { container } = render(<GlossaryTerm term="Just A Standard Label" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container).toHaveTextContent('Just A Standard Label');
  });
});
