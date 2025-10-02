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
    triggeredCondition?: {
      condition: string;
      temperature: number;
      durationMinutes: number;
    };
    temperatureAtTrigger?: number;
  };
  // Flags that describe how this excursion relates to the current milestone
  isStartOfExcursion?: boolean;
  isEndOfExcursion?: boolean;
  spansMultipleMilestones?: boolean;
}

export interface MilestoneWithExcursions extends Milestone {
  excursions?: ExcursionData[];
}

/**
 * Matches excursion events to shipment milestones based on timestamp overlap
 * and integrates single alarms into existing milestones
 */
export function matchExcursionsToMilestones(shipment: Shipment): MilestoneWithExcursions[] {
  console.log('Processing shipment:', shipment.shipmentId);
  console.log('Raw milestones:', shipment.milestones);
  
  const milestonesWithExcursions: MilestoneWithExcursions[] = (shipment.milestones || []).map(milestone => ({
    ...milestone,
    excursions: []
  }));
  
  console.log('Milestones with excursions initialized:', milestonesWithExcursions);

  // Build milestone windows for overlap checks (use original milestones, not merged ones)
  const milestoneWindows = milestonesWithExcursions.map((m, idx) => {
    const startStr = (m as any).arrivalTime || (m as any).arrived || '';
    const endStr = (m as any).departedTime || (m as any).departed || '';
    const start = new Date(startStr);
    const end = endStr ? new Date(endStr) : new Date(start.getTime() + 1000); // minimal window if no end
    return {
      index: idx,
      start,
      end,
    };
  });

  const allExcursions: ExcursionData[] = [];
  
  // Extract excursions from logger alarms AND create pseudo-excursions for single alarms
  shipment.loggerData.forEach(logger => {
    if (logger.alarms && Array.isArray(logger.alarms)) {
      logger.alarms.forEach(alarm => {
        if (alarm.excursion) {
          allExcursions.push({
            loggerId: logger.loggerId,
            alarmType: alarm.alarmType,
            excursion: alarm.excursion
          });
        } else if (alarm.isSingleAlarm && alarm.triggeredAt) {
          // Create a pseudo-excursion for single alarms to integrate them into milestones
          allExcursions.push({
            loggerId: logger.loggerId,
            alarmType: 'Single',
            excursion: {
              id: alarm.alarmId,
              highest: `${alarm.temperatureAtTrigger}°C`,
              startTime: alarm.triggeredAt,
              endTime: alarm.triggeredAt, // Same as start for single alarms
              duration: "Single Alarm",
              type: "Single Alarm",
              temperatureProfile: `${alarm.triggeredCondition?.condition} ${alarm.triggeredCondition?.temperature}°C`,
              triggeredCondition: alarm.triggeredCondition,
              temperatureAtTrigger: alarm.temperatureAtTrigger
            }
          });
        }
      });
    }
  });

  // Assign excursions to all overlapping milestones with flags
  allExcursions.forEach(exc => {
    const startTime = new Date(exc.excursion.startTime).getTime();
    const endTime = new Date(exc.excursion.endTime).getTime();

    let startIdx = -1;
    let endIdx = -1;

    // Find windows containing start/end
    milestoneWindows.forEach(win => {
      if (isNaN(win.start.getTime()) || isNaN(win.end.getTime())) return;
      const s = win.start.getTime();
      const e = win.end.getTime();
      if (startIdx === -1 && startTime >= s && startTime <= e) startIdx = win.index;
      if (endIdx === -1 && endTime >= s && endTime <= e) endIdx = win.index;
    });

    // Fallback to nearest if not found
    if (startIdx === -1) {
      let best = { idx: -1, diff: Infinity };
      milestoneWindows.forEach(win => {
        if (isNaN(win.start.getTime())) return;
        const diff = Math.abs(startTime - win.start.getTime());
        if (diff < best.diff) best = { idx: win.index, diff };
      });
      startIdx = best.idx;
    }
    if (endIdx === -1) {
      let best = { idx: -1, diff: Infinity };
      milestoneWindows.forEach(win => {
        if (isNaN(win.end.getTime())) return;
        const diff = Math.abs(endTime - win.end.getTime());
        if (diff < best.diff) best = { idx: win.index, diff };
      });
      endIdx = best.idx;
    }

    if (startIdx === -1 && endIdx === -1) return;
    const a = startIdx === -1 ? endIdx : startIdx;
    const b = endIdx === -1 ? startIdx : endIdx;
    const from = Math.min(a, b);
    const to = Math.max(a, b);
    const spansMultiple = from !== to;

    for (let i = from; i <= to; i++) {
      const target = milestonesWithExcursions[i];
      if (!target.excursions) target.excursions = [];
      target.excursions.push({
        ...exc,
        isStartOfExcursion: i === startIdx,
        isEndOfExcursion: i === endIdx,
        spansMultipleMilestones: spansMultiple,
      });
    }
  });

  return milestonesWithExcursions;
}

