import React, { useMemo } from 'react';
import { X, Plane, Truck, Ship, AlertTriangle } from 'lucide-react';
import type { Shipment, Logger } from '../types';
import { matchExcursionsToMilestones } from '../utils/excursionMatcher';
import { AlarmsComponent } from './AlarmsComponent';
import './loggerDashboard.css';
import './ExcursionsComponent.css';

// Helper function to extract timezone name from ISO date string
const getTimezoneFromDateString = (dateString: string): string => {
  if (!dateString || !dateString.includes('+')) return 'UTC';
  
  const parts = dateString.split('+');
  if (parts.length < 2) return 'UTC';
  
  const offset = parts[1];
  switch (offset) {
    case '00:00': return 'GMT';
    case '02:00': return 'CET';
    case '04:00': return 'GST';
    case '09:00': return 'JST';
    default: return 'UTC';
  }
};

// Helper function to format date with proper timezone
const formatDateWithTimezone = (dateString: string): string => {
  try {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (date.toString() === 'Invalid Date') return 'Invalid Date';
    
    const timezoneName = getTimezoneFromDateString(dateString);
    return `${date.toLocaleString()} ${timezoneName}`;
  } catch (error) {
    return 'Invalid Date';
  }
};

interface LoggerDashboardProps {
  shipment: Shipment | null;
  logger: Logger | null;
  isOpen: boolean;
  onClose: () => void;
}

const LoggerDashboard: React.FC<LoggerDashboardProps> = ({ shipment, logger, isOpen, onClose }) => {

  // Match excursions to milestones
  const milestonesWithExcursions = useMemo(() => {
    if (!shipment) return [];
    const result = matchExcursionsToMilestones(shipment);
    console.log('Shipment:', shipment.shipmentId);
    console.log('Milestones with excursions:', result);
    console.log('Logger data:', shipment.loggerData);
    console.log('Current logger:', logger);
    if (logger) {
      console.log('Logger alarms:', logger.alarms);
    }
    return result;
  }, [shipment, logger]);

  // Calculate total alarm count for the shipment
  const totalAlarmCount = useMemo(() => {
    if (!shipment?.loggerData) return 0;
    return shipment.loggerData.reduce((total, logger) => {
      return total + (logger.alarms?.length || 0);
    }, 0);
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
    } else if (mode.includes('sea') || mode.includes('ship') || mode.includes('ocean') || mode.includes('ferry')) {
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
                <span className="info-label">Shipping Number</span>
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

          </div>

          {/* Shipping Milestones Section */}
          <div className="dashboard-section">
            <h3 className="section-title">
              Shipping Milestones
              {totalAlarmCount > 0 && (
                <span className="alarm-indicator">
                  <AlertTriangle size={16} className="warning-icon" />
                  <span className="alarm-count">Total Alarms: {totalAlarmCount}</span>
                </span>
              )}
            </h3>
            
            {/* Error message for shipments with missing milestone data */}
            {(shipment.shipmentId === "SH014" || shipment.shipmentId === "SH015") && (
              <div className="milestone-error" style={{ marginBottom: '15px', width: '100%' }}>
                <p className="error-message">Unable to get milestone data from {shipment.freightForwarder}. Please check if the Shipping Number is correct.</p>
              </div>
            )}
            
            {milestonesWithExcursions && milestonesWithExcursions.length > 0 && (
              <>
                {milestonesWithExcursions.map((milestone, index) => (
                  <div key={index} className="milestone-item">
                    <div className={`milestone-icon ${milestone.status.toLowerCase()}`}>
                      {milestone.type === 'alarm' ? (
                        <div className="milestone-dot-fallback alarm-dot"></div>
                      ) : milestone.transportMode ? (
                        getTransportIcon(milestone.transportMode)
                      ) : (
                        <div className="milestone-dot-fallback"></div>
                      )}
                    </div>
                    <div className="milestone-content">
                      <div className="milestone-header">
                        <h4 className="milestone-title">
                          {milestone.type === 'origin' ? milestone.location : milestone.location}
                        </h4>
                        <span className={`milestone-status ${milestone.status.toLowerCase()}`}>
                          {milestone.status}
                        </span>
                      </div>
                      <div className="milestone-details">
                        <div className="milestone-info">
                          <span className="info-label">Event:</span>
                          <span className="info-value">{milestone.milestoneName}</span>
                        </div>
                        {milestone.type === 'origin' && shipment && (
                          <>
                            <div className="milestone-info">
                              <span className="info-label">Origin:</span>
                              <span className="info-value">{milestone.location}</span>
                            </div>
                            <div className="milestone-info">
                              <span className="info-label">Destination:</span>
                              <span className="info-value">
                                {(() => {
                                  const destinationMilestone = shipment.milestones?.find(m => m.type === 'destination');
                                  return destinationMilestone ? destinationMilestone.location : 'N/A';
                                })()}
                              </span>
                            </div>
                          </>
                        )}
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
                              {formatDateWithTimezone(milestone.eta)}
                            </span>
                          </div>
                        )}
                        {milestone.status === 'Pending' && milestone.etd && (
                          <div className="milestone-info">
                            <span className="info-label">ETD:</span>
                            <span className="info-value">
                              {formatDateWithTimezone(milestone.etd)}
                            </span>
                          </div>
                        )}
                        {milestone.status === 'Current' && milestone.arrivalTime && (
                          <div className="milestone-info">
                            <span className="info-label">Arrived:</span>
                            <span className="info-value">
                              {formatDateWithTimezone(milestone.arrivalTime)}
                            </span>
                          </div>
                        )}
                        {milestone.status === 'Current' && milestone.etd && (
                          <div className="milestone-info">
                            <span className="info-label">ETD:</span>
                            <span className="info-value">
                              {formatDateWithTimezone(milestone.etd)}
                            </span>
                          </div>
                        )}
                        {milestone.status === 'Completed' && (milestone.arrived || milestone.arrivalTime) && (
                          <div className="milestone-info">
                            <span className="info-label">Arrived:</span>
                            <span className="info-value">
                              {(() => {
                                const arrivedAt = milestone.arrived ?? milestone.arrivalTime;
                                return arrivedAt ? formatDateWithTimezone(arrivedAt) : 'N/A';
                              })()}
                            </span>
                          </div>
                        )}
                        {milestone.status === 'Completed' && (milestone.departed || milestone.departedTime) && (
                          <div className="milestone-info">
                            <span className="info-label">Departed:</span>
                            <span className="info-value">
                              {(() => {
                                const departedAt = milestone.departed ?? milestone.departedTime;
                                return departedAt ? formatDateWithTimezone(departedAt) : 'N/A';
                              })()}
                            </span>
                          </div>
                        )}
                        
                        {/* Display single alarms for this milestone */}
                        {milestone.excursions && milestone.excursions.length > 0 && (
                          <div className="milestone-alarms">
                            <AlarmsComponent alarms={milestone.excursions.filter(exc => exc.alarmType === 'Single').map(exc => ({
                              alarmId: exc.excursion.id,
                              alarmType: 'Single' as const,
                              isSingleAlarm: true,
                              triggeredCondition: exc.excursion.triggeredCondition ? {
                                condition: exc.excursion.triggeredCondition.condition as 'above' | 'below',
                                temperature: exc.excursion.triggeredCondition.temperature,
                                durationMinutes: exc.excursion.triggeredCondition.durationMinutes
                              } : undefined,
                              triggeredAt: exc.excursion.startTime,
                              temperatureAtTrigger: exc.excursion.temperatureAtTrigger,
                              loggerId: exc.loggerId,
                              errorMessage: `Single alarm: ${exc.excursion.type}`
                            }))} />
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>


          {logger && Array.isArray(logger.alarms) && logger.alarms.length > 0 && (
            <div className="dashboard-section">
              <h3 className="section-title">Alarms</h3>
              <AlarmsComponent alarms={logger.alarms} />
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
