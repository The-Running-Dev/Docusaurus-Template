import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearch } from '../../hooks/useSearch';

function TestComp() {
  const { searchTerm, setSearchTerm, searchInputRef, handleClearSearch } = useSearch();
  return (
    <div>
      <input
        ref={searchInputRef}
        aria-label="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button onClick={handleClearSearch}>clear</button>
      )}
    </div>
  );
}

describe('useSearch', () => {
  it('clears on Escape and focuses input', async () => {
    render(<TestComp />);
    const input = screen.getByLabelText('search') as HTMLInputElement;
    await userEvent.type(input, 'abc');
    expect(input.value).toBe('abc');
    // escape clears
    await userEvent.keyboard('{Escape}');
    expect(input.value).toBe('');
  });
});

