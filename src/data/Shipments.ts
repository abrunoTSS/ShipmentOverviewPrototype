import type { Shipment, LoggerTimeSeriesData } from '../types';

// Helper function to generate time-series data with validation
function generateTimeSeriesData(
  startDate: string, 
  endDate: string | null, 
  loggerType: string,
  shipmentStatus: string,
  baseTemp: number = 6, 
  baseHumidity: number = 45
): LoggerTimeSeriesData[] {
  const data: LoggerTimeSeriesData[] = [];
  
  // Web loggers should only have temperature data if shipment is delivered
  if (loggerType.includes('Web Logger') && shipmentStatus !== 'Delivered') {
    return [];
  }
  
  const start = new Date(startDate);
  const end = endDate && endDate !== 'n/a' ? new Date(endDate) : new Date();
  
  // Generate data points every 15 minutes
  const intervalMs = 15 * 60 * 1000; // 15 minutes
  let current = new Date(start);
  
  while (current <= end) {
    // Add some realistic variation
    const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
    const humidityVariation = (Math.random() - 0.5) * 20; // ±10% variation
    
    const dataPoint: LoggerTimeSeriesData = {
      timestamp: current.toISOString(),
      temperature: Math.round((baseTemp + tempVariation) * 10) / 10,
    };
    
    // Add humidity data only for Sentinel and Sentry loggers (exclude web loggers)
    if ((loggerType.includes('Sentinel') || loggerType.includes('Sentry')) && !loggerType.includes('Web Logger')) {
      dataPoint.humidity = Math.round((baseHumidity + humidityVariation) * 10) / 10;
    }
    
    data.push(dataPoint);
    current = new Date(current.getTime() + intervalMs);
  }
  
  return data;
}

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
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "n/a",
            deliveryId: "DLV-001",
            tempProfile: "controlled room temperature",
            serialNumber: 1,
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "Web Logger 2", "In Transit", 5, 42),
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
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "n/a",
            deliveryId: "DLV-002",
            tempProfile: "controlled room temperature",
            serialNumber: 2,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "Sentry", "In Transit", 6, 50),
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
            evaluation: "Not Started",
            rootCauseAnalysisStatusDetails: null,
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
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "n/a",
            deliveryId: "DLV-003",
            tempProfile: "controlled room temperature",
            serialNumber: 3,
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
            evaluation: "Not Started",
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "Sentinel", "In Transit", 6, 45),
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
            deliveryId: "DL-1001",
            tempProfile: "controlled room temperature",
            serialNumber: 1,
            missionStarted: "2025-07-10T08:00:00Z",
            missionEnded: "2025-07-20T08:00:00Z",
            alarms: 0,
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            events: [],
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", "Web Logger 2", "Delivered", 6, 45),
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
                    weatherConditions: "Sunny, 28°C",
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
            evaluation: "Not Started",
            rootCauseAnalysisStatusDetails: null,
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
            evaluation: "Not Started",
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", "Web Logger 2", "Delivered", 8, 50),
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
            deliveryId: "DL-1004",
            tempProfile: "controlled room temperature",
            serialNumber: 1,
            missionStarted: "2025-06-10T08:00:00Z",
            missionEnded: "2025-06-20T08:00:00Z",
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
            deliveryId: "DL-1005",
            tempProfile: "controlled room temperature",
            serialNumber: 2,
            missionStarted: "2025-06-10T08:00:00Z",
            missionEnded: "2025-06-20T08:00:00Z",
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
            deliveryId: "DL-1006",
            tempProfile: "controlled room temperature",
            serialNumber: 3,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "n/a",
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "Web Logger 2", "In Transit", 5, 40),
            alarms: 0,
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
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
            deliveryId: "DL-1007",
            tempProfile: "controlled room temperature",
            serialNumber: 2,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "n/a",
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "Web Logger 2", "In Transit", 5, 38),
            alarms: 0,
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
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
            deliveryId: "DL-1008",
            tempProfile: "controlled room temperature",
            serialNumber: 1,
            missionStarted: "2025-07-10T08:00:00Z",
            missionEnded: "2025-07-13T08:00:00Z",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-13T08:00:00Z", "Web Logger 2", "Delivered", 4, 40),
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
            deliveryId: "DL-1009",
            tempProfile: "controlled room temperature",
            serialNumber: 2,
            missionStarted: "2025-07-10T08:00:00Z",
            missionEnded: "2025-07-13T08:00:00Z",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
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