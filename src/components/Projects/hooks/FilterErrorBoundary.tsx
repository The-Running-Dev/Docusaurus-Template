import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for filter-related operations
 * Provides graceful fallback when filter state management fails
 */
export class FilterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Filter Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="filter-error-boundary">
            <p className="portfolio-muted" style={{ color: '#d32f2f' }}>
              ⚠️ Filter Error
            </p>
            <p
              style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}
            >
              Filter functionality temporarily unavailable. Please refresh the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
