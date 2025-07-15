import React from 'react';
import type { Logger } from '../types';
import { LoggerRow } from './LoggerRow';

interface LoggerTableProps {
  loggers: Logger[];
  onLoggerClick: (logger: Logger) => void;
}

export const LoggerTable: React.FC<LoggerTableProps> = ({
  loggers,
  onLoggerClick,
}) => {
  return (
    <div className="employee-table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Logger ID</th>
            <th>Logger Type</th>
            <th>Logger Started</th>
            <th>Logger Ended</th>
            <th>Alarms</th>
            <th>Root Cause Analysis</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loggers.map((logger) => (
            <LoggerRow
              key={logger.loggerId}
              logger={logger}
              onLoggerClick={onLoggerClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
