import React from 'react';
import { ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Logger } from '../types';

interface LoggerRowProps {
  logger: Logger;
  onLoggerClick: (logger: Logger) => void;
}

export const LoggerRow: React.FC<LoggerRowProps> = ({
  logger,
  onLoggerClick,
}) => {
  return (
    <tr
      onClick={() => onLoggerClick(logger)}
    >
      <td>
        <span className="employee-name">{logger.loggerId}</span>
      </td>
      <td>
        <span className="employee-role">{logger.loggerType}</span>
      </td>
      <td>
        <span className="department-badge">
          {logger.loggerStarted ? new Date(logger.loggerStarted).toLocaleDateString() : 'N/A'}
        </span>
      </td>
      <td>
        <span className="department-badge">
          {logger.loggerEnded ? new Date(logger.loggerEnded).toLocaleDateString() : 'Active'}
        </span>
      </td>
      <td>
        <div className="contact-info">
          {logger.alarms && logger.alarms > 0 ? (
            <>
              <AlertTriangle className="contact-icon alarm" />
              <span>{logger.alarms}</span>
            </>
          ) : (
            <>
              <CheckCircle className="contact-icon no-alarm" />
              <span>0</span>
            </>
          )}
        </div>
      </td>
      <td>
        <span className="root-cause">{logger.rootCauseAnalysis}</span>
      </td>
      <td>
        <ChevronRight className="arrow-icon" />
      </td>
    </tr>
  );
};
