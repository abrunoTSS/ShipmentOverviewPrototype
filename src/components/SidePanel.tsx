import React, { useState } from 'react';
import type { Logger, Shipment } from '../types';
import { cn } from '../utils/cn';
import './sidePanel.css';

interface SidePanelProps {
  logger: Logger | null;
  shipment?: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  logger,
  shipment,
  isOpen,
  onClose,
}) => {
  const [activeEventTab, setActiveEventTab] = useState(0);
  
  if (!isOpen || !logger) return null;

  // Handle both old timeline format and new events format
  const events = logger.enrichedEvent?.timeline || [];
  const eventsList = logger.enrichedEvent?.events || [];
  const hasEvents = eventsList.length > 0;
  const hasMultipleEvents = eventsList.length > 1;
  const isDelivered = shipment?.status === 'Delivered';
  
  // Use events structure if available, otherwise fall back to timeline
  const currentTimeline = hasEvents ? eventsList[activeEventTab]?.timeline || [] : events;

  const getDotClass = (dot: string) => {
    switch (dot) {
      case 'green':
        return 'milestone-dot completed';
      case 'red':
        return 'milestone-dot alert';
      case 'blue':
        return 'milestone-dot in-transit';
      case 'orange':
        return 'milestone-dot warning';
      default:
        return 'milestone-dot';
    }
  };



  return (
    <>
      <div className={cn('sidebar-overlay', isOpen && 'open')} onClick={onClose} />
      <div className={cn('logger-sidebar', isOpen && 'open')}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Logger Details</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sidebar-content">
          {/* Logger Info */}
          <div className="section">
            <div className="section-title">Logger Information</div>
            <div className="info-row">
              <span className="info-label">Logger ID</span>
              <span className="info-value">{logger.loggerId}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Logger Type</span>
              <span className="info-value">{logger.loggerType}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Started</span>
              <span className="info-value">
                {logger.loggerStarted
                  ? new Date(logger.loggerStarted).toLocaleDateString()
                  : 'Not started'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Alarms</span>
              <span className="info-value">{logger.alarms || 0}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Shipment Report</span>
              <span className="info-value">LINK TO SHIPMENT REPORT</span>
            </div>
            <div className="info-row">
              <span className="info-label">Start Delay</span>
              <span className="info-value">30 minutes</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="section">
            <div className="section-title">Product Details</div>
            <div className="info-row">
              <span className="info-label">Product ID</span>
              <span className="info-value">INSULIN123</span>
            </div>
            <div className="info-row">
              <span className="info-label">Product Type</span>
              <span className="info-value">Controlled Room Temperature</span>
            </div>
            <div className="info-row">
              <span className="info-label">Min Threshold</span>
              <span className="info-value">Single 15°C 1hr</span>
            </div>
            <div className="info-row">
              <span className="info-label">Max Threshold</span>
              <span className="info-value">Single 25°C 1hr</span>
            </div>
          </div>

          {/* Event Details - Milestone Timeline */}
          <div className="section">
            <div className="section-title">
              {isDelivered ? 'Excursion Details' : 'Transit Details'}
            </div>
            
            {/* Show event tabs only for delivered shipments with multiple events */}
            {isDelivered && hasMultipleEvents && (
              <div className="event-tabs">
                <div className="total-excursions">Total Excursion Events: {eventsList.length}</div>
                {eventsList.map((_, index) => (
                  <button
                    key={index}
                    className={`event-tab ${activeEventTab === index ? 'active' : ''}`}
                    onClick={() => setActiveEventTab(index)}
                  >
                    Event {index + 1}
                  </button>
                ))}
              </div>
            )}
            
            {/* Display current event alarm type for delivered shipments */}
            {isDelivered && hasEvents && (
              <div className="event-info">
                <div className="alarm-type">
                  Alarm Type: {eventsList[activeEventTab]?.alarmType || 'Unknown'}
                </div>
              </div>
            )}
            
            <div className="milestone-timeline">
              {/* Show alarm type again in the timeline section for delivered shipments */}
              {isDelivered && hasEvents && (
                <div className="event-info">
                  <div className="alarm-type">Alarm Type: {eventsList[activeEventTab]?.alarmType}</div>
                </div>
              )}
              
              {currentTimeline.map((event, index) => (
                <div key={index} className="milestone-item">
                  <div className="milestone-content">
                    <div className="milestone-header">
                      <div className={getDotClass(event.dot)}></div>
                      <div className="milestone-info">
                        <div className="milestone-title">{event.title}</div>
                        <div className="milestone-subtitle">{event.subtitle}</div>
                        <div className="milestone-time">{event.extraInfo.time}</div>
                        {event.status && (
                          <div className={`milestone-status ${event.status.toLowerCase().replace(' ', '-')}`}>
                            {event.status}
                          </div>
                        )}
                        {/* Transport and weather info */}
                        {event.transportMode && (
                          <div className="transport-info">
                            <div>Transport Mode: {event.transportMode}</div>
                            {event.vehicleNumber && <div>Vehicle Number: {event.vehicleNumber}</div>}
                            {event.weatherConditions && <div>Weather Conditions: {event.weatherConditions}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced excursion details for delivered shipments */}
                    {event.excursionDetails && isDelivered && (
                      <div className="excursion-details">
                        <div className="excursion-title">Excursion Details</div>
                        <div className="excursion-grid">
                          {event.excursionDetails.highest && (
                            <div className="excursion-item">
                              <span className="excursion-label">Highest:</span>
                              <span className="excursion-value">{event.excursionDetails.highest}</span>
                            </div>
                          )}
                          {event.excursionDetails.lowest && (
                            <div className="excursion-item">
                              <span className="excursion-label">Lowest:</span>
                              <span className="excursion-value">{event.excursionDetails.lowest}</span>
                            </div>
                          )}
                          {event.excursionDetails.average && (
                            <div className="excursion-item">
                              <span className="excursion-label">Average:</span>
                              <span className="excursion-value">{event.excursionDetails.average}</span>
                            </div>
                          )}
                          {event.excursionDetails.duration && (
                            <div className="excursion-item">
                              <span className="excursion-label">Duration:</span>
                              <span className="excursion-value">{event.excursionDetails.duration}</span>
                            </div>
                          )}
                          {event.excursionDetails.startTime && (
                            <div className="excursion-item">
                              <span className="excursion-label">Start Time:</span>
                              <span className="excursion-value">{event.excursionDetails.startTime}</span>
                            </div>
                          )}
                          <div className="excursion-item">
                            <span className="excursion-label">Duration:</span>
                            <span className="excursion-value">{event.excursionDetails.duration}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {index < currentTimeline.length - 1 && <div className="milestone-line"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Chart - Only show for delivered shipments */}
          {isDelivered && (
            <div className="section">
              <div className="chart-section">
                <div className="chart-header">
                  <div className="chart-title">Temperature</div>
                  <div className="chart-controls">
                    <button className="chart-button">30M</button>
                    <button className="chart-button">1H</button>
                    <button className="chart-button">6H</button>
                    <button className="chart-button">1D</button>
                  </div>
                </div>
                <div className="chart-area">
                  <div className="chart-placeholder"></div>
                </div>
              </div>
            </div>
          )}

          {/* Root Cause */}
          <div className="section">
            <div className="root-cause-section">
              <div className="root-cause-title">Root Cause Analysis</div>
              {logger.loggerType === 'web logger 2' && shipment?.status === 'In Transit' ? (
                <div className="status-text">N/A - Root cause analysis not available for web logger 2 during transit</div>
              ) : logger.rootCauseAnalysisStatusDetails ? (
                <>
                  <div className="status-text">
                    <span
                      className={`status-indicator ${
                        logger.alarms && logger.alarms > 0 ? 'status-red' : 'status-green'
                      }`}
                    ></span>
                    Status: {logger.rootCauseAnalysisStatusDetails.status || 'No issues detected'}
                  </div>
                  <div className="root-cause-details">
                    <div className="info-row">
                      <span className="info-label">Details:</span>
                      <span className="info-value">{logger.rootCauseAnalysisStatusDetails.details}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Started:</span>
                      <span className="info-value">
                        {new Date(logger.rootCauseAnalysisStatusDetails.UTCDateStarted).toLocaleString()}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Evaluated By:</span>
                      <span className="info-value">{logger.rootCauseAnalysisStatusDetails.evaluatedBy}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Type:</span>
                      <span className="info-value">{logger.rootCauseAnalysisStatusDetails.type}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Evaluation Type:</span>
                      <span className="info-value">{logger.rootCauseAnalysisStatusDetails.evaluationType}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Primary Cause:</span>
                      <span className="info-value">{logger.rootCauseAnalysisStatusDetails.primaryRootCause}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Secondary Cause:</span>
                      <span className="info-value">{logger.rootCauseAnalysisStatusDetails.secondaryRootCause}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Reason:</span>
                      <span className="info-value">{logger.rootCauseAnalysisStatusDetails.reason}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="status-text">No root cause analysis available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
