import '@testing-library/jest-dom';
import React from 'react';
import { vi, beforeEach } from 'vitest';

// Configure React Testing Library to use React's act() properly
import { configure } from '@testing-library/react';
import { act } from 'react';

// Add act to global scope for Vitest
// @ts-ignore
global.act = act;

// Suppress act warnings in test environment
const originalError = console.error;
beforeEach(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('The current testing environment is not configured to support act(...)')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

configure({ 
  testIdAttribute: 'data-testid',
  // Configure automatic cleanup and act wrapping
  reactStrictMode: true
});

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

// Provide common web APIs not present in JSDOM
// fetch
// @ts-ignore
if (!globalThis.fetch) globalThis.fetch = vi.fn();
// window.open
// @ts-ignore
if (!window.open) window.open = vi.fn();
// window.confirm
// Default to true in test environment unless overridden in specific tests
// @ts-ignore
if (!window.confirm) window.confirm = vi.fn(() => true);
// clipboard
// @ts-ignore
if (!navigator.clipboard) navigator.clipboard = { writeText: vi.fn() } as any;
// File.prototype.text polyfill for older environments
try {
  // @ts-ignore
  if (typeof File !== 'undefined' && File.prototype && typeof File.prototype.text !== 'function') {
    // @ts-ignore
    File.prototype.text = function(this: Blob) { return Promise.resolve(''); };
  }
} catch {}
// createObjectURL
// @ts-ignore
if (!URL.createObjectURL) URL.createObjectURL = vi.fn(() => 'blob://test');
// revokeObjectURL
// @ts-ignore
if (!URL.revokeObjectURL) URL.revokeObjectURL = vi.fn();

// matchMedia stub
// @ts-ignore
if (!window.matchMedia) {
  // @ts-ignore
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
}

// Clear storage between tests to avoid state bleed
beforeEach(() => {
  try { localStorage.clear(); } catch {}
  // Reset jest-dom timers to real timers to avoid waitFor flakiness if altered elsewhere
  // @ts-ignore
  if ((vi as any).useRealTimers) {
    // @ts-ignore
    (vi as any).useRealTimers();
  }
});
