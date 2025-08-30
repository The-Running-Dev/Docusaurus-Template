import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavBarLinks from '../NavBarLinks';

describe('NavBarLinks', () => {
  it('renders internal and external links with proper attributes', () => {
    window.history.replaceState({}, '', '/docs');
    const config = {
      showIcons: false,
      links: [
        { href: '/docs', label: 'Docs' },
        { href: 'https://example.com', label: 'External' }
      ]
    };

    render(<NavBarLinks config={config as any} enabled={true} />);
    const internal = screen.getByRole('link', { name: 'Docs' });
    expect(internal).toHaveAttribute('href', '/docs');
    // Active class on internal
    expect(internal.className).toMatch(/navbar-links__link/);
    expect(internal.className).toMatch(/active/);

    const external = screen.getByRole('link', { name: 'External' });
    expect(external).toHaveAttribute('href', 'https://example.com');
    expect(external).toHaveAttribute('target', '_blank');
  });

  it('renders dropdown with items', () => {
    const config = {
      dropdown: true,
      dropdownLabel: 'Menu',
      links: [
        { href: '/a', label: 'A' },
        { href: '/b', label: 'B' }
      ]
    };

    render(<NavBarLinks config={config as any} enabled={true} />);
    const toggle = screen.getByRole('button', { name: /Menu/i });
    expect(toggle).toHaveAttribute('aria-haspopup', 'true');
    // Items rendered in dropdown menu container
    const items = screen.getAllByRole('link');
    expect(items.length).toBeGreaterThan(0);
  });

  it('resolves icon when icon string provided', () => {
    const config = {
      showIcons: true,
      links: [
        { href: '/gh', label: 'GH', icon: 'faGithub' }
      ]
    };
    render(<NavBarLinks config={config as any} enabled={true} />);
    // Expect any FA icon element to be present
    const icons = document.querySelectorAll('.navbar-links__icon');
    expect(icons.length).toBeGreaterThan(0);
  });
});

