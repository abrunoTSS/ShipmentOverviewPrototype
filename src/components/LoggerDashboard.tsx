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

  const renderMilestone = (milestone: ExcursionMilestone, index: number) => (
    <div className="milestone-item" key={index}>
      <div className={`milestone-dot ${milestone.status.toLowerCase()}`} />
      <div className="milestone-content">
        <p className="milestone-location">{milestone.location}</p>
        <div className="milestone-extra-details">
          <p><strong>Arrival Time:</strong> {new Date(milestone.arrivalTime).toLocaleString()}</p>
          {milestone.departedTime && (
            <p><strong>Departed Time:</strong> {new Date(milestone.departedTime).toLocaleString()}</p>
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
          <h2 className="dashboard-title">Logger: {logger.loggerId}</h2>
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
          </div>

          <div className="dashboard-section">
            <h3 className="section-title">Logger Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Logger Type</span>
                <span className="info-value">{logger.loggerType}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Temperature</span>
                <span className="info-value">{logger.temperature || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Humidity</span>
                <span className="info-value">{logger.humidity || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Seen</span>
                <span className="info-value">{logger.lastSeen ? new Date(logger.lastSeen).toLocaleString() : 'N/A'}</span>
              </div>
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
              <p className='info-value'>{logger.rootCauseAnalysisStatusDetails.details}</p>
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
