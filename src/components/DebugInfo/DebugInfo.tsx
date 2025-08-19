import type { ReactNode } from 'react';

export interface DebugMetric {
  label: string;
  value: string | number;
  icon?: string;
}

export interface DebugInfoProps {
  loading?: boolean;
  error?: Error | null;
  meta?: {
    provider?: string;
    cached?: boolean;
    [key: string]: any;
  };
  metrics?: DebugMetric[];
}

export default function DebugInfo({
  loading,
  error,
  meta,
  metrics = []
}: DebugInfoProps): ReactNode {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const statusIcon = loading ? 'LOADING' : error ? 'ERROR' : 'LOADED';
  const providerInfo = meta?.provider || 'DEFAULT';
  const cacheStatus = meta?.cached ? '(CACHED)' : '';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000
      }}
    >
      🔧 Data: {statusIcon} | {providerInfo} {cacheStatus}
      {metrics.map((metric, index) => (
        <span key={index}>
          <br />
          {metric.icon ? `${metric.icon} ` : ''}
          {metric.label}: {metric.value}
        </span>
      ))}
    </div>
  );
}
