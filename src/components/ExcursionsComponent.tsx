import React, { useState } from 'react';
import { ChevronDown, AlertTriangle, Thermometer, Clock, Droplets, Zap } from 'lucide-react';
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
          <AlertTriangle size={16} className="excursion-icon" />
          <span>Excursions ({excursions.length})</span>
        </div>
        <div className={`excursions-arrow ${isExpanded ? 'expanded' : ''}`}>
          <ChevronDown size={16} />
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
                      <strong>Mission ID:</strong> {excursion.loggerId}
                    </div>
                  </div>
                  <div className="excursion-details">
                <div className="excursion-detail-row">
                  <div className="excursion-detail">
                    <span><strong>High Threshold:</strong> {excursion.excursion.highest}</span>
                  </div>
                </div>
                <div className="excursion-detail-row">
                  <div className="excursion-detail">
                    <span><strong>Start Time:</strong> {formatTimestamp(excursion.excursion.startTime)}</span>
                  </div>
                </div>
                {/* End time and duration are shown only where the excursion finishes,
                    or when it does not span multiple milestones */}
                {(excursion.isEndOfExcursion || !excursion.spansMultipleMilestones) && (
                  <>
                    <div className="excursion-detail-row">
                      <div className="excursion-detail">
                        <span><strong>End Time:</strong> {formatTimestamp(excursion.excursion.endTime)}</span>
                      </div>
                    </div>
                    <div className="excursion-detail-row">
                      <div className="excursion-detail">
                        <span><strong>Duration:</strong> {excursion.excursion.duration}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Spanning indicators for multi-milestone excursions */}
                {excursion.spansMultipleMilestones && (
                  <div className="excursion-detail-row">
                    <div className="excursion-detail" style={{ fontStyle: 'italic', color: '#6b7280' }}>
                      {excursion.isStartOfExcursion && !excursion.isEndOfExcursion && (
                        <span>This excursion continues across multiple milestones.</span>
                      )}
                      {!excursion.isStartOfExcursion && excursion.isEndOfExcursion && (
                        <span>This excursion concluded after spanning multiple milestones.</span>
                      )}
                      {!excursion.isStartOfExcursion && !excursion.isEndOfExcursion && (
                        <span>This excursion continues across multiple milestones.</span>
                      )}
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
