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
  id: number;
  highest: string;
  lowest?: string;
  average?: string;
  startTime: string;
  endTime: string;
  duration: string;
  type: string;
  temperatureProfile?: string;
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
  temperature?: number;
  excursion?: {
    highest: string;
    lowest: string;
    average: string;
    startTime: string;
    duration: string;
  };
}

export interface LoggerTimeSeriesData {
  timestamp: string;
  temperature: number; // °C
  humidity?: number; // % (only for Sentinel/Sentry loggers)
}

export type AlarmType = 'Humidity' | 'Light' | 'Pressure' | 'Shock' | 'Temperature' | 'Tilt';

export interface Alarm {
  alarmId: number;
  alarmType: AlarmType;
  errorMessage?: string;
  excursion: Excursion;
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
  milestoneName: string;
  groundHandler: string;
  arrivalTime?: string;
  departedTime?: string;
  transportMode?: string;
  vehicleNumber?: string;
  weatherConditions?: string;
  excursion?: any;
  eta?: string; // For pending milestones
  etd?: string; // For pending and current milestones
  arrived?: string; // For completed milestones
  departed?: string; // For completed milestones
}

export interface Logger {
  loggerId: string;
  loggerType: LoggerType;
  missionStarted: string; // Renamed from loggerStarted
  missionEnded: string; // Renamed from loggerEnded
  deliveryId: string; // New column
  tempProfile: string; // New column
  serialNumber: number; // New column
  alarms: Alarm[]; // Array of detailed alarm objects
  alarmTypes?: AlarmType[]; // Array of alarm types for this logger
  evaluation: string | null; // Renamed from rootCauseAnalysis
  rootCauseAnalysisStatusDetails: RootCauseAnalysisStatusDetails | null;
  events?: any[];
  productDetails?: ProductDetails;
  excursionMilestones?: Milestone[];
  calibrationDate?: string;
  expiryDate?: string;
  sampleRate?: string;
  startDelay?: string;
  temperature?: string; // Current temperature reading
  lastSeen?: string; // Last communication timestamp
  // Added for logger end date display logic
  shipmentStatus?: string;
  shipmentEta?: string;
  // Time-series data for temperature and humidity readings
  timeSeriesData?: LoggerTimeSeriesData[];
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
  milestones?: Milestone[];
  alarms: number;
  totalAlarms?: number;
  events: number | null;
  rcas: string;
  loggerData: Logger[];
  distance: number; // Distance in kilometers
  co2Emissions: number; // CO2 emissions in kg
}
