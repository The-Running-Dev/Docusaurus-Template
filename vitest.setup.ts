import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Provide window.scrollTo to avoid JSDOM errors
// @ts-ignore
if (!window.scrollTo) window.scrollTo = vi.fn();

// Provide requestAnimationFrame/cancelAnimationFrame for components that use them
// @ts-ignore
if (!window.requestAnimationFrame) {
  // @ts-ignore
  window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0) as unknown as number;
}
// @ts-ignore
if (!window.cancelAnimationFrame) {
  // @ts-ignore
  window.cancelAnimationFrame = (id: number) => clearTimeout(id as unknown as number);
}

// Mock Docusaurus theme Heading used by ProjectHeader
vi.mock('@theme/Heading', () => ({
  default: (props: any) => {
    const { as: Tag = 'h1', children, ...rest } = props || {};
    return React.createElement(Tag, rest, children);
  }
}));

// Silence CSS imports if any loader tries to process them
vi.mock('*.css', () => ({}));

// Mock Docusaurus Link to a basic anchor
vi.mock('@docusaurus/Link', () => ({
  default: ({ to, children, ...rest }: any) => (
    React.createElement('a', { href: to, ...rest }, children)
  )
}));
