import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Shipment, Logger, ExcursionMilestone } from '../types';
import ExcursionGraph from './ExcursionGraph';
import './loggerDashboard.css';

interface LoggerDashboardProps {
  shipment: Shipment | null;
  logger: Logger | null;
  isOpen: boolean;
  onClose: () => void;
}

const LoggerDashboard: React.FC<LoggerDashboardProps> = ({ shipment, logger, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!isOpen || !shipment || !logger) {
    return null;
  }

  // Render excursion milestone for alarm events
  const renderMilestone = (milestone: ExcursionMilestone, index: number) => (
    <div className="milestone-item" key={index}>
      <div className={`milestone-dot ${milestone.status.toLowerCase()}`} />
      <div className="milestone-content">
        <p className="milestone-location">{milestone.location}</p>
        <div className="milestone-extra-details">
          <p><strong>Arrival Time:</strong> {milestone.arrivalTime ? new Date(milestone.arrivalTime).toLocaleString() : 'N/A'}</p>
          {milestone.departedTime && (
            <p><strong>Departed Time:</strong> {milestone.departedTime ? new Date(milestone.departedTime).toLocaleString() : 'N/A'}</p>
          )}
          <p><strong>Status:</strong> {milestone.status}</p>
          <p><strong>Transport:</strong> {milestone.transportMode} ({milestone.vehicleNumber})</p>
          <p><strong>Weather:</strong> {milestone.weatherConditions}</p>
        </div>
        {milestone.excursion && (
          <div className="excursion-details">
            <p><strong>Temperature Event:</strong></p>
            <p>Highest: {milestone.excursion.highest}</p>
            <p>Lowest: {milestone.excursion.lowest}</p>
            <p>Average: {milestone.excursion.average}</p>
            <p>Duration: {milestone.excursion.duration}</p>
            {['Sentry', 'Sentinel'].includes(logger.loggerType) && milestone.excursion.highestHumidity && (
              <div className="humidity-excursion-details">
                <p className="excursion-subtitle"><strong>Humidity Event:</strong></p>
                <p>Highest: {milestone.excursion.highestHumidity}</p>
                <p>Lowest: {milestone.excursion.lowestHumidity}</p>
                <p>Average: {milestone.excursion.averageHumidity}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`logger-dashboard ${isOpen ? 'open' : ''}`}>
        <div className="dashboard-header">
          <h2 className="dashboard-title">Logger Dashboard</h2>
          <button onClick={onClose} className="close-button"><X size={24} /></button>
        </div>
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h3 className="section-title">Shipment Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Shipment ID</span>
                <span className="info-value">{shipment.shipmentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Origin</span>
                <span className="info-value">{shipment.origin}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Destination</span>
                <span className="info-value">{shipment.destination}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">{shipment.status}</span>
              </div>
            </div>
            
            {/* Shipment Current Milestone Timeline - Only for In Transit shipments */}
            {shipment.status === 'In Transit' && (
              <div className="shipment-milestone-container">
                <h4 className="milestone-subtitle">Current Lane</h4>
                {shipment.shipmentCurrentMilestone && shipment.shipmentCurrentMilestone.length > 0 ? (
                  <div className="milestone-timeline">
                    {shipment.shipmentCurrentMilestone.map((milestone, index) => (
                      <div className="milestone-item" key={index}>
                        <div className={`milestone-dot ${milestone.status === 'Current' ? 'completed' : 
                                                         milestone.status === 'Completed' ? 'pending' : 'pending'}`} />
                        <div className="milestone-content">
                          <p className="milestone-location">{milestone.location}</p>
                          <div className="milestone-status-badge">
                            <span className={`status-indicator ${milestone.status.toLowerCase()}`}>{milestone.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="milestone-error">
                    <p className="error-message">Unable to get milestone data. Please check if the shipment number is correct and correct it if possible.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <h3 className="section-title">Logger Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Logger ID</span>
                <span className="info-value">{logger.loggerId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Logger Type</span>
                <span className="info-value">{logger.loggerType}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Calibration Date</span>
                <span className="info-value">{logger.calibrationDate || '2025-05-06 07:00'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Expiry Date</span>
                <span className="info-value">{logger.expiryDate || '2028-05-06 07:00'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sample Rate</span>
                <span className="info-value">{logger.sampleRate || '10 minute'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Start Delay</span>
                <span className="info-value">{logger.startDelay || '0 minute'}</span>
              </div>
              {logger.temperature && logger.temperature !== 'N/A' && (
                <div className="info-item">
                  <span className="info-label">Temperature</span>
                  <span className="info-value">{logger.temperature}</span>
                </div>
              )}
              {logger.humidity && logger.humidity !== 'N/A' && (
                <div className="info-item">
                  <span className="info-label">Humidity</span>
                  <span className="info-value">{logger.humidity}</span>
                </div>
              )}
              {logger.lastSeen && (
                <div className="info-item">
                  <span className="info-label">Last Seen</span>
                  <span className="info-value">
                    {(() => {
                      try {
                        const date = new Date(logger.lastSeen);
                        return date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'N/A';
                      } catch {
                        return 'N/A';
                      }
                    })()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {logger.productDetails && (
            <>
              <div className="dashboard-section">
                <h3 className="section-title">Product Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Product Name</span>
                    <span className="info-value">{logger.productDetails.prodfilename}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Product Type</span>
                    <span className="info-value">{logger.productDetails.producttype}</span>
                  </div>
                </div>
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Temperature Profile</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">High Threshold</span>
                    <span className="info-value">{logger.productDetails.highThreshold}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Low Threshold</span>
                    <span className="info-value">{logger.productDetails.lowThreshold}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {logger.productDetails && ['Sentry', 'Sentinel'].includes(logger.loggerType) && (
            <div className="dashboard-section">
              <h3 className="section-title">Humidity Profile</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">High Threshold</span>
                  <span className="info-value">{logger.productDetails.highHumidityThreshold}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Low Threshold</span>
                  <span className="info-value">{logger.productDetails.lowHumidityThreshold}</span>
                </div>
              </div>
            </div>
          )}

          {Array.isArray(logger.alarms) && logger.alarms.length > 0 && (
            <div className="dashboard-section">
              <h3 className="section-title">Alarms</h3>
              <div className="tabs">
                {logger.alarms.map((alarm, index) => (
                  <button 
                    key={alarm.alarmId}
                    className={`tab-button ${activeTab === index ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    {`Alarm ${index + 1}: ${alarm.alarmType}`}
                  </button>
                ))}
              </div>

              <div className="milestone-timeline">
                {logger.alarms[activeTab]?.excursionMilestones.map(renderMilestone)}
                
                {/* Display graph for excursions with graph data */}
                {logger.alarms[activeTab]?.excursionMilestones.some(milestone => 
                  milestone.excursion?.graphData && milestone.excursion.graphData.length > 0
                ) && (
                  <div className="excursion-graph-section">
                    <ExcursionGraph 
                      data={logger.alarms[activeTab]?.excursionMilestones
                        .find(milestone => milestone.excursion?.graphData)?.excursion?.graphData || []}
                      logger={logger}
                      shipment={shipment}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {logger.rootCauseAnalysisStatusDetails && (
            <div className="dashboard-section">
              <h3 className="section-title">Root Cause Analysis</h3>
              <div className="rca-status">
                <span className={`status-dot ${logger.rootCauseAnalysisStatusDetails.status.toLowerCase().replace(/\s+/g, '-')}`}></span>
                <span>{logger.rootCauseAnalysisStatusDetails.status}</span>
              </div>
              
              <div className="rca-details">
                {/* RCA fields from the type definition */}
                {logger.rootCauseAnalysisStatusDetails.details && (
                  <div className="info-item full-width">
                    <span className="info-label">Details</span>
                    <span className="info-value">{logger.rootCauseAnalysisStatusDetails.details}</span>
                  </div>
                )}
                {logger.rootCauseAnalysisStatusDetails.UTCDateStarted && (
                  <div className="info-item">
                    <span className="info-label">Date Started</span>
                    <span className="info-value">{logger.rootCauseAnalysisStatusDetails.UTCDateStarted}</span>
                  </div>
                )}
                {logger.rootCauseAnalysisStatusDetails.evaluatedBy && (
                  <div className="info-item">
                    <span className="info-label">Evaluated By</span>
                    <span className="info-value">{logger.rootCauseAnalysisStatusDetails.evaluatedBy}</span>
                  </div>
                )}
                {logger.rootCauseAnalysisStatusDetails.type && (
                  <div className="info-item">
                    <span className="info-label">Type</span>
                    <span className="info-value">{logger.rootCauseAnalysisStatusDetails.type}</span>
                  </div>
                )}
                {logger.rootCauseAnalysisStatusDetails.evaluationType && (
                  <div className="info-item">
                    <span className="info-label">Evaluation Type</span>
                    <span className="info-value">{logger.rootCauseAnalysisStatusDetails.evaluationType}</span>
                  </div>
                )}
                {logger.rootCauseAnalysisStatusDetails.primaryRootCause && (
                  <div className="info-item">
                    <span className="info-label">Primary Root Cause</span>
                    <span className="info-value">{logger.rootCauseAnalysisStatusDetails.primaryRootCause}</span>
                  </div>
                )}
                {logger.rootCauseAnalysisStatusDetails.secondaryRootCause && (
                  <div className="info-item">
                    <span className="info-label">Secondary Root Cause</span>
                    <span className="info-value">{logger.rootCauseAnalysisStatusDetails.secondaryRootCause}</span>
                  </div>
                )}
                {logger.rootCauseAnalysisStatusDetails.reason && (
                  <div className="info-item full-width">
                    <span className="info-label">Reason</span>
                    <span className="info-value">{logger.rootCauseAnalysisStatusDetails.reason}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="dashboard-footer">
          <a href={`/shipment-report/${shipment.shipmentId}`} className="shipment-report-link">Link to Shipment Report</a>
        </div>
      </div>
    </>
  );
};

export default LoggerDashboard;
