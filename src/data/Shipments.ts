import type { Shipment } from '../types';
import { RCASStatus, RootCauseAnalysis } from '../types';

export const shipments: Shipment[] = [
  {
    id: 'SH001',
    shipmentId: 'SH001',
    origin: 'Stockholm, Sweden',
    destination: 'Berlin, Germany',
    eta: '2025-07-20',
    status: 'In Transit',
    FF: 'Geodis',
    currentLocation: 'Hamburg, Germany',
    modeOfTransport: 'Truck',
    packagingType: 'Insulated Box',
    logger_data: [
      {
        loggerId: 'LG-1001',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-10T08:00:00Z',
        loggerEnded: null,
        alarms: 2,
        rootCauseAnalysis: RootCauseAnalysis.UNDER_INVESTIGATION
      },
      {
        loggerId: 'LG-1002',
        loggerType: 'Humidity',
        loggerStarted: '2025-07-10T08:00:00Z',
        loggerEnded: null,
        alarms: 0,
        rootCauseAnalysis: null
      }
    ],
    totalAlarms: 2,
    RCAS: RCASStatus.IN_PROGRESS,
    lastSeen: '2025-07-15T14:30:00Z'
  },
  {
    id: 'SH002',
    shipmentId: 'SH002',
    origin: 'Zurich, Switzerland',
    destination: 'Rome, Italy',
    eta: '2025-07-18',
    status: 'Delivered',
    FF: 'DHL',
    currentLocation: 'Rome, Italy',
    modeOfTransport: 'Air',
    packagingType: 'Cold Chain Pallet',
    logger_data: [
      {
        loggerId: 'LG-1010',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-09T05:00:00Z',
        loggerEnded: '2025-07-17T16:00:00Z',
        alarms: 0,
        rootCauseAnalysis: null
      },
      {
        loggerId: 'LG-1011',
        loggerType: 'Shock',
        loggerStarted: '2025-07-09T05:00:00Z',
        loggerEnded: '2025-07-17T16:00:00Z',
        alarms: 1,
        rootCauseAnalysis: RootCauseAnalysis.LOADING_SPIKE
      }
    ],
    totalAlarms: 1,
    RCAS: RCASStatus.CLOSED,
    lastSeen: '2025-07-17T16:00:00Z'
  },
  {
    id: 'SH003',
    shipmentId: 'SH003',
    origin: 'Copenhagen, Denmark',
    destination: 'Oslo, Norway',
    eta: '2025-07-16',
    status: 'Delayed',
    FF: 'Yusen',
    currentLocation: 'Gothenburg, Sweden',
    modeOfTransport: 'Van',
    packagingType: 'Thermal Blanket',
    logger_data: [
      {
        loggerId: 'LG-1020',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-13T10:00:00Z',
        loggerEnded: null,
        alarms: 3,
        rootCauseAnalysis: RootCauseAnalysis.REFRIGERATOR_BROKEN
      }
    ],
    totalAlarms: 3,
    RCAS: RCASStatus.IN_PROGRESS,
    lastSeen: '2025-07-15T10:45:00Z'
  }
];
