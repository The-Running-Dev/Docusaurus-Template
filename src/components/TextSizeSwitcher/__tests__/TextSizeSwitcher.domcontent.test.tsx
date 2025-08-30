import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TextSizeSwitcher from '../TextSizeSwitcher';

// Enable feature
vi.mock('../../../config/FeaturesConfig', () => ({
  Features: { TextSizeSwitcher: 0 },
  useFeatureFlag: () => true
}));

describe('TextSizeSwitcher DOMContentLoaded branch', () => {
  it('applies default size when invalid saved value', async () => {
    // Simulate document loading state
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });
    localStorage.setItem('docusaurus-text-size', 'invalid');
    const { unmount } = render(<TextSizeSwitcher />);
    document.dispatchEvent(new Event('DOMContentLoaded'));
    // class should be applied eventually
    const hasClass = Array.from(document.documentElement.classList).some((c) => c.startsWith('text-size-'));
    expect(hasClass).toBe(true);
    unmount();
  });
});

