export const RCASStatus = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  CLOSED: 'Closed'
} as const;

export type RCASStatus = typeof RCASStatus[keyof typeof RCASStatus];

export const RootCauseAnalysis = {
  UNDER_INVESTIGATION: 'Under Investigation',
  LOADING_SPIKE: 'Loading Spike',
  REFRIGERATOR_BROKEN: 'Refrigerator Broken'
} as const;

export type RootCauseAnalysis = typeof RootCauseAnalysis[keyof typeof RootCauseAnalysis];

export interface Logger {
  loggerId: string;
  loggerType: string;
  loggerStarted: string | null;
  loggerEnded: string | null;
  alarms: number | null;
  rootCauseAnalysis: RootCauseAnalysis | null;
  enrichedEvent?: {
    alarmType: string | null;
    timeline?: {
      title: string;
      subtitle: string;
      dot: 'green' | 'red' | 'orange' | 'blue' | 'gray';
      extraInfo: {
        time: string;
        location: string;
      };
      status?: string;
      timestamp?: string;
      transportMode?: string;
      vehicleNumber?: string;
      weatherConditions?: string;
      excursionDetails?: {
        highest?: string;
        lowest?: string;
        average?: string;
        startTime?: string;
        duration: string;
        maxDeviation: string;
        averageDeviation: string;
        affectedProducts: string;
      };
    }[];
    events?: {
      eventId: number;
      alarmType: string | null;
      timeline: {
        title: string;
        subtitle: string;
        dot: 'green' | 'red' | 'orange' | 'blue' | 'gray';
        extraInfo: {
          time: string;
          location: string;
        };
        status?: string;
        timestamp?: string;
        transportMode?: string;
        vehicleNumber?: string;
        weatherConditions?: string;
        excursionDetails?: {
          highest?: string;
          lowest?: string;
          average?: string;
          startTime?: string;
          duration: string;
          maxDeviation: string;
          averageDeviation: string;
          affectedProducts: string;
        };
      }[];
    }[];
  };
}


export interface Shipment {
  id: string;
  shipmentId: string;
  origin: string | null;
  destination: string | null;
  eta: string | null;
  status: string | null;   
  totalAlarms: number | null;
  RCAS: RCASStatus | null;
  lastSeen: string | null;
  FF: string | null;
  currentLocation: string | null;
  modeOfTransport: string | null;
  packagingType: string | null;
  logger_data: Logger[];
}
