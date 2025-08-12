import { RCASStatus, RootCauseAnalysis } from '../types';
import type { Shipment } from '../types';

// Export the shipments
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
        loggerType: 'sentry',
        loggerStarted: '2025-07-10T08:00:00Z',
        loggerEnded: null,
        alarms: 0,
        rootCauseAnalysis: null,
        rootCauseAnalysisStatusDetails: null,
        enrichedEvent: {
          alarmType: null,
          events: [
            {
              eventId: 1,
              alarmType: null,
              timeline: [
                {
                  title: 'Berlin',
                  subtitle: 'Departed: 2025-07-15 08:00',
                  dot: 'green',
                  extraInfo: { time: '08:00', location: 'Berlin, Germany' },
                  status: 'Completed',
                  timestamp: '2025-07-15 08:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'DE BER 789',
                  weatherConditions: 'Sunny, 22°C'
                },
                {
                  title: 'Hamburg Hub - Transfer',
                  subtitle: 'Arrived: 2025-07-15 14:30',
                  dot: 'blue',
                  extraInfo: { time: '14:30', location: 'Hamburg, Germany' },
                  status: 'In Transit',
                  timestamp: '2025-07-15 14:30',
                  transportMode: 'Truck',
                  vehicleNumber: 'DE HAM 456',
                  weatherConditions: 'Overcast, 18°C'
                },
                {
                  title: 'Amsterdam',
                  subtitle: 'Expected: 2025-07-16 10:00',
                  dot: 'gray',
                  extraInfo: { time: '10:00', location: 'Amsterdam, Netherlands' },
                  status: 'Pending',
                  timestamp: '2025-07-16 10:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'NL AMS 123',
                  weatherConditions: 'Expected: Partly cloudy, 20°C'
                }
              ]
            }
          ]
        }
      },
      {
        loggerId: 'LG-1002',
        loggerType: 'sentinel',
        loggerStarted: '2025-07-10T08:00:00Z',
        loggerEnded: null,
        alarms: 0,
        rootCauseAnalysis: null,
        rootCauseAnalysisStatusDetails: null,
        enrichedEvent: {
          alarmType: 'Humidity Monitoring',
          events: [
            {
              eventId: 1,
              alarmType: null,
              timeline: [
                {
                  title: 'Berlin',
                  subtitle: 'Departed: 2025-07-15 08:00',
                  dot: 'green',
                  extraInfo: { time: '08:00', location: 'Berlin, Germany' },
                  status: 'Completed',
                  timestamp: '2025-07-15 08:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'DE BER 789',
                  weatherConditions: 'Sunny, 22°C'
                },
                {
                  title: 'Hamburg Hub - Transfer',
                  subtitle: 'Arrived: 2025-07-15 14:30',
                  dot: 'blue',
                  extraInfo: { time: '14:30', location: 'Hamburg, Germany' },
                  status: 'In Transit',
                  timestamp: '2025-07-15 14:30',
                  transportMode: 'Truck',
                  vehicleNumber: 'DE HAM 456',
                  weatherConditions: 'Overcast, 18°C'
                },
                {
                  title: 'Amsterdam',
                  subtitle: 'Expected: 2025-07-16 10:00',
                  dot: 'gray',
                  extraInfo: { time: '10:00', location: 'Amsterdam, Netherlands' },
                  status: 'Pending',
                  timestamp: '2025-07-16 10:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'NL AMS 123',
                  weatherConditions: 'Expected: Partly cloudy, 20°C'
                }
              ]
            }
          ]
        }
      }
    ],
    totalAlarms: 0,
    RCAS: RCASStatus.NOT_STARTED,
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
        loggerType: 'sentry',
        loggerStarted: '2025-07-09T05:00:00Z',
        loggerEnded: '2025-07-17T16:00:00Z',
        alarms: 3,
        rootCauseAnalysis: RootCauseAnalysis.UNDER_INVESTIGATION,
        rootCauseAnalysisStatusDetails: {
          status: RootCauseAnalysis.UNDER_INVESTIGATION,
          details: 'Investigation in progress for temperature excursion',
          UTCDateStarted: '2025-07-17T14:30:00Z',
          evaluatedBy: 'John Doe',
          type: 'Temperature Excursion',
          evaluationType: 'Initial Assessment',
          primaryRootCause: 'Cooling system failure',
          secondaryRootCause: 'Improper packaging',
          reason: 'Temperature exceeded threshold for more than 2 hours'
        },
        enrichedEvent: {
          alarmType: 'Temperature Excursion',
          events: [
            {
              eventId: 1,
              alarmType: 'Temperature',
              timeline: [
                {
                  title: 'Zurich',
                  subtitle: 'Departed: 2025-06-06 07:00',
                  dot: 'green',
                  extraInfo: { time: '07:00', location: 'Zurich, Switzerland' },
                  status: 'Completed',
                  timestamp: '2025-06-06 07:00'
                },
                {
                  title: 'Milan Airport - Transfer',
                  subtitle: 'Arrived: 2025-06-06 12:00',
                  dot: 'red',
                  extraInfo: { time: '12:00', location: 'Milan Airport' },
                  status: 'Alert',
                  timestamp: '2025-06-06 12:00',
                  transportMode: 'Road',
                  vehicleNumber: 'IT MN1 23E',
                  weatherConditions: 'Sunny, 28°C',
                  excursionDetails: {
                    highest: '25°C',
                    lowest: '5°C',
                    average: '21°C',
                    startTime: '05-07-2025 09:30',
                    duration: '4h 15m',
                    maxDeviation: '+10.2°C',
                    averageDeviation: '+8.7°C',
                  }
                },
                {
                  title: 'Rome',
                  subtitle: 'Arrived: 2025-06-14 20:00',
                  dot: 'green',
                  extraInfo: { time: '20:00', location: 'Rome, Italy' },
                  status: 'Completed',
                  timestamp: '2025-06-14 20:00'
                }
              ]
            },
            {
              eventId: 2,
              alarmType: 'Temperature',
              timeline: [
                {
                  title: 'Zurich',
                  subtitle: 'Departed: 2025-06-06 07:00',
                  dot: 'green',
                  extraInfo: { time: '07:00', location: 'Zurich, Switzerland' },
                  status: 'Completed',
                  timestamp: '2025-06-06 07:00'
                },
                {
                  title: 'Frankfurt Hub - Transfer',
                  subtitle: 'Arrived: 2025-06-06 15:30',
                  dot: 'red',
                  extraInfo: { time: '15:30', location: 'Frankfurt Hub' },
                  status: 'Alert',
                  timestamp: '2025-06-06 15:30',
                  transportMode: 'Air',
                  vehicleNumber: 'LH 441',
                  weatherConditions: 'Cloudy, 22°C',
                  excursionDetails: {
                    highest: '28°C',
                    lowest: '3°C',
                    average: '19°C',
                    startTime: '06-06-2025 14:15',
                    duration: '2h 45m',
                    maxDeviation: '+12.5°C',
                    averageDeviation: '+9.8°C',
                  }
                },
                {
                  title: 'Rome',
                  subtitle: 'Arrived: 2025-06-14 20:00',
                  dot: 'green',
                  extraInfo: { time: '20:00', location: 'Rome, Italy' },
                  status: 'Completed',
                  timestamp: '2025-06-14 20:00'
                }
              ]
            },
            {
              eventId: 3,
              alarmType: 'Temperature',
              timeline: [
                {
                  title: 'Zurich',
                  subtitle: 'Departed: 2025-06-06 07:00',
                  dot: 'green',
                  extraInfo: { time: '07:00', location: 'Zurich, Switzerland' },
                  status: 'Completed',
                  timestamp: '2025-06-06 07:00'
                },
                {
                  title: 'Bologna Distribution - Transfer',
                  subtitle: 'Arrived: 2025-06-07 09:15',
                  dot: 'red',
                  extraInfo: { time: '09:15', location: 'Bologna Distribution Center' },
                  status: 'Alert',
                  timestamp: '2025-06-07 09:15',
                  transportMode: 'Truck',
                  vehicleNumber: 'IT BO 789Z',
                  weatherConditions: 'Rainy, 18°C',
                  excursionDetails: {
                    highest: '24°C',
                    lowest: '7°C',
                    average: '16°C',
                    startTime: '06-07-2025 08:00',
                    duration: '1h 30m',
                    maxDeviation: '+8.9°C',
                    averageDeviation: '+6.2°C',
                  }
                },
                {
                  title: 'Rome',
                  subtitle: 'Arrived: 2025-06-14 20:00',
                  dot: 'green',
                  extraInfo: { time: '20:00', location: 'Rome, Italy' },
                  status: 'Completed',
                  timestamp: '2025-06-14 20:00'
                }
              ]
            }
          ]
        }
      },
      {
        loggerId: 'LG-1011',
        loggerType: 'web logger 2',
        loggerStarted: '2025-07-09T05:00:00Z',
        loggerEnded: '2025-07-17T16:00:00Z',
        alarms: 1,
        rootCauseAnalysis: RootCauseAnalysis.REFRIGERATOR_BROKEN,
        rootCauseAnalysisStatusDetails: {
          status: RootCauseAnalysis.REFRIGERATOR_BROKEN,
          details: 'Refrigerator compressor failure detected',
          UTCDateStarted: '2025-07-17T10:15:00Z',
          evaluatedBy: 'Jane Smith',
          type: 'Equipment Failure',
          evaluationType: 'Confirmed',
          primaryRootCause: 'Compressor failure',
          secondaryRootCause: 'Maintenance overdue',
          reason: 'Compressor stopped functioning during transit'
        },
        enrichedEvent: {
          alarmType: 'Shock Detection',
          events: [
            {
              eventId: 1,
              alarmType: 'Temperature',
              timeline: [
                {
                  title: 'Zurich',
                  subtitle: 'Departed: 2025-06-13 05:00',
                  dot: 'green',
                  extraInfo: { time: '05:00', location: 'Zurich, Switzerland' },
                  status: 'Completed',
                  timestamp: '2025-06-13 05:00',
                  transportMode: 'Air',
                  vehicleNumber: 'LX 8456',
                  weatherConditions: 'Clear, 18°C'
                },
                {
                  title: 'Heathrow Airport - Transfer',
                  subtitle: 'Arrived: 2025-06-13 06:30',
                  dot: 'red',
                  extraInfo: { time: '06:30', location: 'London Heathrow, UK' },
                  status: 'Alert',
                  timestamp: '2025-06-13 06:30',
                  transportMode: 'Air',
                  vehicleNumber: 'BA 2847',
                  weatherConditions: 'Overcast, 15°C',
                  excursionDetails: {
                    highest: '9.2G',
                    lowest: '0.1G',
                    average: '6.8G',
                    startTime: '13-06-2025 06:28',
                    duration: '2 seconds',
                    maxDeviation: '9.2G',
                    averageDeviation: '6.8G',
                  }
                },
                {
                  title: 'Frankfurt Hub - Transfer',
                  subtitle: 'Arrived: 2025-06-13 09:15',
                  dot: 'blue',
                  extraInfo: { time: '09:15', location: 'Frankfurt, Germany' },
                  status: 'In Transit',
                  timestamp: '2025-06-13 09:15',
                  transportMode: 'Air',
                  vehicleNumber: 'LH 4567',
                  weatherConditions: 'Partly cloudy, 22°C'
                },
                {
                  title: 'Rome',
                  subtitle: 'Arrived: 2025-06-13 12:00',
                  dot: 'green',
                  extraInfo: { time: '12:00', location: 'Rome, Italy' },
                  status: 'Completed',
                  timestamp: '2025-06-13 12:00',
                  transportMode: 'Air',
                  vehicleNumber: 'AZ 1234',
                  weatherConditions: 'Sunny, 28°C'
                }
              ]
            }
          ]
        }
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
        loggerType: 'sentry',
        loggerStarted: '2025-07-13T10:00:00Z',
        loggerEnded: null,
        alarms: 3,
        rootCauseAnalysis: RootCauseAnalysis.REFRIGERATOR_BROKEN,
        rootCauseAnalysisStatusDetails: {
          status: RootCauseAnalysis.REFRIGERATOR_BROKEN,
          details: 'Refrigerator compressor failure detected',
          UTCDateStarted: '2025-07-15T10:15:00Z',
          evaluatedBy: 'Jane Smith',
          type: 'Equipment Failure',
          evaluationType: 'Confirmed',
          primaryRootCause: 'Compressor failure',
          secondaryRootCause: 'Maintenance overdue',
          reason: 'Compressor stopped functioning during transit'
        },
        enrichedEvent: {
          alarmType: 'Temperature Excursion',
          events: [
            {
              eventId: 1,
              alarmType: 'Temperature',
              timeline: [
                {
                  title: 'Copenhagen',
                  subtitle: 'Departed: 2025-07-13 10:00',
                  dot: 'green',
                  extraInfo: { time: '10:00', location: 'Copenhagen, Denmark' },
                  status: 'Completed',
                  timestamp: '2025-07-13 10:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'DK CPH 456',
                  weatherConditions: 'Cloudy, 15°C'
                },
                {
                  title: 'Gothenburg - Transfer',
                  subtitle: 'Arrived: 2025-07-13 15:00',
                  dot: 'red',
                  extraInfo: { time: '15:00', location: 'Gothenburg, Sweden' },
                  status: 'Alert',
                  timestamp: '2025-07-13 15:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'SE GOT 789',
                  weatherConditions: 'Rainy, 12°C',
                  excursionDetails: {
                    highest: '22°C',
                    lowest: '2°C',
                    average: '18°C',
                    startTime: '13-07-2025 13:20',
                    duration: '1h 40m',
                    maxDeviation: '+17.4°C',
                    averageDeviation: '+13.8°C',
                  }
                },
                {
                  title: 'Oslo',
                  subtitle: 'Arrived: 2025-07-13 20:30',
                  dot: 'green',
                  extraInfo: { time: '20:30', location: 'Oslo, Norway' },
                  status: 'Completed',
                  timestamp: '2025-07-13 20:30',
                  transportMode: 'Truck',
                  vehicleNumber: 'NO OSL 123',
                  weatherConditions: 'Clear, 18°C'
                }
              ]
            },
            {
              eventId: 2,
              alarmType: 'Temperature',
              timeline: [
                {
                  title: 'Copenhagen',
                  subtitle: 'Departed: 2025-07-13 10:00',
                  dot: 'green',
                  extraInfo: { time: '10:00', location: 'Copenhagen, Denmark' },
                  status: 'Completed',
                  timestamp: '2025-07-13 10:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'DK CPH 456',
                  weatherConditions: 'Cloudy, 15°C'
                },
                {
                  title: 'Malmö Hub - Transfer',
                  subtitle: 'Arrived: 2025-07-13 12:45',
                  dot: 'red',
                  extraInfo: { time: '12:45', location: 'Malmö, Sweden' },
                  status: 'Alert',
                  timestamp: '2025-07-13 12:45',
                  transportMode: 'Ferry',
                  vehicleNumber: 'SE MAL 445',
                  weatherConditions: 'Windy, 14°C',
                  excursionDetails: {
                    highest: '26°C',
                    lowest: '4°C',
                    average: '16°C',
                    startTime: '13-07-2025 11:30',
                    duration: '2h 15m',
                    maxDeviation: '+19.2°C',
                    averageDeviation: '+14.5°C',
                  }
                },
                {
                  title: 'Oslo',
                  subtitle: 'Arrived: 2025-07-13 20:30',
                  dot: 'green',
                  extraInfo: { time: '20:30', location: 'Oslo, Norway' },
                  status: 'Completed',
                  timestamp: '2025-07-13 20:30',
                  transportMode: 'Truck',
                  vehicleNumber: 'NO OSL 123',
                  weatherConditions: 'Clear, 18°C'
                }
              ]
            },
            {
              eventId: 3,
              alarmType: 'Temperature',
              timeline: [
                {
                  title: 'Copenhagen',
                  subtitle: 'Departed: 2025-07-13 10:00',
                  dot: 'green',
                  extraInfo: { time: '10:00', location: 'Copenhagen, Denmark' },
                  status: 'Completed',
                  timestamp: '2025-07-13 10:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'DK CPH 456',
                  weatherConditions: 'Cloudy, 15°C'
                },
                {
                  title: 'Border Checkpoint - Delay',
                  subtitle: 'Arrived: 2025-07-13 17:20',
                  dot: 'red',
                  extraInfo: { time: '17:20', location: 'Sweden-Norway Border' },
                  status: 'Alert',
                  timestamp: '2025-07-13 17:20',
                  transportMode: 'Truck',
                  vehicleNumber: 'NO OSL 123',
                  weatherConditions: 'Foggy, 10°C',
                  excursionDetails: {
                    highest: '20°C',
                    lowest: '6°C',
                    average: '14°C',
                    startTime: '13-07-2025 16:45',
                    duration: '45m',
                    maxDeviation: '+15.1°C',
                    averageDeviation: '+11.2°C',
                  }
                },
                {
                  title: 'Oslo',
                  subtitle: 'Arrived: 2025-07-13 20:30',
                  dot: 'green',
                  extraInfo: { time: '20:30', location: 'Oslo, Norway' },
                  status: 'Completed',
                  timestamp: '2025-07-13 20:30',
                  transportMode: 'Truck',
                  vehicleNumber: 'NO OSL 123',
                  weatherConditions: 'Clear, 18°C'
                }
              ]
            }
          ]
        }
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
        loggerType: 'sentry',
        loggerStarted: '2025-07-14T06:00:00Z',
        loggerEnded: null,
        alarms: 3,
        rootCauseAnalysis: RootCauseAnalysis.LOADING_SPIKE,
        rootCauseAnalysisStatusDetails: {
          status: RootCauseAnalysis.LOADING_SPIKE,
          details: 'Temperature spike during loading detected',
          UTCDateStarted: '2025-07-15T08:30:00Z',
          evaluatedBy: 'Mike Johnson',
          type: 'Loading Issue',
          evaluationType: 'Under Investigation',
          primaryRootCause: 'Extended loading time',
          secondaryRootCause: 'High ambient temperature',
          reason: 'Shipment left outside during loading for 45 minutes'
        },
        enrichedEvent: {
          alarmType: 'Temperature Alert',
          events: [
            {
              eventId: 1,
              alarmType: 'Temperature',
              timeline: [
                {
                  title: 'Amsterdam',
                  subtitle: 'Departed: 2025-07-14 06:00',
                  dot: 'green',
                  extraInfo: { time: '06:00', location: 'Amsterdam, Netherlands' },
                  status: 'Completed',
                  timestamp: '2025-07-14 06:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'NL AMS 789',
                  weatherConditions: 'Rainy, 16°C'
                },
                {
                  title: 'Brussels Hub - Transfer',
                  subtitle: 'Arrived: 2025-07-14 08:00',
                  dot: 'red',
                  extraInfo: { time: '08:00', location: 'Brussels, Belgium' },
                  status: 'Alert',
                  timestamp: '2025-07-14 08:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'BE BRU 456',
                  weatherConditions: 'Overcast, 14°C',
                  excursionDetails: {
                    highest: '18°C',
                    lowest: '2°C',
                    average: '12°C',
                    startTime: '14-07-2025 07:45',
                    duration: '12 minutes',
                    maxDeviation: '+10.2°C',
                    averageDeviation: '+7.8°C',
                  }
                },
                {
                  title: 'Paris',
                  subtitle: 'Arrived: 2025-07-14 12:00',
                  dot: 'green',
                  extraInfo: { time: '12:00', location: 'Paris, France' },
                  status: 'Completed',
                  timestamp: '2025-07-14 12:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'FR PAR 123',
                  weatherConditions: 'Sunny, 22°C'
                }
              ]
            }
          ]
        }
      },
      {
        loggerId: 'LG-1031',
        loggerType: 'web logger 2',
        loggerStarted: '2025-07-14T06:00:00Z',
        loggerEnded: null,
        alarms: 0,
        rootCauseAnalysis: null,
        rootCauseAnalysisStatusDetails: null,
        enrichedEvent: {
          alarmType: 'Shock Monitoring',
          events: [
            {
              eventId: 1,
              alarmType: null,
              timeline: [
                {
                  title: 'Amsterdam',
                  subtitle: 'Departed: 2025-07-14 06:00',
                  dot: 'green',
                  extraInfo: { time: '06:00', location: 'Amsterdam, Netherlands' },
                  status: 'Completed',
                  timestamp: '2025-07-14 06:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'NL AMS 789',
                  weatherConditions: 'Rainy, 16°C'
                },
                {
                  title: 'Brussels Hub - Transfer',
                  subtitle: 'Arrived: 2025-07-14 08:00',
                  dot: 'blue',
                  extraInfo: { time: '08:00', location: 'Brussels, Belgium' },
                  status: 'In Transit',
                  timestamp: '2025-07-14 08:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'BE BRU 456',
                  weatherConditions: 'Overcast, 14°C'
                },
                {
                  title: 'Paris',
                  subtitle: 'Expected: 2025-07-14 12:00',
                  dot: 'gray',
                  extraInfo: { time: '12:00', location: 'Paris, France' },
                  status: 'Pending',
                  timestamp: '2025-07-14 12:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'FR PAR 123',
                  weatherConditions: 'Expected: Sunny, 22°C'
                }
              ]
            }
          ]
        }
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
        loggerType: 'sentry',
        loggerStarted: '2025-07-12T12:00:00Z',
        loggerEnded: '2025-07-17T09:30:00Z',
        alarms: 0,
        rootCauseAnalysis: null,
        rootCauseAnalysisStatusDetails: null,
        enrichedEvent: {
          alarmType: 'Temperature Monitoring',
          events: [
            {
              eventId: 1,
              alarmType: null,
              timeline: [
                {
                  title: 'Madrid',
                  subtitle: 'Departed: 2025-07-12 12:00',
                  dot: 'green',
                  extraInfo: { time: '12:00', location: 'Madrid, Spain' },
                  status: 'Completed',
                  timestamp: '2025-07-12 12:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'ES MAD 456',
                  weatherConditions: 'Hot, 32°C'
                },
                {
                  title: 'Lisbon',
                  subtitle: 'Arrived: 2025-07-17 09:30',
                  dot: 'green',
                  extraInfo: { time: '09:30', location: 'Lisbon, Portugal' },
                  status: 'Completed',
                  timestamp: '2025-07-17 09:30',
                  transportMode: 'Truck',
                  vehicleNumber: 'PT LIS 789',
                  weatherConditions: 'Mild, 24°C'
                }
              ]
            }
          ]
        }
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
    logger_data: [
      {
        loggerId: 'LG-1050',
        loggerType: 'sentinel',
        loggerStarted: '2025-07-18T09:00:00Z',
        loggerEnded: null,
        alarms: 0,
        rootCauseAnalysis: null,
        rootCauseAnalysisStatusDetails: null,
        enrichedEvent: {
          alarmType: null,
          events: [
            {
              eventId: 1,
              alarmType: null,
              timeline: [
                {
                  title: 'Vienna',
                  subtitle: 'Departed: 2025-07-18 09:00',
                  dot: 'green',
                  extraInfo: { time: '09:00', location: 'Vienna, Austria' },
                  status: 'In Transit',
                  timestamp: '2025-07-18 09:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'AT VIE 123',
                  weatherConditions: 'Sunny, 25°C'
                },
                {
                  title: 'Brno',
                  subtitle: 'Expected: 2025-07-20 11:00',
                  dot: 'gray',
                  extraInfo: { time: '11:00', location: 'Brno, Czech Republic' },
                  status: 'Pending',
                  timestamp: '2025-07-20 11:00',
                  transportMode: 'Truck',
                  vehicleNumber: 'AT VIE 123',
                  weatherConditions: 'Expected: Partly cloudy, 23°C'
                }
              ]
            }
          ]
        }
      }
    ],
    totalAlarms: 0,
    RCAS: RCASStatus.NOT_STARTED,
    lastSeen: null
  },
];
