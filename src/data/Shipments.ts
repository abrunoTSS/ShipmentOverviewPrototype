import { RCASStatus, RootCauseAnalysis } from '../types';
import type { Shipment } from '../types';

export const shipments: Shipment[] = [
     {
        shipmentId: "SH001",
        origin: "Stockholm, Sweden",
        destination: "Berlin, Germany",
        eta: "2025-07-20",
        status: "In Transit",
        loggers: 5,
        freightForwarder: "Geodis",
        currentLocation: "53°34'31.15N, 10°05'5.22E",
        modeOfTransport: "Truck",
        packagingType: "Insulated Box",
        alarms: 0,
        events: 0,
        rcas: "N/A",
        loggerData: [
          {
            loggerId: "LG-1001",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "N/A",
            humidity: "N/A",
            alarms: 0,
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            events: [],
            productDetails: {
              prodfilename: "Insulin-3",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 degrees celcius",
              lowThreshold: "2 degrees celcius"
            }
          }
        ]
      },
      {
        shipmentId: "SH002",
        origin: "Macclesfield, UK",
        destination: "Tokyo, Japan",
        eta: "2025-07-20",
        status: "In Transit",
        loggers: 2,
        freightForwarder: "Geodis",
        currentLocation: "53°34'31.15N, 10°05'5.22E",
        modeOfTransport: "Air",
        packagingType: "Insulated Box",
        alarms: 4,
        events: 4,
        rcas: "RCASStatus.NOT_STARTED",
        loggerData: [
          {
            loggerId: "SENTRY-1002",
            loggerType: "Sentry",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "6°C",
            humidity: "40%",
            alarms: [
              {
                alarmId: 1,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1 part A - destination before excursion",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 08:30",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 09:00",
                    departedTime: "2025-07-15 10:15",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-15 09:00",
                      duration: "1h 15m",
                      highestHumidity: "75%",
                      lowestHumidity: "55%",
                      averageHumidity: "65%",
                      graphData: [
                        { time: '09:00', temperature: 15, humidity: 60 },
                        { time: '09:15', temperature: 22, humidity: 66 },
                        { time: '09:30', temperature: 25, humidity: 72 },
                        { time: '09:45', temperature: 21, humidity: 70 },
                        { time: '10:00', temperature: 15, humidity: 62 },
                        { time: '10:15', temperature: 5, humidity: 55 },
                      ]
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-07-15 16:30",
                    status: "Completed",
                    transportMode: "Plane",
                    vehicleNumber: "F12345678",
                    weatherConditions: "Expected: Partly cloudy, 28°C"
                  }
                ]
              },
              {
                alarmId: 2,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1",
                    location: "Amsterdam Airport Hub",
                    arrivalTime: "2025-07-17 07:00",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-07-17 09:00",
                    departedTime: "2025-07-17 11:00",
                    status: "Pending",
                    transportMode: "Plane",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-17 09:30",
                      duration: "1h 15m",
                      highestHumidity: "72%",
                      lowestHumidity: "60%",
                      averageHumidity: "68%",
                      graphData: [
                        { time: '09:30', temperature: 18, humidity: 62 },
                        { time: '09:45', temperature: 24, humidity: 68 },
                        { time: '10:00', temperature: 25, humidity: 72 },
                        { time: '10:15', temperature: 20, humidity: 65 },
                        { time: '10:30', temperature: 10, humidity: 60 },
                      ]
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-07-18 03:00",
                    status: "Pending",
                    transportMode: "N/A",
                    vehicleNumber: "N/A",
                    weatherConditions: "Expected: Partly cloudy, 38°C"
                  }
                ]
              }
            ],
            rootCauseAnalysis: "Not Started",
            rootCauseAnalysisStatusDetails: null,
            lastSeen: "2025-07-17 10:00",
            productDetails: {
              prodfilename: "Insulin-2",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 degrees celcius",
              lowThreshold: "2 degrees celcius",
              humidityProfile: "standard",
              highHumidityThreshold: "60%",
              lowHumidityThreshold: "30%"
            }
          },
          {
            loggerId: "SENTINEL-1002",
            loggerType: "Sentinel",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "6°C",
            humidity: "40%",
            alarms: [
              {
                alarmId: 1,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1 part A - destination before excursion",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 08:30",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 09:00",
                    departedTime: "2025-07-15 10:15",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-15 09:00",
                      duration: "1h 15m",
                      highestHumidity: "78%",
                      lowestHumidity: "58%",
                      averageHumidity: "67%",
                      graphData: [
                        { time: '09:00', temperature: 16, humidity: 62 },
                        { time: '09:15', temperature: 23, humidity: 68 },
                        { time: '09:30', temperature: 25, humidity: 78 },
                        { time: '09:45', temperature: 20, humidity: 71 },
                        { time: '10:00', temperature: 14, humidity: 64 },
                        { time: '10:15', temperature: 6, humidity: 58 },
                      ]
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-07-15 16:30",
                    status: "Completed",
                    transportMode: "Plane",
                    vehicleNumber: "F12345678",
                    weatherConditions: "Expected: Partly cloudy, 28°C"
                  }
                ]
              },
              {
                alarmId: 2,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1",
                    location: "Amsterdam Airport Hub",
                    arrivalTime: "2025-07-17 07:00",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-07-17 09:00",
                    departedTime: "2025-07-17 11:00",
                    status: "Pending",
                    transportMode: "Plane",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-17 09:30",
                      duration: "1h 15m",
                      highestHumidity: "71%",
                      lowestHumidity: "62%",
                      averageHumidity: "66%",
                      graphData: [
                        { time: '09:30', temperature: 19, humidity: 63 },
                        { time: '09:45', temperature: 23, humidity: 69 },
                        { time: '10:00', temperature: 25, humidity: 71 },
                        { time: '10:15', temperature: 21, humidity: 67 },
                        { time: '10:30', temperature: 11, humidity: 62 },
                      ]
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-07-18 03:00",
                    status: "Pending",
                    transportMode: "N/A",
                    vehicleNumber: "N/A",
                    weatherConditions: "Expected: Partly cloudy, 38°C"
                  }
                ]
              }
            ],
            rootCauseAnalysis: "Not Started",
            rootCauseAnalysisStatusDetails: null,
            lastSeen: "2025-07-17 10:00",
            productDetails: {
              prodfilename: "Insulin-2",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 degrees celcius",
              lowThreshold: "2 degrees celcius",
              humidityProfile: "standard",
              highHumidityThreshold: "60%",
              lowHumidityThreshold: "30%"
            }
          }
        ]
      },
  {
        shipmentId: "SH003",
        origin: "Stockholm, Sweden",
        destination: "Berlin, Germany",
        eta: "2025-07-20",
        status: "Delivered",
        loggers: 1,
        freightForwarder: "DHL",
        currentLocation: "n/a",
        modeOfTransport: "Air",
        packagingType: "Insulated Box",
        alarms: 0,
        events: 0,
        rcas: "N/A",
        loggerData: [
          {
            loggerId: "LG-1001",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "N/A",
            humidity: "N/A",
            alarms: 0,
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            events: [],
            productDetails: {
              prodfilename: "Insulin-3",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 degrees celcius",
              lowThreshold: "2 degrees celcius"
            }
          }
        ]
      },
      {
        shipmentId: "SH004",
        origin: "Macclesfield, UK",
        destination: "Tokyo, Japan",
        eta: "2025-07-20",
        status: "Delivered",
        loggers: 2,
        freightForwarder: "DHL",
        currentLocation: "n/a",
        modeOfTransport: "Air",
        packagingType: "Insulated Box",
        alarms: 4,
        events: 4,
        rcas: "RCASStatus.NOT_STARTED",
        loggerData: [
          {
            loggerId: "WL-1002",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-20T08:00:00Z",
            temperature: "n/a",
            alarms: [
              {
                alarmId: 1,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1 part A - destination before excursion",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 08:30",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 09:00",
                    departedTime: "2025-07-15 10:15",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-15 09:00",
                      duration: "1h 15m",
                      highestHumidity: "75%",
                      lowestHumidity: "55%",
                      averageHumidity: "65%"
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-07-15 16:30",
                    status: "Completed",
                    transportMode: "Plane",
                    vehicleNumber: "F12345678",
                    weatherConditions: "Expected: Partly cloudy, 28°C"
                  }
                ]
              },
              {
                alarmId: 2,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1",
                    location: "Amsterdam Airport Hub",
                    arrivalTime: "2025-07-17 07:00",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-07-17 09:00",
                    departedTime: "2025-07-17 11:00",
                    status: "Pending",
                    transportMode: "Plane",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-17 09:30",
                      duration: "1h 15m",
                      highestHumidity: "72%",
                      lowestHumidity: "60%",
                      averageHumidity: "68%"
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-07-18 03:00",
                    status: "Pending",
                    transportMode: "N/A",
                    vehicleNumber: "N/A",
                    weatherConditions: "Expected: Partly cloudy, 38°C"
                  }
                ]
              }
            ],
            rootCauseAnalysis: "Not Started",
            rootCauseAnalysisStatusDetails: null,
            lastSeen: "2025-07-17 10:00",
            productDetails: {
              prodfilename: "Insulin-2",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 degrees celcius",
              lowThreshold: "2 degrees celcius",
            }
          },
          {
            loggerId: "WL-1002",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-20T08:00:00Z",
            temperature: "n/a",
            alarms: [
              {
                alarmId: 1,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1 part A - destination before excursion",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 08:30",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 09:00",
                    departedTime: "2025-07-15 10:15",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-15 09:00",
                      duration: "1h 15m",
                      highestHumidity: "75%",
                      lowestHumidity: "55%",
                      averageHumidity: "65%"
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-07-15 16:30",
                    status: "Completed",
                    transportMode: "Plane",
                    vehicleNumber: "F12345678",
                    weatherConditions: "Expected: Partly cloudy, 28°C"
                  }
                ]
              },
              {
                alarmId: 2,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1",
                    location: "Amsterdam Airport Hub",
                    arrivalTime: "2025-07-17 07:00",
                    status: "Completed",
                    transportMode: "Truck",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-07-17 09:00",
                    departedTime: "2025-07-17 11:00",
                    status: "Pending",
                    transportMode: "Plane",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-17 09:30",
                      duration: "1h 15m",
                      highestHumidity: "72%",
                      lowestHumidity: "60%",
                      averageHumidity: "68%"
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-07-18 03:00",
                    status: "Pending",
                    transportMode: "N/A",
                    vehicleNumber: "N/A",
                    weatherConditions: "Expected: Partly cloudy, 38°C"
                  }
                ]
              }
            ],
            rootCauseAnalysis: "Not Started",
            rootCauseAnalysisStatusDetails: null,
            lastSeen: "2025-07-17 10:00",
            productDetails: {
              prodfilename: "Insulin-2",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 degrees celcius",
              lowThreshold: "2 degrees celcius",
            }
          }
        ]
      }
];