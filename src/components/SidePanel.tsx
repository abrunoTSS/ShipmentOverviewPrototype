import React from 'react';
import { Activity, AlertTriangle, CheckCircle, MapPin, Truck, Package } from 'lucide-react';
import type { Logger, Shipment } from '../types';
import { cn } from '../utils/cn';

interface SidePanelProps {
  logger: Logger | null;
  shipment?: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  logger,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !logger) return null;

  const loggerTypeInitials = logger.loggerType
    .split(' ')
    .map((n: string) => n[0])
    .join('');

  return (
    <div className={cn("side-panel-overlay", isOpen && "open")}>
      {/* Backdrop */}
      <div 
        className="backdrop"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={cn("side-panel", isOpen && "open")}>
        <div className="panel-content">
          {/* Header */}
          <div className="panel-header">
            <div className="header-content">
              <h2>Logger Details</h2>
              <button
                onClick={onClose}
                className="close-button"
              >
                <span>&times;</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="panel-body">
            <div className="content-sections">
              {/* Profile Section */}
              <div className="profile-section">
                <div className="profile-content">
                  <div className="avatar">
                    <span className="initials">
                      {loggerTypeInitials}
                    </span>
                  </div>
                  <h3 className="employee-name">{logger.loggerId}</h3>
                  <p className="employee-title">{logger.loggerType}</p>
                </div>
              </div>

              {/* Details */}
              <div className="details-section">
                <div className="detail-item">
                  <div className="detail-content">
                    <div className="detail-icon department">
                      <Activity />
                    </div>
                    <div className="detail-info">
                      <p className="detail-label">Started</p>
                      <p className="detail-value">{logger.loggerStarted ? new Date(logger.loggerStarted).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-content">
                    <div className="detail-icon email">
                      {logger.alarms && logger.alarms > 0 ? <AlertTriangle /> : <CheckCircle />}
                    </div>
                    <div className="detail-info">
                      <p className="detail-label">Alarms</p>
                      <p className="detail-value">{logger.alarms || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-content">
                    <div className="detail-icon phone">
                      <Activity />
                    </div>
                    <div className="detail-info">
                      <p className="detail-label">Root Cause Analysis</p>
                      <p className="detail-value">{logger.rootCauseAnalysis || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
