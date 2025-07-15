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
  },
  {
    id: 'SH004',
    shipmentId: 'SH004',
    origin: 'Amsterdam, Netherlands',
    destination: 'Paris, France',
    eta: '2025-07-19',
    status: 'In Transit',
    FF: 'Geodis',
    currentLocation: 'Brussels, Belgium',
    modeOfTransport: 'Truck',
    packagingType: 'Insulated Box',
    logger_data: [
      {
        loggerId: 'LG-1030',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-14T06:00:00Z',
        loggerEnded: null,
        alarms: 1,
        rootCauseAnalysis: RootCauseAnalysis.LOADING_SPIKE
      },
      {
        loggerId: 'LG-1031',
        loggerType: 'Shock',
        loggerStarted: '2025-07-14T06:00:00Z',
        loggerEnded: null,
        alarms: 0,
        rootCauseAnalysis: null
      }
    ],
    totalAlarms: 1,
    RCAS: RCASStatus.CLOSED,
    lastSeen: '2025-07-15T16:20:00Z'
  },
  {
    id: 'SH005',
    shipmentId: 'SH005',
    origin: 'Madrid, Spain',
    destination: 'Lisbon, Portugal',
    eta: '2025-07-17',
    status: 'Delivered',
    FF: 'DHL',
    currentLocation: 'Lisbon, Portugal',
    modeOfTransport: 'Van',
    packagingType: 'Cold Chain Pallet',
    logger_data: [
      {
        loggerId: 'LG-1040',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-12T12:00:00Z',
        loggerEnded: '2025-07-17T09:30:00Z',
        alarms: 0,
        rootCauseAnalysis: null
      }
    ],
    totalAlarms: 0,
    RCAS: RCASStatus.NOT_STARTED,
    lastSeen: '2025-07-17T09:30:00Z'
  },
  {
    id: 'SH006',
    shipmentId: 'SH006',
    origin: 'Vienna, Austria',
    destination: 'Prague, Czech Republic',
    eta: '2025-07-21',
    status: 'Pending',
    FF: 'Yusen',
    currentLocation: 'Vienna, Austria',
    modeOfTransport: 'Truck',
    packagingType: 'Thermal Blanket',
    logger_data: [],
    totalAlarms: 0,
    RCAS: RCASStatus.NOT_STARTED,
    lastSeen: null
  },
  {
    id: 'SH007',
    shipmentId: 'SH007',
    origin: 'Helsinki, Finland',
    destination: 'Tallinn, Estonia',
    eta: '2025-07-18',
    status: 'In Transit',
    FF: 'Geodis',
    currentLocation: 'Ferry - Baltic Sea',
    modeOfTransport: 'Ferry',
    packagingType: 'Insulated Container',
    logger_data: [
      {
        loggerId: 'LG-1050',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-15T04:00:00Z',
        loggerEnded: null,
        alarms: 4,
        rootCauseAnalysis: RootCauseAnalysis.REFRIGERATOR_BROKEN
      },
      {
        loggerId: 'LG-1051',
        loggerType: 'Humidity',
        loggerStarted: '2025-07-15T04:00:00Z',
        loggerEnded: null,
        alarms: 2,
        rootCauseAnalysis: RootCauseAnalysis.UNDER_INVESTIGATION
      }
    ],
    totalAlarms: 6,
    RCAS: RCASStatus.IN_PROGRESS,
    lastSeen: '2025-07-15T18:00:00Z'
  },
  {
    id: 'SH008',
    shipmentId: 'SH008',
    origin: 'London, UK',
    destination: 'Dublin, Ireland',
    eta: '2025-07-20',
    status: 'Delayed',
    FF: 'DHL',
    currentLocation: 'Liverpool, UK',
    modeOfTransport: 'Ferry',
    packagingType: 'Cold Chain Pallet',
    logger_data: [
      {
        loggerId: 'LG-1060',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-13T14:00:00Z',
        loggerEnded: null,
        alarms: 1,
        rootCauseAnalysis: RootCauseAnalysis.LOADING_SPIKE
      }
    ],
    totalAlarms: 1,
    RCAS: RCASStatus.CLOSED,
    lastSeen: '2025-07-15T12:15:00Z'
  },
  {
    id: 'SH009',
    shipmentId: 'SH009',
    origin: 'Warsaw, Poland',
    destination: 'Budapest, Hungary',
    eta: '2025-07-22',
    status: 'In Transit',
    FF: 'Yusen',
    currentLocation: 'Krakow, Poland',
    modeOfTransport: 'Truck',
    packagingType: 'Thermal Blanket',
    logger_data: [
      {
        loggerId: 'LG-1070',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-14T16:00:00Z',
        loggerEnded: null,
        alarms: 0,
        rootCauseAnalysis: null
      },
      {
        loggerId: 'LG-1071',
        loggerType: 'Shock',
        loggerStarted: '2025-07-14T16:00:00Z',
        loggerEnded: null,
        alarms: 3,
        rootCauseAnalysis: RootCauseAnalysis.UNDER_INVESTIGATION
      }
    ],
    totalAlarms: 3,
    RCAS: RCASStatus.IN_PROGRESS,
    lastSeen: '2025-07-15T20:30:00Z'
  },
  {
    id: 'SH010',
    shipmentId: 'SH010',
    origin: 'Brussels, Belgium',
    destination: 'Luxembourg City, Luxembourg',
    eta: '2025-07-16',
    status: 'Delivered',
    FF: 'Geodis',
    currentLocation: 'Luxembourg City, Luxembourg',
    modeOfTransport: 'Van',
    packagingType: 'Insulated Box',
    logger_data: [
      {
        loggerId: 'LG-1080',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-15T08:00:00Z',
        loggerEnded: '2025-07-16T11:00:00Z',
        alarms: 0,
        rootCauseAnalysis: null
      }
    ],
    totalAlarms: 0,
    RCAS: RCASStatus.NOT_STARTED,
    lastSeen: '2025-07-16T11:00:00Z'
  },
  {
    id: 'SH011',
    shipmentId: 'SH011',
    origin: 'Milan, Italy',
    destination: 'Nice, France',
    eta: '2025-07-19',
    status: 'In Transit',
    FF: 'DHL',
    currentLocation: 'Turin, Italy',
    modeOfTransport: 'Truck',
    packagingType: 'Cold Chain Pallet',
    logger_data: [
      {
        loggerId: 'LG-1090',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-14T10:00:00Z',
        loggerEnded: null,
        alarms: 2,
        rootCauseAnalysis: RootCauseAnalysis.LOADING_SPIKE
      },
      {
        loggerId: 'LG-1091',
        loggerType: 'Humidity',
        loggerStarted: '2025-07-14T10:00:00Z',
        loggerEnded: null,
        alarms: 1,
        rootCauseAnalysis: RootCauseAnalysis.UNDER_INVESTIGATION
      },
      {
        loggerId: 'LG-1092',
        loggerType: 'Shock',
        loggerStarted: '2025-07-14T10:00:00Z',
        loggerEnded: null,
        alarms: 0,
        rootCauseAnalysis: null
      }
    ],
    totalAlarms: 3,
    RCAS: RCASStatus.IN_PROGRESS,
    lastSeen: '2025-07-15T15:45:00Z'
  },
  {
    id: 'SH012',
    shipmentId: 'SH012',
    origin: 'Athens, Greece',
    destination: 'Sofia, Bulgaria',
    eta: '2025-07-23',
    status: 'Pending',
    FF: 'Yusen',
    currentLocation: 'Athens, Greece',
    modeOfTransport: 'Truck',
    packagingType: 'Thermal Blanket',
    logger_data: [],
    totalAlarms: 0,
    RCAS: RCASStatus.NOT_STARTED,
    lastSeen: null
  },
  {
    id: 'SH013',
    shipmentId: 'SH013',
    origin: 'Barcelona, Spain',
    destination: 'Marseille, France',
    eta: '2025-07-18',
    status: 'Delivered',
    FF: 'Geodis',
    currentLocation: 'Marseille, France',
    modeOfTransport: 'Truck',
    packagingType: 'Insulated Container',
    logger_data: [
      {
        loggerId: 'LG-1100',
        loggerType: 'Temperature',
        loggerStarted: '2025-07-16T07:00:00Z',
        loggerEnded: '2025-07-18T14:30:00Z',
        alarms: 1,
        rootCauseAnalysis: RootCauseAnalysis.LOADING_SPIKE
      }
    ],
    totalAlarms: 1,
    RCAS: RCASStatus.CLOSED,
    lastSeen: '2025-07-18T14:30:00Z'
  }
];
