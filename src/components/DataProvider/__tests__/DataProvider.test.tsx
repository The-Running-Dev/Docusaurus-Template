import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Features } from '../../../config/FeaturesConfig';

// Mock dependencies
vi.mock('../../../config/FeaturesConfig', () => ({
  Features: {
    VersionDisplay: 'versionDisplay'
  },
  FeatureToConfigMap: {
    versionDisplay: 'versionDisplay'
  },
  useFeaturesConfig: vi.fn()
}));

vi.mock('../../../context/JsonDataProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="json-provider">{children}</div>
}));

vi.mock('../../../context/HttpDataProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="http-provider">{children}</div>
}));

vi.mock('../../../data', () => ({
  getData: vi.fn().mockReturnValue({})
}));

vi.mock('../../../context/DataProvider', () => ({
  useDataContext: vi.fn().mockReturnValue({
    data: { version: '1.0.0' },
    loadingState: { loading: false, error: null },
    meta: {}
  })
}));

vi.mock('../../../../data', () => ({
  globalConfig: {}
}));

import DataProvider from '../DataProvider';
import { useFeaturesConfig } from '../../../config/FeaturesConfig';

const mockUseFeaturesConfig = useFeaturesConfig as any;

describe('DataProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeaturesConfig.mockReturnValue({ versionDisplay: true });
  });

  it('renders children with static data when feature enabled and no config source', () => {
    const mockChildren = vi.fn().mockReturnValue(<div>Test Content</div>);
    const defaultData = { version: '1.0.0' };

    render(
      <DataProvider feature={Features.VersionDisplay} defaultData={defaultData}>
        {mockChildren}
      </DataProvider>
    );

    expect(mockChildren).toHaveBeenCalledWith(
      defaultData,
      false,
      null,
      expect.objectContaining({
        provider: 'JSON',
        source: 'static'
      })
    );
  });

  it('renders fallback when feature disabled', () => {
    mockUseFeaturesConfig.mockReturnValue({ versionDisplay: false });
    const fallback = <div data-testid="fallback">Feature Disabled</div>;
    const mockChildren = vi.fn();

    const { getByTestId } = render(
      <DataProvider 
        feature={Features.VersionDisplay} 
        defaultData={{ test: true }} 
        fallback={fallback}
      >
        {mockChildren}
      </DataProvider>
    );

    expect(getByTestId('fallback')).toBeInTheDocument();
    expect(mockChildren).not.toHaveBeenCalled();
  });

  it('renders children with null data when no defaultData provided (FeatureGuard mode)', () => {
    const mockChildren = vi.fn().mockReturnValue(<div>Guarded Content</div>);

    render(
      <DataProvider feature={Features.VersionDisplay}>
        {mockChildren}
      </DataProvider>
    );

    expect(mockChildren).toHaveBeenCalledWith(null, false, null, null);
  });

  it('renders children when no feature specified', () => {
    const mockChildren = vi.fn().mockReturnValue(<div>No Feature</div>);
    const defaultData = { test: true };

    render(
      <DataProvider defaultData={defaultData}>
        {mockChildren}
      </DataProvider>
    );

    expect(mockChildren).toHaveBeenCalledWith(
      defaultData,
      false,
      null,
      expect.objectContaining({
        provider: 'JSON',
        source: 'static'
      })
    );
  });

  it('applies processor to data when provided', () => {
    const mockChildren = vi.fn().mockReturnValue(<div>Processed Content</div>);
    const defaultData = { count: 5 };
    const processor = (data: any) => ({ ...data, doubled: data.count * 2 });

    render(
      <DataProvider defaultData={defaultData} processor={processor}>
        {mockChildren}
      </DataProvider>
    );

    expect(mockChildren).toHaveBeenCalledWith(
      { count: 5, doubled: 10 },
      false,
      null,
      expect.objectContaining({
        provider: 'JSON',
        source: 'static'
      })
    );
  });
});