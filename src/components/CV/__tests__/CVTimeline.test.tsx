import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock FontAwesome to avoid bringing real icons
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props: any) => <span data-testid="icon" data-icon={String(props.icon?.iconName || 'briefcase')}></span>
}));

import Timeline from '../CVTimeline';

describe('CVTimeline', () => {
  it('sorts roles by most recent end date and formats years', () => {
    const roles = [
      { company: 'OldCo', title: 'Jr Dev', period: '2015' },
      { company: 'MidCo', title: 'Dev', period: '2019 - 2022', icon: 'faHammer' },
      {
        company: 'NewCo',
        title: 'Sr Dev',
        period: '2022 - Present',
        icon: 'faRocket',
        summary: '<b>Lead</b>',
        achievements: ['<i>Award</i>'],
        location: 'New York',
        website: 'https://new.co'
      }
    ] as any;

    render(<Timeline title="Experience" roles={roles} />);

    // Order: NewCo (present), MidCo (2019-2022), OldCo (2015)
    const companies = Array.from(document.querySelectorAll('.timeline-content h3')).map((n) => n.textContent);
    expect(companies).toEqual(['NewCo', 'MidCo', 'OldCo']);

    // Year display for 2015 should be '2015'
    expect(document.querySelectorAll('.timeline-year')[2].textContent).toBe('2015');

    // Summary and achievements render HTML
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByText('Award')).toBeInTheDocument();

    // Location and website link
    expect(screen.getByText(/New York/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Visit Site/ })).toHaveAttribute('href', 'https://new.co');

    // Icons: unknown defaults to briefcase per mock attr, provided icon names map through prop (we can only assert elements exist)
    expect(screen.getAllByTestId('icon').length).toBeGreaterThanOrEqual(3);
  });

  it('handles malformed periods and unknown icons by falling back safely', () => {
    const roles = [
      { company: 'WeirdCo', title: 'Mystery', period: 'N/A', icon: 'faUnknown' },
      { company: 'YearOnly', title: 'One-Off', period: '2010' }
    ] as any;

    render(<Timeline title="Experience" roles={roles} />);

    // Should render two items without crashing
    const companies = Array.from(document.querySelectorAll('.timeline-content h3')).map((n) => n.textContent);
    expect(companies).toEqual(['YearOnly', 'WeirdCo']);

    // Years include '0' (malformed) and '2010' (single-year)
    const years = Array.from(document.querySelectorAll('.timeline-year')).map((n) => n.textContent);
    expect(years).toContain('0');
    expect(years).toContain('2010');

    // Unknown icon falls back to briefcase in our mock
    const [firstIcon] = Array.from(document.querySelectorAll('[data-testid="icon"]')) as HTMLElement[];
    expect(firstIcon).toBeTruthy();
  });
});
