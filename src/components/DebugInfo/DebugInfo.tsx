import type { ReactNode } from 'react';

export interface DebugInfoProps {
  loading?: boolean;
  error?: Error | null;
  meta?: {
    provider?: string;
    cached?: boolean;
    [key: string]: any;
  };
  data?: {
    technologies?: any[];
    projects?: any[];
    stats?: any[];
    [key: string]: any;
  };
  customMetrics?: Array<{
    label: string;
    value: string | number;
    icon?: string;
  }>;
}

export default function DebugInfo({
  loading,
  error,
  meta,
  data,
  customMetrics
}: DebugInfoProps): ReactNode {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

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
      🔧 Data: {loading ? 'LOADING' : error ? 'ERROR' : meta?.provider || 'LOADED'} {meta?.cached ? '(CACHED)' : ''}
      {data?.technologies && (
        <>
          <br />
          📊 Technologies: {data.technologies.length || 0}
        </>
      )}
      {data?.projects && (
        <>
          <br />
          📦 Projects: {data.projects.length || 0}
        </>
      )}
      {data?.stats && (
        <>
          <br />
          📈 Stats: {data.stats.length || 0}
        </>
      )}
      {customMetrics?.map((metric, index) => (
        <span key={index}>
          <br />
          {metric.icon || '📊'} {metric.label}: {metric.value}
        </span>
      ))}
    </div>
  );
}