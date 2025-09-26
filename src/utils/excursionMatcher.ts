import type { Shipment, Milestone } from '../types';

export interface ExcursionData {
  loggerId: string;
  alarmType: string;
  excursion: {
    id: number;
    highest: string;
    startTime: string;
    endTime: string;
    duration: string;
    type: string;
    temperatureProfile?: string;
  };
}

export interface MilestoneWithExcursions extends Milestone {
  excursions?: ExcursionData[];
}

/**
 * Matches excursion events to shipment milestones based on timestamp overlap
 */
export function matchExcursionsToMilestones(shipment: Shipment): MilestoneWithExcursions[] {
  const milestonesWithExcursions: MilestoneWithExcursions[] = (shipment.milestones || []).map(milestone => ({
    ...milestone,
    excursions: []
  }));

  const allExcursions: ExcursionData[] = [];
  
  // Extract excursions from logger alarms
  shipment.loggerData.forEach(logger => {
    if (logger.alarms && Array.isArray(logger.alarms)) {
      logger.alarms.forEach(alarm => {
        if (alarm.excursion) {
          allExcursions.push({
            loggerId: logger.loggerId,
            alarmType: alarm.alarmType,
            excursion: alarm.excursion
          });
        }
      });
    }
  });

  // Match excursions to milestones based on startTime
  allExcursions.forEach(excursionData => {
    const excursionTime = new Date(excursionData.excursion.startTime);
    
    let bestMatchIndex = -1;
    let bestScore = Infinity;
    
    milestonesWithExcursions.forEach((milestone, index) => {
      const milestoneTime = new Date(milestone.arrivalTime || milestone.arrived || '');
      if (isNaN(milestoneTime.getTime())) return; // Skip invalid dates
      
      const timeDiff = Math.abs(excursionTime.getTime() - milestoneTime.getTime());
      let score = timeDiff;
      
      if (score < bestScore) {
        bestMatchIndex = index;
        bestScore = score;
      }
    });
    
    if (bestMatchIndex >= 0) {
      const bestMatch = milestonesWithExcursions[bestMatchIndex];
      if (!bestMatch.excursions) {
        bestMatch.excursions = [];
      }
      // Match found - add excursion to milestone
      bestMatch.excursions.push(excursionData);
    }
  });

  return milestonesWithExcursions;
}

