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
  alarms: number | null,
  rootCauseAnalysis: RootCauseAnalysis | null;
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
