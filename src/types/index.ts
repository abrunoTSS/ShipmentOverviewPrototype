export const RCASStatus = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  UNDER_INVESTIGATION: 'Under Investigation',
  CLOSED: 'Closed',
  N_A: 'n/a'
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
  details?: string;
  UTCDateStarted?: string;
  evaluatedBy?: string;
  type?: string;
  evaluationType?: string;
  primaryRootCause?: string;
  secondaryRootCause?: string;
  reason?: string;
};

export type LoggerType = 'sentry' | 'sentinel' | 'web logger 2' | 'Sentry' | 'Sentinel' | 'Web Logger 2';

export interface ExcursionGraphData {
  time: string;
  temperature: number;
}

export interface Excursion {
  highest: string;
  lowest: string;
  average: string;
  startTime?: string;
  duration: string;

}

export interface ExcursionMilestone {
  type?: string;
  location: string;
  arrivalTime?: string;
  departedTime?: string;
  status: string;
  transportMode?: string;
  vehicleNumber?: string;
  weatherConditions?: string;
  excursion?: Excursion | null;
}

export interface Alarm {
  alarmId: number;
  alarmType: string;
  errorMessage?: string;
  excursionMilestones: ExcursionMilestone[];
}

export interface ProductDetails {
  prodfilename: string;
  producttype: string;
  temperatureProfile: string;
  highThreshold: string;
  lowThreshold: string;
 
}

export interface Milestone {
  type: string;
  location: string;
  status: string;
  arrivalTime?: string;
  departedTime?: string;
  transportMode?: string;
  vehicleNumber?: string;
  weatherConditions?: string;
  excursion?: any;
}

export interface Logger {
  loggerId: string;
  loggerType: LoggerType;
  loggerStarted: string;
  loggerEnded: string;
  temperature?: string;
  alarms: Alarm[] | number; // Can be a count or a detailed array
  rootCauseAnalysis: string | null;
  rootCauseAnalysisStatusDetails: RootCauseAnalysisStatusDetails | null;
  events?: any[];
  lastSeen?: string;
  productDetails?: ProductDetails;
  excursionMilestones?: Milestone[];
  calibrationDate?: string;
  expiryDate?: string;
  sampleRate?: string;
  startDelay?: string;
  // Added for logger end date display logic
  shipmentStatus?: string;
  shipmentEta?: string;
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
  shipmentCurrentMilestone?: shipmentCurrentMilestone[];
  alarms: number;
  totalAlarms?: number;
  events: number | null;
  rcas: string;
  loggerData: Logger[];
}

export interface shipmentCurrentMilestone {
  type: string;
  location: string;
  status: string;
}
