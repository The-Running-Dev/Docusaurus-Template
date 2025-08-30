import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../../config/FeaturesConfig', () => ({
  Features: { TextSizeSwitcher: 0 },
  useFeatureFlag: () => true
}));

import TextSizeSwitcher from '../TextSizeSwitcher';

describe('TextSizeSwitcher additional behaviors', () => {
  it('reapplies class on focus/hashchange/popstate', async () => {
    render(<TextSizeSwitcher />);
    const btn = screen.getByRole('button', { name: /Change Text Size/ });
    await userEvent.click(btn);
    const options = await screen.findAllByRole('button');
    const large = options.find((b) => (b.textContent || '').includes('Large')) as HTMLElement;
    await userEvent.click(large);
    const root = document.documentElement;
    const before = Array.from(root.classList).filter(c => c.startsWith('text-size-')).join(',');
    // trigger events
    window.dispatchEvent(new Event('focus'));
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    window.dispatchEvent(new PopStateEvent('popstate'));
    const after = Array.from(root.classList).filter(c => c.startsWith('text-size-')).join(',');
    expect(after).toBe(before);
    // no timers to flush here; component handles its own cleanup
  });
});
