export const RCASStatus = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  UNDER_INVESTIGATION: 'Under Investigation',
  CLOSED: 'Closed',
  N_A: 'N/A'
} as const;

export type RCASStatus = typeof RCASStatus[keyof typeof RCASStatus];

export const RootCauseAnalysis = {
  UNDER_INVESTIGATION: 'Under Investigation',
  LOADING_SPIKE: 'Loading Spike',
  REFRIGERATOR_BROKEN: 'Refrigerator Broken'
} as const;

export type RootCauseAnalysis = typeof RootCauseAnalysis[keyof typeof RootCauseAnalysis];

export type RootCauseAnalysisStatusDetails = {
  status: string;
  details: string;
  UTCDateStarted: string;
  evaluatedBy: string;
  type: string;
  evaluationType: string;
  primaryRootCause: string;
  secondaryRootCause: string;
  reason: string;
};

export type LoggerType = 'sentry' | 'sentinel' | 'web logger 2' | 'Sentry' | 'Sentinel' | 'Web Logger 2';

export interface ExcursionGraphData {
  time: string;
  temperature: number;
  humidity?: number;
}

export interface Excursion {
  highest: string;
  lowest: string;
  average: string;
  startTime: string;
  duration: string;
  highestHumidity?: string;
  lowestHumidity?: string;
  averageHumidity?: string;
  graphData?: ExcursionGraphData[];
}

export interface ExcursionMilestone {
  type: string;
  location: string;
  arrivalTime: string;
  departedTime?: string;
  status: string;
  transportMode: string;
  vehicleNumber: string;
  weatherConditions: string;
  excursion?: Excursion;
}

export interface Alarm {
  alarmId: number;
  alarmType: string;
  excursionMilestones: ExcursionMilestone[];
}

export interface ProductDetails {
  prodfilename: string;
  producttype: string;
  temperatureProfile: string;
  highThreshold: string;
  lowThreshold: string;
  humidityProfile?: string;
  highHumidityThreshold?: string;
  lowHumidityThreshold?: string;
}

export interface Logger {
  loggerId: string;
  loggerType: LoggerType;
  loggerStarted: string;
  loggerEnded: string;
  temperature?: string;
  humidity?: string;
  alarms: Alarm[] | number; // Can be a count or a detailed array
  rootCauseAnalysis: string | null;
  rootCauseAnalysisStatusDetails: RootCauseAnalysisStatusDetails | null;
  events?: any[];
  lastSeen?: string;
  productDetails?: ProductDetails;
}

export interface Shipment {
  shipmentId: string;
  origin: string;
  destination: string;
  eta: string;
  etd?: string;
  status: string;
  loggers?: number;
  freightForwarder?: string;
  currentLocation?: string;
  modeOfTransport: string;
  packagingType: string;
  alarms: number;
  events: number | null;
  rcas: string;
  loggerData: Logger[];
}
