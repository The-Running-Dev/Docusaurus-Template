import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Enable FeatureComponent
vi.mock('../../../config/FeaturesConfig', () => ({
  Features: { TextSizeSwitcher: 0 },
  useFeatureFlag: () => true
}));

import TextSizeSwitcher from '../TextSizeSwitcher';

describe('TextSizeSwitcher', () => {
  it('opens dropdown and applies a text size', async () => {
    const { unmount } = render(<TextSizeSwitcher />);
    const button = screen.getByRole('button', { name: /Change Text Size/ });
    await userEvent.click(button);
    const options = await screen.findAllByRole('button');
    const choice = options.find((b) => (b.textContent || '').trim().endsWith('Large'))!;
    await userEvent.click(choice);

    // Class applied on html element
    const root = document.documentElement;
    const hasClass = Array.from(root.classList).some((c) => c.startsWith('text-size-'));
    expect(hasClass).toBe(true);
    // Preference saved
    expect(localStorage.getItem('docusaurus-text-size')).toBeTruthy();
    unmount();
  });
});
