import React, { useState } from 'react';
import { ChevronDown, AlertTriangle, Thermometer, Droplets, Zap, Move, Gauge, Sun } from 'lucide-react';
import type { ExcursionData } from '../utils/excursionMatcher';

interface AlarmsComponentProps {
  alarms: ExcursionData[];
}

export const AlarmsComponent: React.FC<AlarmsComponentProps> = ({ alarms }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!alarms || alarms.length === 0) {
    return null;
  }

  const getSeverityClass = (alarmType: string) => {
    switch (alarmType.toLowerCase()) {
      case 'temperature': return 'excursion-severity-high';
      case 'humidity': return 'excursion-severity-medium';
      case 'shock': return 'excursion-severity-critical';
      case 'tilt': return 'excursion-severity-high';
      case 'pressure': return 'excursion-severity-medium';
      case 'light': return 'excursion-severity-medium';
      default: return 'excursion-severity-medium';
    }
  };

  const getAlarmIcon = (alarmType: string) => {
    switch (alarmType.toLowerCase()) {
      case 'temperature': return <Thermometer size={16} />;
      case 'humidity': return <Droplets size={16} />;
      case 'shock': return <Zap size={16} />;
      case 'tilt': return <Move size={16} />;
      case 'pressure': return <Gauge size={16} />;
      case 'light': return <Sun size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Group alarms by alarm type
  const groupedAlarms = alarms.reduce((groups, alarm) => {
    const type = alarm.alarmType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(alarm);
    return groups;
  }, {} as Record<string, ExcursionData[]>);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="excursions-container">
      <div className="excursions-header" onClick={toggleExpanded}>
        <div className="excursions-title">
          <AlertTriangle size={16} className="excursion-icon" />
          <span>Alarms ({alarms.length})</span>
        </div>
        <div className={`excursions-arrow ${isExpanded ? 'expanded' : ''}`}>
          <ChevronDown size={16} />
        </div>
      </div>
      
      {isExpanded && (
        <div className="excursions-content">
          {Object.entries(groupedAlarms).map(([alarmType, typeAlarms]) => (
            <div key={alarmType} className="excursion-type-group">
              <div className="excursion-type-header">
                {getAlarmIcon(alarmType)}
                <h4>{alarmType} Alarms ({typeAlarms.length})</h4>
              </div>
              {typeAlarms.map((alarm, index) => (
                <div key={`${alarm.loggerId}-${index}`} className="excursion-item">
                  <div className="excursion-header">
                    <div className="excursion-logger">
                      <strong>Unit S/N:</strong> {alarm.loggerId}
                    </div>
                  </div>
                  <div className="excursion-details">
                    <div className="excursion-detail-row">
                      <div className="excursion-detail">
                        <span><strong>Start Time:</strong> {formatTimestamp(alarm.excursion.startTime)}</span>
                      </div>
                    </div>
                    <div className="excursion-detail-row">
                      <div className="excursion-detail">
                        <span><strong>Duration:</strong> {alarm.excursion.duration}</span>
                      </div>
                    </div>
                    {alarm.excursion.temperatureProfile && (
                      <div className="excursion-detail-row">
                        <div className="excursion-detail">
                          <span><strong>Profile:</strong> {alarm.excursion.temperatureProfile}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
