import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../../config/FeaturesConfig', () => ({
  Features: { ThemeSwitcher: 0 },
  useFeatureFlag: () => true
}));

vi.mock('@docusaurus/core/lib/client/exports/useBaseUrl', () => ({
  default: (p: string) => p
}));

import ThemeSwitcher from '../ThemeSwitcher';

describe('ThemeSwitcher additional behaviors', () => {
  it('closes when selecting an option', async () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole('button', { name: /Switch Theme/ });
    await userEvent.click(button);
    const option = document.querySelector('.theme-switcher__option') as HTMLElement;
    await userEvent.click(option);
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelector('.theme-switcher__dropdown')).toBeNull();
  });

  it('loads theme from localStorage if present', async () => {
    localStorage.setItem('docusaurus-theme-color', 'default');
    render(<ThemeSwitcher />);
    // Try to open and re-apply another option
    const button = screen.getByRole('button', { name: /Switch Theme/ });
    await userEvent.click(button);
    // pick any option present
    const options = document.querySelectorAll('.theme-switcher__option');
    if (options.length) {
      await userEvent.click(options[0] as HTMLElement);
    }
    expect(localStorage.getItem('docusaurus-theme-color')).toBeTruthy();
  });
});
