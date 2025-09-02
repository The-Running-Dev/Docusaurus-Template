import React from 'react';

export interface ActivityEvent {
  type: string;
  message: string;
  timestamp: number;
  user?: string;
}

export const ActivityLogPanel: React.FC<{ events: ActivityEvent[] }> = ({
  events
}) => (
  <div className="activity-log-panel">
    <h4>Activity Log</h4>
    <ul>
      {events.map((e, i) => (
        <li key={i}>
          <span className="activity-type">[{e.type}]</span> {e.message}
          <span className="activity-time">
            {new Date(e.timestamp).toLocaleTimeString()}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
