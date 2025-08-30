import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateFilters } from '../../components/DateFilters';

describe('DateFilters', () => {
  const dateOptions = [
    { key: 'most-recent', label: 'Most Recent (1)' },
    { key: 'all-dates', label: 'All Time (2)' }
  ];

  it('fires onDateChange when not searching', async () => {
    const onChange = vi.fn();
    render(
      <DateFilters
        dateOptions={dateOptions}
        selectedDateRange={'most-recent'}
        onDateChange={onChange}
        searchTerm={''}
      />
    );
    const first = screen.getByRole('button', { name: /Most Recent/ });
    const user = userEvent.setup();
    await user.click(first);
    expect(onChange).toHaveBeenCalledWith('most-recent');
  });

  it('disables buttons when searching', () => {
    const onChange = vi.fn();
    render(
      <DateFilters
        dateOptions={dateOptions}
        selectedDateRange={'most-recent'}
        onDateChange={onChange}
        searchTerm={'react'}
      />
    );
    const buttons = screen.getAllByRole('button') as HTMLButtonElement[];
    expect(buttons.every((b) => b.disabled)).toBe(true);
    // Clicks should not call handler when disabled
    userEvent.click(buttons[0]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
