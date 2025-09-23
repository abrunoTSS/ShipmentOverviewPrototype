import React, { useEffect, useRef } from 'react';
import type { ShipmentMilestone, Shipment } from '../types';
import './milestoneTimeline.css';

interface MilestoneTimelineProps {
  milestones: ShipmentMilestone[];
  shipment?: Shipment;
  className?: string;
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones, shipment, className = '' }) => {
  // Use milestones in the order they appear in the data structure
  const orderedMilestones = milestones;
  const timelineRef = useRef<HTMLDivElement>(null);
  const currentMilestoneRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current milestone for in-transit shipments
  useEffect(() => {
    const isInTransit = shipment?.status?.toLowerCase() === 'in transit';
    
    if (isInTransit && currentMilestoneRef.current && timelineRef.current) {
      const currentElement = currentMilestoneRef.current;
      const timelineElement = timelineRef.current;
      
      // Calculate the position to scroll to center the current milestone
      const elementTop = currentElement.offsetTop;
      const elementHeight = currentElement.offsetHeight;
      const timelineHeight = timelineElement.clientHeight;
      
      const scrollPosition = elementTop - (timelineHeight / 2) + (elementHeight / 2);
      
      timelineElement.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [shipment?.status, orderedMilestones]);



  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }) + ' UTC';
    } catch {
      return timestamp;
    }
  };

  const getTimeLabel = (milestone: ShipmentMilestone) => {
    const status = milestone.status.toLowerCase();
    if (status === 'completed') {
      return 'Arrived:';
    } else if (status === 'current' || status === 'pending' || status === 'delayed') {
      return 'ETA:';
    }
    return '';
  };

  const isCurrentMilestone = (milestone: ShipmentMilestone) => 
    milestone.status.toLowerCase() === 'current';
  
  const isHighlightedMilestone = (milestone: ShipmentMilestone) => {
    return isCurrentMilestone(milestone);
  };


  return (
    <div className={`milestone-timeline-container ${className}`}>
      <h3 className="timeline-title">Shipment Milestones</h3>
      <div className="timeline" ref={timelineRef}>
        {orderedMilestones.map((milestone, index) => (
          <div 
            key={index} 
            ref={isCurrentMilestone(milestone) ? currentMilestoneRef : null}
            className={`timeline-item ${isHighlightedMilestone(milestone) ? 'latest' : ''} ${milestone.status.toLowerCase()}`}
          >
            {/* Timeline line */}
            <div className="timeline-line">
              {index < orderedMilestones.length - 1 && <div className="line-connector" />}
            </div>
            
            {/* Timeline icon */}
            <div className={`timeline-icon ${milestone.status.toLowerCase()}`}>
              <div className="icon-circle">
              </div>
            </div>
            
            {/* Milestone card */}
            <div className={`milestone-card ${isHighlightedMilestone(milestone) ? 'active' : ''}`}>
              <div className="milestone-header">
                <h4 className="milestone-title">{milestone.location}</h4>
                {index === 0 && <span className="milestone-label">Origin</span>}
                {index === orderedMilestones.length - 1 && <span className="milestone-label">Destination</span>}
              </div>
              
              <div className="milestone-detail">
                <span className="detail-label">{getTimeLabel(milestone)}</span>
                <span className="detail-value">{formatTimestamp(milestone.arrivalTime)}</span>
              </div>
              
              <div className="milestone-detail">
                <span className="detail-label">Transport Mode:</span>
                <span className="detail-value">{milestone.transportMode}</span>
              </div>
              
              {milestone.vehicleNumber && (
                <div className="milestone-detail">
                  <span className="detail-label">Vehicle Number:</span>
                  <span className="detail-value">{milestone.vehicleNumber}</span>
                </div>
              )}
              
              {milestone.weather && (
                <div className="milestone-detail">
                  <span className="detail-label">Weather Conditions:</span>
                  <span className="detail-value">{milestone.weather}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneTimeline;
