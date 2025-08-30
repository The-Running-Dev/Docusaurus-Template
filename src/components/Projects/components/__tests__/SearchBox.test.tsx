import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBox } from '../../components/SearchBox';

describe('SearchBox', () => {
  it('renders input and clear button behavior', async () => {
    const setSearchTerm = vi.fn();
    const handleClearSearch = vi.fn();
    const ref: any = { current: null };

    render(
      <SearchBox
        searchTerm={'abc'}
        setSearchTerm={setSearchTerm}
        searchInputRef={ref}
        handleClearSearch={handleClearSearch}
      />
    );

    const input = screen.getByPlaceholderText('Search projects...');
    await userEvent.type(input, 'x');
    expect(setSearchTerm).toHaveBeenCalled();

    const clearBtn = screen.getByRole('button', { name: /Clear search/ });
    await userEvent.click(clearBtn);
    expect(handleClearSearch).toHaveBeenCalled();
  });
});

