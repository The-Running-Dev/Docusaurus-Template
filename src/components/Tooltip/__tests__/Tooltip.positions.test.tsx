import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Tooltip from '../Tooltip';

describe('Tooltip positions', () => {
  it('respects explicit positions', async () => {
    const { container: c1 } = render(<Tooltip title="T" items={['A']} position="top"><span>X</span></Tooltip>);
    c1.querySelector('.tooltip-wrapper')?.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(c1.querySelector('.tooltip--top')).toBeTruthy();
    const { container: c2 } = render(<Tooltip title="T" items={['A']} position="left"><span>X</span></Tooltip>);
    c2.querySelector('.tooltip-wrapper')?.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(c2.querySelector('.tooltip--left')).toBeTruthy();
    const { container: c3 } = render(<Tooltip title="T" items={['A']} position="right"><span>X</span></Tooltip>);
    c3.querySelector('.tooltip-wrapper')?.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(c3.querySelector('.tooltip--right')).toBeTruthy();
  });
});
