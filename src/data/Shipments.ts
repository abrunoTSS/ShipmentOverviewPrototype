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
        modeOfTransport: "Road",
        packagingType: "Insulated Box",
        alarms: 0,
        events: 0,
        shipmentCurrentMilestone: [
          {
            type: "origin",
            location: "Stockholm, Sweden",
            status: "Completed"
          },
          {
            type: "milestone",
            location: "Copenhagen, Denmark",
            status: "Completed"
          },
          {
            type: "milestone",
            location: "Hamburg, Germany",
            status: "Current"
          },
          {
            type: "destination",
            location: "Berlin, Germany",
            status: "Pending"
          }
        ],        
        rcas: "n/a",
        loggerData: [
          {
            loggerId: "LG-1001",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "n/a",
         
            alarms: [],
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            productDetails: {
              prodfilename: "Insulin-3",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
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
        rcas: "Not Started",
        shipmentCurrentMilestone: [
          {
            type: "origin",
            location: "Macclesfield, UK",
            status: "Completed"
          },
          {
            type: "milestone",
            location: "Heathrow Airport, UK",
            status: "Completed"
          },
          {
            type: "milestone",
            location: "Amsterdam, Netherlands",
            status: "Current"
          },
          {
            type: "destination",
            location: "Tokyo, Japan",
            status: "Pending"
          }
        ],   
        loggerData: [
          {
            loggerId: "SENTRY-1002",
            loggerType: "Sentry",
            loggerStarted: "2025-07-14T08:00:00Z",
            loggerEnded: "Active",
            temperature: "6°C",
         
            alarms: [
              {
                alarmId: 1,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1 part A - destination before excursion",
                    location: "Macclesfield Loading Hub",
                    arrivalTime: "2025-07-15 06:00",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub",
                    arrivalTime: "2025-07-15 09:00",
                    departedTime: "2025-07-15 10:15",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-15 09:00",
                      duration: "1h 15m",
                    
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-07-15 16:30",
                    status: "Completed",
                    transportMode: "Air",
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
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-07-17 09:00",
                    departedTime: "2025-07-17 11:00",
                    status: "Pending",
                    transportMode: "Air",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-17 09:30",
                      duration: "1h 15m",
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Narita Airport",
                    arrivalTime: "2025-07-18 03:00",
                    status: "Pending",
                    transportMode: "n/a",
                    vehicleNumber: "n/a",
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
              highThreshold: "12 °C",
              lowThreshold: "2 °C",
           
            }
          },
          {
            loggerId: "SENTINEL-1002",
            loggerType: "Sentinel",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "6°C",
         
            alarms: [
              {
                alarmId: 1,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1 part A - destination before excursion",
                    location: "Heathrow Airport Hub",
                    arrivalTime: "2025-07-15 08:30",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub",
                    arrivalTime: "2025-07-15 09:00",
                    departedTime: "2025-07-15 10:15",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-15 09:00",
                      duration: "1h 15m",
                    
                
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-07-15 16:30",
                    status: "Completed",
                    transportMode: "Air",
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
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-07-17 09:00",
                    departedTime: "2025-07-17 11:00",
                    status: "Pending",
                    transportMode: "Air",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-17 09:30",
                      duration: "1h 15m",
                    
                  
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-07-18 03:00",
                    status: "Pending",
                    transportMode: "n/a",
                    vehicleNumber: "n/a",
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
              highThreshold: "12 °C",
              lowThreshold: "2 °C",
           
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
        rcas: "n/a",
        loggerData: [
          {
            loggerId: "LG-1001",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "n/a",
            alarms: 0,
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            events: [],
            productDetails: {
              prodfilename: "Insulin-3",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
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
        rcas: "Not Started",
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
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 09:00",
                    departedTime: "2025-07-15 10:15",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-15 09:00",
                      duration: "1h 15m",
                
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-07-15 16:30",
                    status: "Completed",
                    transportMode: "Air",
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
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-07-17 09:00",
                    departedTime: "2025-07-17 11:00",
                    status: "Pending",
                    transportMode: "Air",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-17 09:30",
                      duration: "1h 15m",
                  
   
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-07-18 03:00",
                    status: "Pending",
                    transportMode: "n/a",
                    vehicleNumber: "n/a",
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
              highThreshold: "12 °C",
              lowThreshold: "2 °C",
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
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-07-15 09:00",
                    departedTime: "2025-07-15 10:15",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-15 09:00",
                      duration: "1h 15m",
                
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-07-15 16:30",
                    status: "Completed",
                    transportMode: "Air",
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
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-07-17 09:00",
                    departedTime: "2025-07-17 11:00",
                    status: "Pending",
                    transportMode: "Air",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-07-17 09:30",
                      duration: "1h 15m",
                  
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-07-18 03:00",
                    status: "Pending",
                    transportMode: "n/a",
                    vehicleNumber: "n/a",
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
              highThreshold: "12 °C",
              lowThreshold: "2 °C",
            }
          }
        ]
      }
,
      {
        shipmentId: "SH006",
        origin: "Macclesfield, UK",
        destination: "Tokyo, Japan",
        eta: "2025-06-20",
        status: "Delivered",
        freightForwarder: "DHL",
        currentLocation: "n/a",
        modeOfTransport: "Air",
        packagingType: "Insulated Box",
        alarms: 4,
        totalAlarms: 4,
        events: 4,
        rcas: "In Progress",
        loggerData: [
          {
            loggerId: "WL-1006A",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-06-10T08:00:00Z",
            loggerEnded: "2025-06-20T08:00:00Z",
            temperature: "n/a",
            alarms: [
              {
                alarmId: 1,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1 part A - destination before excursion",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-06-15 08:30",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-06-15 09:00",
                    departedTime: "2025-06-15 10:15",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-06-15 09:00",
                      duration: "1h 15m",
                    
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-06-15 16:30",
                    status: "Completed",
                    transportMode: "Air",
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
                    arrivalTime: "2025-06-17 07:00",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-06-17 09:00",
                    departedTime: "2025-06-17 11:00",
                    status: "Pending",
                    transportMode: "Air",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-06-17 09:30",
                      duration: "1h 15m",
                    
                    },
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-06-18 03:00",
                    status: "Pending",
                    transportMode: "n/a",
                    vehicleNumber: "n/a",
                    weatherConditions: "Expected: Partly cloudy, 38°C"
                  }
                ]
              }
            ],
            rootCauseAnalysis: "Pending",
            rootCauseAnalysisStatusDetails: {
              status: "Pending",
              details: "Investigating temperature excursion at Amsterdam Airport. Initial findings suggest packaging failure during loading.",
              UTCDateStarted: "2025-06-17",
              evaluatedBy: "John Smith",
              type: "Temperature Excursion",
              evaluationType: "Standard Investigation",
              primaryRootCause: "Pending Investigation",
              secondaryRootCause: "Suspected Packaging Failure",
              reason: "Temperature excursion detected during loading at Amsterdam Airport"
            },
            lastSeen: "2025-06-17 10:00",
            productDetails: {
              prodfilename: "Insulin-2",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "WL-1006B",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-06-10T08:00:00Z",
            loggerEnded: "2025-06-20T08:00:00Z",
            temperature: "n/a",
            alarms: [
              {
                alarmId: 1,
                alarmType: "temperature",
                excursionMilestones: [
                  {
                    type: "lane 1 part A - destination before excursion",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-06-15 08:30",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2 part B - excursion lane",
                    location: "Heathrow Airport Hub - Transfer",
                    arrivalTime: "2025-06-15 09:00",
                    departedTime: "2025-06-15 10:15",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-06-15 09:00",
                      duration: "1h 15m",
                    
                    }
                  },
                  {
                    type: "lane 3 part C - destination after excursion",
                    location: "Heathrow Airport",
                    arrivalTime: "2025-06-15 16:30",
                    status: "Completed",
                    transportMode: "Air",
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
                    arrivalTime: "2025-06-17 07:00",
                    status: "Completed",
                    transportMode: "Road",
                    vehicleNumber: "DE HAM 456",
                    weatherConditions: "Sunny, 28°C"
                  },
                  {
                    type: "lane 2",
                    location: "Amsterdam Airport",
                    arrivalTime: "2025-06-17 09:00",
                    departedTime: "2025-06-17 11:00",
                    status: "Completed",
                    transportMode: "Air",
                    vehicleNumber: "F1234567",
                    weatherConditions: "Sunny, 28°C",
                    excursion: {
                      highest: "25°C",
                      lowest: "5°C",
                      average: "21°C",
                      startTime: "2025-06-17 09:30",
                      duration: "1h 15m",
                  
                    }
                  },
                  {
                    type: "lane 3",
                    location: "Tokyo Airport",
                    arrivalTime: "2025-06-18 03:00",
                    status: "Pending",
                    transportMode: "n/a",
                    vehicleNumber: "n/a",
                    weatherConditions: "Expected: Partly cloudy, 38°C"
                  }
                ]
              }
            ],
            rootCauseAnalysis: "Completed",
            rootCauseAnalysisStatusDetails: {
              status: "Completed",
              details: "Temperature excursion caused by exposure to direct sunlight during loading at Heathrow Airport. Packaging integrity was compromised.",
              UTCDateStarted: "2025-06-15",
              evaluatedBy: "Sarah Johnson",
              type: "Temperature Excursion",
              evaluationType: "Comprehensive Analysis",
              primaryRootCause: "Direct Sunlight Exposure",
              secondaryRootCause: "Packaging Integrity Failure",
              reason: "Extended tarmac wait time during peak summer temperatures combined with inadequate packaging for extreme conditions"
            },
            lastSeen: "2025-06-17 10:00",
            productDetails: {
              prodfilename: "Insulin-2",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          }
        ]
      },
      {
        shipmentId: "SH014",
        origin: "Paris, France",
        destination: "Madrid, Spain",
        eta: "Unavailable",
        status: "In Transit",
        loggers: 2,
        freightForwarder: "DHL",
        currentLocation: "Unavailable",
        modeOfTransport: "Road",
        packagingType: "Unavailable",
        alarms: 1,
        totalAlarms: 1,
        events: 0,
        rcas: "Not Started",
        loggerData: [
          {
            loggerId: "WB-1014C",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-08-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "n/a",
            alarms: 0,
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            lastSeen: "n/a",
            productDetails: {
              prodfilename: "Vaccine-X",
              producttype: "cold chain",
              temperatureProfile: "profile",
              highThreshold: "10 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "WB-1014B",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-08-10T08:00:00Z",
            loggerEnded: "Active",
            temperature: "n/a",
       
            alarms: 0,
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            lastSeen: "n/a",
            productDetails: {
              prodfilename: "Vaccine-X",
              producttype: "cold chain",
              temperatureProfile: "profile",
              highThreshold: "10 °C",
              lowThreshold: "2 °C"
            }
          },
        ]
      },
      {
        shipmentId: "SH015",
        origin: "Paris, France",
        destination: "Madrid, Spain",
        eta: "2025-07-13",
        status: "Delivered",
        loggers: 2,
        freightForwarder: "DHL",
        currentLocation: "n/a",
        modeOfTransport: "Road",
        packagingType: "n/a",
        alarms: 1,
        totalAlarms: 0,
        events: 0,
        rcas: "Not Started",
        shipmentCurrentMilestone: [],
        loggerData: [
          {
            loggerId: "WB-1015A",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-13T08:00:00Z",
            temperature: "n/a",
            alarms: [],
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            lastSeen: "2025-07-13 14:30",
            productDetails: {
              prodfilename: "Vaccine-X",
              producttype: "cold chain",
              temperatureProfile: "profile",
              highThreshold: "10 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "WB-1015B",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-13T08:00:00Z",
            temperature: "n/a",
            alarms: [],
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            lastSeen: "2025-07-13 14:35",
            productDetails: {
              prodfilename: "Vaccine-X",
              producttype: "cold chain",
              temperatureProfile: "profile",
              highThreshold: "10 °C",
              lowThreshold: "2 °C"
            }
          }
        ]
      }
];