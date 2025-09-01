import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }: any) => (
    <span className={className} data-testid="font-awesome-icon" data-icon={icon.iconName}>
      {icon.iconName}
    </span>
  )
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
  faBook: { iconName: 'book' },
  faBookOpen: { iconName: 'book-open' }
}));

// Mock FeatureComponent
vi.mock('../../FeatureComponent', () => ({
  __esModule: true,
  default: ({ children }: any) => children({})
}));

// Mock Features config
vi.mock('../../../config/FeaturesConfig', () => ({
  Features: {
    ReaderMode: 'readerMode'
  }
}));

// Mock CSS import
vi.mock('../ReaderMode.css', () => ({}));

import ReaderMode from '../ReaderMode';

describe('ReaderMode', () => {
  beforeEach(() => {
    // Clear localStorage and DOM classes
    localStorage.clear();
    document.documentElement.classList.remove('reader-mode-active');
    
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('reader-mode-active');
  });

  it('renders reader mode button with book icon when not in reader mode', () => {
    render(<ReaderMode />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Enter Reader Mode');
    expect(button).toHaveAttribute('title', 'Enter Reader Mode');
    
    const icon = screen.getByTestId('font-awesome-icon');
    expect(icon).toHaveAttribute('data-icon', 'book');
  });

  it('loads saved reader mode preference from localStorage on mount', () => {
    localStorage.setItem('docusaurus-reader-mode', 'true');
    
    render(<ReaderMode />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Exit Reader Mode');
    
    const icon = screen.getByTestId('font-awesome-icon');
    expect(icon).toHaveAttribute('data-icon', 'book-open');
    
    expect(document.documentElement).toHaveClass('reader-mode-active');
  });

  it('toggles reader mode when button is clicked', () => {
    render(<ReaderMode />);
    
    const button = screen.getByRole('button');
    
    // Initially not in reader mode
    expect(button).toHaveAttribute('aria-label', 'Enter Reader Mode');
    expect(document.documentElement).not.toHaveClass('reader-mode-active');
    
    // Click to enter reader mode
    fireEvent.click(button);
    
    expect(button).toHaveAttribute('aria-label', 'Exit Reader Mode');
    expect(document.documentElement).toHaveClass('reader-mode-active');
    expect(localStorage.getItem('docusaurus-reader-mode')).toBe('true');
    
    const icon = screen.getByTestId('font-awesome-icon');
    expect(icon).toHaveAttribute('data-icon', 'book-open');
    
    // Click to exit reader mode
    fireEvent.click(button);
    
    expect(button).toHaveAttribute('aria-label', 'Enter Reader Mode');
    expect(document.documentElement).not.toHaveClass('reader-mode-active');
    expect(localStorage.getItem('docusaurus-reader-mode')).toBe('false');
    
    const updatedIcon = screen.getByTestId('font-awesome-icon');
    expect(updatedIcon).toHaveAttribute('data-icon', 'book');
  });

  it('handles localStorage errors gracefully on load', () => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    render(<ReaderMode />);
    
    // Should default to not in reader mode
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Enter Reader Mode');
    expect(console.warn).toHaveBeenCalledWith('Failed to load reader mode preference:', expect.any(Error));
    
    Storage.prototype.getItem = originalGetItem;
  });

  it('handles localStorage errors gracefully on save', () => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    render(<ReaderMode />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(console.error).toHaveBeenCalledWith('Failed to apply reader mode:', expect.any(Error));
    
    Storage.prototype.setItem = originalSetItem;
  });

  it('applies correct CSS classes to document element', () => {
    render(<ReaderMode />);
    
    const button = screen.getByRole('button');
    
    // Enter reader mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('reader-mode-active')).toBe(true);
    
    // Exit reader mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('reader-mode-active')).toBe(false);
  });

  it('handles invalid localStorage values gracefully', () => {
    localStorage.setItem('docusaurus-reader-mode', 'invalid-value');
    
    render(<ReaderMode />);
    
    // Should default to false for invalid values
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Enter Reader Mode');
    expect(document.documentElement).not.toHaveClass('reader-mode-active');
  });
});