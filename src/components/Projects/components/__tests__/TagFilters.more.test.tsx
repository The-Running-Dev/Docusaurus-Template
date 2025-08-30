import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagFilters from '../../components/TagFilters';

const tiers = {
  popular: [{ key: 'tag-react', label: 'React (3)', category: 'tag', count: 3 }],
  common: [{ key: 'tag-ui', label: 'UI (2)', category: 'tag', count: 2 }],
  rare: [{ key: 'tag-graphql', label: 'GraphQL (1)', category: 'tag', count: 1 }],
  allTagsOption: { key: 'all-tags', label: 'All (3)', category: 'tag', count: 3 }
} as any;

describe('TagFilters (expanded interactions)', () => {
  it('toggles common/rare sections', async () => {
    render(<TagFilters tagTiers={tiers} activeTag={undefined} onTagChange={() => {}} />);
    // Show more buttons
    const moreCommon = screen.getByText(/more common tags/);
    expect(moreCommon).toBeInTheDocument();
    // Click to expand
    await userEvent.click(moreCommon as HTMLButtonElement);
    // Now the common section should be expanded
    expect(screen.getByText('UI (2)')).toBeInTheDocument();
    // Collapse back
    await userEvent.click(screen.getByText(/Hide common tags/));
    expect(screen.getByText(/more common tags/)).toBeInTheDocument();
  });
});
