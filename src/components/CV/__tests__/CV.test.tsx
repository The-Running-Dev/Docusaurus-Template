import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock DataProvider to control render states
vi.mock('../../DataProvider/DataProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => children as any
}));

// Mock features so CV is enabled
vi.mock('../../config/FeaturesConfig', () => ({ Features: { CVPage: 0 } }));

// Use a dummy DebugInfo, Loading to simplify DOM
vi.mock('../../DebugInfo', () => ({ __esModule: true, default: () => <div data-testid="DebugInfo" /> }));
vi.mock('../../Loading', () => ({ __esModule: true, default: ({ message }: any) => <div>{message}</div> }));


function renderWithData(data: any, loading = false, error: Error | null = null) {
  // Re-mock DataProvider for each call
  (vi as any).doMock('../../DataProvider/DataProvider', () => ({
    __esModule: true,
    default: ({ children }: any) => (children as any)(data, loading, error, { source: 'test' })
  }));
}

describe('CV main component', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('shows loading state', async () => {
    renderWithData(null, true, null);
    const Mod = await import('../CV');
    render(<Mod.default />);
    expect(screen.getByText(/Loading CV/)).toBeInTheDocument();
  });

  it('shows error fallback', async () => {
    renderWithData(null, false, new Error('boom'));
    const Mod = await import('../CV');
    render(<Mod.default />);
    expect(screen.getByText(/Failed to Load CV Data/)).toBeInTheDocument();
  });

  it('guards against missing header', async () => {
    renderWithData({});
    const Mod = await import('../CV');
    render(<Mod.default />);
    expect(screen.getByText(/No CV Data Found/)).toBeInTheDocument();
  });

  it('renders header, about, badges, chips, timeline, education, quote and metrics', async () => {
    const data = {
      header: {
        title: 'My CV',
        email: 'me@example.com',
        phone: '555-1234',
        links: [{ label: 'GitHub', href: 'https://github.com/u' }]
      },
      about: { title: 'About Me', body: '<strong>Hello</strong>' },
      badges: [{ alt: 'A', src: '/a.png' }],
      chips: ['TS', 'React'],
      timelineTitle: 'Experience',
      roles: [
        { company: 'Co', title: 'Dev', period: '2020 - Present', summary: '<em>did things</em>' }
      ],
      educationTitle: 'Education',
      education: [{ degree: 'BSc CS', school: 'Uni', details: 'Summa' }],
      quote: '<i>Build things well.</i>'
    };
    renderWithData(data);
    const Mod = await import('../CV');
    render(<Mod.default />);

    // Header and basics
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My CV');
    expect(screen.getByRole('link', { name: 'me@example.com' })).toHaveAttribute('href', 'mailto:me@example.com');
    expect(screen.getByRole('link', { name: /GitHub/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();

    // Badges and chips
    expect(document.querySelectorAll('img[alt="A"]').length).toBe(1);
    expect(document.querySelectorAll('.cv-chip').length).toBe(2);
    // With badges present, chips block should have with-badges class
    expect(document.querySelectorAll('.cv-chips-with-badges').length).toBe(1);

    // Tech at a Glance header visible
    expect(screen.getByRole('heading', { name: /Tech at a Glance/ })).toBeInTheDocument();

    // Timeline
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByText('Co')).toBeInTheDocument();
    expect(screen.getByText('Dev')).toBeInTheDocument();
    expect(screen.getByText('did things')).toBeInTheDocument();

    // Education
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
    expect(screen.getByText(/BSc CS/)).toBeInTheDocument();

    // Quote
    expect(screen.getByText('Build things well.')).toBeInTheDocument();

    // DebugInfo placeholder present
    expect(screen.getByTestId('DebugInfo')).toBeInTheDocument();
  });

  it('renders chips-only class when only chips present', async () => {
    const data = {
      header: { title: 'My CV' },
      about: { title: 'About', body: 'Body' },
      chips: ['A', 'B'],
      timelineTitle: 'Exp',
      roles: []
    } as any;
    renderWithData(data);
    const Mod = await import('../CV');
    render(<Mod.default />);
    expect(document.querySelectorAll('.cv-chip').length).toBe(2);
    expect(document.querySelectorAll('.cv-chips-only').length).toBe(1);
  });

  it('header structure (links, email, phone)', async () => {
    const data = {
      header: {
        title: 'Snapshot CV',
        email: 'snap@example.com',
        phone: '123-4567',
        links: [
          { label: 'GitHub', href: 'https://github.com/u' },
          { label: 'LinkedIn', href: 'https://linkedin.com/in/u' }
        ]
      },
      about: { title: 'About', body: 'Body' },
      roles: [],
      education: []
    } as any;
    renderWithData(data);
    const Mod = await import('../CV');
    const { container } = render(<Mod.default />);
    // H1 title
    expect(screen.getByRole('heading', { level: 1, name: 'Snapshot CV' })).toBeInTheDocument();
    // Email link
    const email = screen.getByRole('link', { name: 'snap@example.com' }) as HTMLAnchorElement;
    expect(email).toHaveAttribute('href', 'mailto:snap@example.com');
    // Phone text
    expect(container.querySelector('.cv-row.cv-muted')?.textContent).toMatch(/123-4567/);
    // External links present
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/u');
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://linkedin.com/in/u');
  });

  it('DEFAULT_CV_DATA has minimal expected shape', async () => {
    const { DEFAULT_CV_DATA } = await import('../constants');
    expect(DEFAULT_CV_DATA).toBeTruthy();
    expect(typeof DEFAULT_CV_DATA).toBe('object');
    // Header with title
    expect(DEFAULT_CV_DATA.header).toBeTruthy();
    expect(typeof DEFAULT_CV_DATA.header.title).toBe('string');
    expect(DEFAULT_CV_DATA.header.title.length).toBeGreaterThan(0);
    // Timeline title and roles array
    expect(typeof DEFAULT_CV_DATA.timelineTitle).toBe('string');
    expect(Array.isArray(DEFAULT_CV_DATA.roles)).toBe(true);
  });
});
