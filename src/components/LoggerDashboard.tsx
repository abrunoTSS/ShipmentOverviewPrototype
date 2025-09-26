import React, { useState, useMemo } from 'react';
import { X, Plane, Truck, Ship } from 'lucide-react';
import type { Shipment, Logger } from '../types';
import { matchExcursionsToMilestones } from '../utils/excursionMatcher';
import { ExcursionsComponent } from './ExcursionsComponent';
import './loggerDashboard.css';
import './ExcursionsComponent.css';

interface LoggerDashboardProps {
  shipment: Shipment | null;
  logger: Logger | null;
  isOpen: boolean;
  onClose: () => void;
}

const LoggerDashboard: React.FC<LoggerDashboardProps> = ({ shipment, logger, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Match excursions to milestones
  const milestonesWithExcursions = useMemo(() => {
    if (!shipment) return [];
    const result = matchExcursionsToMilestones(shipment);
    console.log('Shipment:', shipment.shipmentId);
    console.log('Milestones with excursions:', result);
    console.log('Logger data:', shipment.loggerData);
    return result;
  }, [shipment]);

  if (!isOpen || !shipment) {
    return null;
  }

  // Function to get transport icon based on transport mode
  const getTransportIcon = (transportMode: string) => {
    const mode = transportMode.toLowerCase();
    if (mode.includes('air') || mode.includes('flight')) {
      return <Plane size={16} />;
    } else if (mode.includes('road') || mode.includes('truck')) {
      return <Truck size={16} />;
    } else if (mode.includes('sea') || mode.includes('ship') || mode.includes('ocean')) {
      return <Ship size={16} />;
    }
    // Default fallback - use a generic dot for unknown transport modes
    return <div className="milestone-dot-fallback"></div>;
  };


  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`logger-dashboard ${isOpen ? 'open' : ''}`}>
        <div className="dashboard-header">
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
                <span className="info-label">Distance</span>
                <span className="info-value">{shipment.distance ? `${shipment.distance} km` : 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CO₂ Emissions</span>
                <span className="info-value">{shipment.co2Emissions ? `${shipment.co2Emissions} kg` : 'N/A'}</span>
              </div>
              {/* Only show status for shipments without error messages */}
              {shipment.shipmentId !== "SH014" && shipment.shipmentId !== "SH015" && (
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className="info-value">{shipment.status}</span>
                </div>
              )}
  
            </div>

            {/* Error message for shipments with missing milestone data */}
            {(shipment.shipmentId === "SH014" || shipment.shipmentId === "SH015") && (
              <div className="milestone-error" style={{ marginTop: '15px', width: '100%' }}>
                <p className="error-message">Unable to get milestone data from {shipment.freightForwarder}. Please check if the shipment ID is correct.</p>
              </div>
            )}
          </div>

          {/* Shipping Milestones Section */}
          {milestonesWithExcursions && milestonesWithExcursions.length > 0 && (
            <div className="dashboard-section">
              <h3 className="section-title">Shipping Milestones</h3>
                {milestonesWithExcursions.map((milestone, index) => (
                  <div key={index} className="milestone-item">
                    <div className={`milestone-icon ${milestone.status.toLowerCase()}`}>
                      {milestone.transportMode ? getTransportIcon(milestone.transportMode) : <div className="milestone-dot-fallback"></div>}
                    </div>
                    <div className="milestone-content">
                      <div className="milestone-header">
                        <h4 className="milestone-title">{milestone.location}</h4>
                        <span className={`milestone-status ${milestone.status.toLowerCase()}`}>
                          {milestone.status}
                        </span>
                      </div>
                      <div className="milestone-details">
                        <div className="milestone-info">
                          <span className="info-label">Event:</span>
                          <span className="info-value">{milestone.milestoneName}</span>
                        </div>
                        <div className="milestone-info">
                          <span className="info-label">Ground Handler:</span>
                          <span className="info-value">{milestone.groundHandler}</span>
                        </div>
                        {milestone.transportMode && (
                          <div className="milestone-info">
                            <span className="info-label">Transport:</span>
                            <span className="info-value">{milestone.transportMode}</span>
                          </div>
                        )}
                        {milestone.vehicleNumber && (
                          <div className="milestone-info">
                            <span className="info-label">Vehicle:</span>
                            <span className="info-value">{milestone.vehicleNumber}</span>
                          </div>
                        )}
                        {milestone.status === 'Pending' && milestone.eta && (
                          <div className="milestone-info">
                            <span className="info-label">ETA:</span>
                            <span className="info-value">
                              {new Date(milestone.eta).toLocaleString()} UTC
                            </span>
                          </div>
                        )}
                        {milestone.etd && (
                          <div className="milestone-info">
                            <span className="info-label">ETD:</span>
                            <span className="info-value">
                              {new Date(milestone.etd).toLocaleString()} UTC
                            </span>
                          </div>
                        )}
                        {milestone.weatherConditions && (
                          <div className="milestone-info">
                            <span className="info-label">Weather:</span>
                            <span className="info-value">{milestone.weatherConditions}</span>
                          </div>
                        )}
                        {milestone.status === 'Completed' && milestone.arrived && (
                          <div className="milestone-info">
                            <span className="info-label">Arrived:</span>
                            <span className="info-value">
                              {new Date(milestone.arrived).toLocaleString()} UTC
                            </span>
                          </div>
                        )}
                        {milestone.status === 'Completed' && milestone.delivered && (
                          <div className="milestone-info">
                            <span className="info-label">Delivered:</span>
                            <span className="info-value">
                              {new Date(milestone.delivered).toLocaleString()} UTC
                            </span>
                          </div>
                        )}
                        
                        {/* Add Excursions Component if there are excursions for this milestone */}
                        {milestone.excursions && milestone.excursions.length > 0 && (
                          <div className="milestone-excursions">
                            <ExcursionsComponent excursions={milestone.excursions} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          )}


          {logger && Array.isArray(logger.alarms) && logger.alarms.length > 0 && (
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
                {logger.alarms[activeTab]?.excursion && (
                  <div className="excursion-details">
                    <h4>Excursion Details</h4>
                    <p><strong>Type:</strong> {logger.alarms[activeTab].excursion.type}</p>
                    <p><strong>Highest:</strong> {logger.alarms[activeTab].excursion.highest}</p>
                    <p><strong>Start Time:</strong> {logger.alarms[activeTab].excursion.startTime}</p>
                    <p><strong>End Time:</strong> {logger.alarms[activeTab].excursion.endTime}</p>
                    <p><strong>Duration:</strong> {logger.alarms[activeTab].excursion.duration}</p>
                    {logger.alarms[activeTab].excursion.temperatureProfile && (
                      <p><strong>Temperature Profile:</strong> {logger.alarms[activeTab].excursion.temperatureProfile}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}


          {logger && logger.rootCauseAnalysisStatusDetails && (
            <div className="dashboard-section">
              <h3 className="section-title">Root Cause Analysis</h3>
              <div className="rca-status">
                <span className={`status-dot ${logger.rootCauseAnalysisStatusDetails.status.toLowerCase().replace(/\s+/g, '-')}`}></span>
                <span>{logger.rootCauseAnalysisStatusDetails.status}</span>
              </div>
              
              <div className="rca-details">
                {/* RCA fields from the type definition */}
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
          <a href={`/shipment-report/${shipment.shipmentId}`} className="shipment-report-link">Link to Shipment Report (Opens in new tab)</a>
        </div>
      </div>
    </>
  );
};

export default LoggerDashboard;
