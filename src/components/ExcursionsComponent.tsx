import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Thermometer, Clock, Droplets, Zap } from 'lucide-react';
import type { ExcursionData } from '../utils/excursionMatcher';

interface ExcursionsComponentProps {
  excursions: ExcursionData[];
}

export const ExcursionsComponent: React.FC<ExcursionsComponentProps> = ({ excursions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!excursions || excursions.length === 0) {
    return null;
  }

  const getSeverityClass = (alarmType: string) => {
    switch (alarmType.toLowerCase()) {
      case 'temperature': return 'excursion-severity-high';
      case 'humidity': return 'excursion-severity-medium';
      case 'shock': return 'excursion-severity-critical';
      default: return 'excursion-severity-medium';
    }
  };

  const getExcursionIcon = (alarmType: string) => {
    switch (alarmType.toLowerCase()) {
      case 'temperature': return <Thermometer size={16} />;
      case 'humidity': return <Droplets size={16} />;
      case 'shock': return <Zap size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Group excursions by alarm type
  const groupedExcursions = excursions.reduce((groups, excursion) => {
    const type = excursion.alarmType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(excursion);
    return groups;
  }, {} as Record<string, ExcursionData[]>);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="excursions-container">
      <div className="excursions-header" onClick={toggleExpanded}>
        <div className="excursions-title">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <AlertTriangle size={16} className="excursion-icon" />
          <span>Excursions ({excursions.length})</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="excursions-content">
          {Object.entries(groupedExcursions).map(([alarmType, typeExcursions]) => (
            <div key={alarmType} className="excursion-type-group">
              <div className="excursion-type-header">
                {getExcursionIcon(alarmType)}
                <h4>{alarmType} Excursions ({typeExcursions.length})</h4>
              </div>
              {typeExcursions.map((excursion, index) => (
                <div key={`${excursion.loggerId}-${index}`} className="excursion-item">
                  <div className="excursion-header">
                    <div className="excursion-logger">
                      <strong>Logger:</strong> {excursion.loggerId}
                    </div>
                  </div>
                  <div className="excursion-details">
                <div className="excursion-detail-row">
                  <div className="excursion-detail">
                    <Thermometer size={14} />
                    <span><strong>Highest:</strong> {excursion.excursion.highest}</span>
                  </div>
                </div>
                <div className="excursion-detail-row">
                  <div className="excursion-detail">
                    <Clock size={14} />
                    <span><strong>Duration:</strong> {excursion.excursion.duration}</span>
                  </div>
                </div>
                <div className="excursion-detail-row">
                  <div className="excursion-detail">
                    <span><strong>Start Time:</strong> {formatTimestamp(excursion.excursion.startTime)}</span>
                  </div>
                </div>
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
