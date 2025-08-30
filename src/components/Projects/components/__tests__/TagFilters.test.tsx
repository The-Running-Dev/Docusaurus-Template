import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TagFilters from '../../components/TagFilters';

describe('TagFilters', () => {
  const tiers = {
    popular: [
      { key: 'tag-react', label: 'React (3)', category: 'tag', count: 3 }
    ],
    common: [
      { key: 'tag-ui', label: 'UI (2)', category: 'tag', count: 2 }
    ],
    rare: [
      { key: 'tag-graphql', label: 'GraphQL (1)', category: 'tag', count: 1 }
    ],
    allTagsOption: { key: 'all-tags', label: 'All (3)', category: 'tag', count: 3 }
  } as any;

  it('renders popular and All Tags, and toggles common/rare', () => {
    render(
      <TagFilters tagTiers={tiers} activeTag={undefined} onTagChange={() => {}} />
    );
    expect(screen.getByRole('button', { name: 'All (3)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'React (3)' })).toBeInTheDocument();
    // Initially collapsed common/rare shows a "+ N more" button
    expect(screen.getByText(/more common tags/)).toBeInTheDocument();
    expect(screen.getByText(/less common tags/)).toBeInTheDocument();
  });

  it('auto-expands section containing active tag', () => {
    render(
      <TagFilters tagTiers={tiers} activeTag={'tag-ui'} onTagChange={() => {}} />
    );
    // Common section should be expanded: we expect UI (2) button visible and no "+ N more common" message
    expect(screen.getByRole('button', { name: 'UI (2)' })).toBeInTheDocument();
    // The hide button should be visible instead of the show more
    expect(screen.getByText(/Hide common tags/)).toBeInTheDocument();
  });
});
