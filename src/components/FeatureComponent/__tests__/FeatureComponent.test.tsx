import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../../config/FeaturesConfig', () => ({
  Features: { Foo: 0 },
  useFeatureFlag: (f: any) => f === 0
}));

import FeatureComponent from '../FeatureComponent';

describe('FeatureComponent', () => {
  it('renders children when feature enabled', () => {
    render(
      <FeatureComponent feature={0 as any} configData={{ msg: 'hi' }}>
        {(data: any) => <div>{data.msg}</div>}
      </FeatureComponent>
    );
    expect(screen.getByText('hi')).toBeInTheDocument();
  });

  it('returns null when feature disabled', () => {
    // useFeatureFlag returns false for non-zero in our mock
    const { container } = render(
      <FeatureComponent feature={1 as any} configData={{}}>
        {() => <div>secret</div>}
      </FeatureComponent>
    );
    expect(container.firstChild).toBeNull();
  });
});

