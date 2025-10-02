import React, { useState } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import type { Alarm } from '../types';

interface AlarmsComponentProps {
  alarms: Alarm[];
}

export const AlarmsComponent: React.FC<AlarmsComponentProps> = ({ alarms }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log('AlarmsComponent received alarms:', alarms);

  // Filter to only show single alarms
  const singleAlarms = alarms.filter(alarm => alarm.isSingleAlarm);
  
  console.log('Filtered single alarms:', singleAlarms);

  if (!singleAlarms || singleAlarms.length === 0) {
    console.log('No single alarms to display');
    return null;
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="excursions-container">
      <div className="excursions-header" onClick={toggleExpanded}>
        <div className="excursions-title">
          <AlertTriangle size={16} className="excursion-icon" />
          <span>Alarms ({singleAlarms.length})</span>
        </div>
        <div className={`excursions-arrow ${isExpanded ? 'expanded' : ''}`}>
          <ChevronDown size={16} />
        </div>
      </div>
      
      {isExpanded && (
        <div className="excursions-content">
          {singleAlarms.map((alarm, index) => (
            <div key={`${alarm.loggerId}-${alarm.alarmId}-${index}`} className="excursion-item">
              <div className="alarm-badges">
                <div className="alarm-badge alarm-type-badge">
                  <AlertTriangle size={14} />
                  <span>SINGLE ALARM</span>
                </div>
                <div className={`alarm-badge severity-badge ${alarm.triggeredCondition?.condition === 'above' ? 'severity-high' : 'severity-low'}`}>
                  <span>{alarm.triggeredCondition?.condition === 'above' ? 'HIGH' : 'LOW'}</span>
                </div>
              </div>
              
              <div className="excursion-header">
                <div className="excursion-logger">
                  <strong>Unit S/N:</strong> {alarm.loggerId}
                </div>
              </div>

              <div className="excursion-details">
                <div className="excursion-detail-row">
                  <div className="excursion-detail">
                    <span><strong>Trigger Timestamp:</strong> {alarm.triggeredAt ? formatTimestamp(alarm.triggeredAt) : 'N/A'}</span>
                  </div>
                </div>
                
                {alarm.triggeredCondition && (
                  <div className="excursion-detail-row">
                    <div className="excursion-detail">
                      <span><strong>Alarm Trigger:</strong> {alarm.triggeredCondition.condition === 'above' ? 'High' : 'Low'} Threshold ({alarm.triggeredCondition.temperature}°C)</span>
                    </div>
                  </div>
                )}
                
                {alarm.temperatureAtTrigger !== undefined && (
                  <div className="excursion-detail-row">
                    <div className="excursion-detail">
                      <span><strong>Temperature at Trigger:</strong> {alarm.temperatureAtTrigger}°C</span>
                    </div>
                  </div>
                )}
                
                {alarm.triggeredCondition?.durationMinutes !== undefined && (
                  <div className="excursion-detail-row">
                    <div className="excursion-detail">
                      <span><strong>Duration Threshold:</strong> {alarm.triggeredCondition.durationMinutes} minutes</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
