import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useScrollRefs } from '../../hooks/useScrollRefs';

function TestComp() {
  const { filtersRef, projectsRef, scrollToProjects, scrollToFilters } = useScrollRefs();
  return (
    <div>
      <div ref={filtersRef} data-testid="filters" />
      <div ref={projectsRef} data-testid="projects" />
      <button onClick={scrollToProjects}>toProjects</button>
      <button onClick={scrollToFilters}>toFilters</button>
    </div>
  );
}

describe('useScrollRefs', () => {
  it('calls scroll APIs', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    // Ensure scrollIntoView exists and spy on it
    // @ts-ignore
    if (!HTMLElement.prototype.scrollIntoView) {
      // @ts-ignore
      HTMLElement.prototype.scrollIntoView = function () {};
    }
    const sivSpy = vi
      .spyOn(HTMLElement.prototype as any, 'scrollIntoView')
      .mockImplementation(() => {});

    const { getByText } = render(<TestComp />);
    getByText('toProjects').click();
    expect(scrollToSpy).toHaveBeenCalled();

    getByText('toFilters').click();
    expect(sivSpy).toHaveBeenCalled();
  });
});
