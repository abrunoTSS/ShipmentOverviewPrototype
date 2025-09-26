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
        milestones: [
          {
            type: "origin",
            location: "Stockholm, Sweden",
            status: "Completed",
            milestoneName: "Departure from Stockholm",
            groundHandler: "Geodis",
            arrived: "2025-09-22T08:00:00Z",
            delivered: "2025-09-22T10:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T1234",
            weatherConditions: "Clear, 15°C"
          },
          {
            type: "milestone",
            location: "Copenhagen, Denmark",
            status: "Completed",
            milestoneName: "Transit through Copenhagen",
            groundHandler: "Geodis",
            arrived: "2025-09-22T14:30:00Z",
            delivered: "2025-09-22T15:30:00Z",
            transportMode: "Road",
            vehicleNumber: "T1234",
            weatherConditions: "Partly cloudy, 12°C"
          },
          {
            type: "milestone",
            location: "Hamburg, Germany",
            status: "Current",
            milestoneName: "Transit through Hamburg",
            groundHandler: "Geodis",
            arrivalTime: "2025-09-22T18:45:00Z",
            etd: "2025-09-22T22:30:00Z",
            transportMode: "Road",
            vehicleNumber: "T1234",
            weatherConditions: "Overcast, 10°C"
          },
          {
            type: "destination",
            location: "Berlin, Germany",
            status: "Pending",
            milestoneName: "Arrival in Berlin",
            groundHandler: "Geodis",
            eta: "2025-09-23T08:00:00Z",
            etd: "2025-09-23T10:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T1234",
            weatherConditions: "Expected: Light rain, 8°C"
          }
        ],        
        rcas: "n/a",
        distance: 522, // Stockholm to Berlin by road
        co2Emissions: 32.36, // Road transport: 0.062 kg CO2/km
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
            alarmTypes: ["Temperature"],
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
        distance: 9560, // Macclesfield to Tokyo by air
        co2Emissions: 2437.8, // Air transport: 0.255 kg CO2/km
        milestones: [
          {
            type: "origin",
            location: "Macclesfield, UK",
            status: "Completed",
            milestoneName: "Departure from Macclesfield",
            groundHandler: "Geodis",
            arrived: "2025-09-21T06:00:00Z",
            delivered: "2025-09-21T08:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T2456",
            weatherConditions: "Foggy, 8°C"
          },
          {
            type: "milestone",
            location: "Heathrow Airport, UK",
            status: "Completed",
            milestoneName: "Departure from Heathrow",
            groundHandler: "British Airways",
            arrived: "2025-09-21T10:30:00Z",
            delivered: "2025-09-21T14:15:00Z",
            transportMode: "Air",
            vehicleNumber: "F8901",
            weatherConditions: "Overcast, 11°C"
          },
          {
            type: "milestone",
            location: "Amsterdam, Netherlands",
            status: "Current",
            milestoneName: "Transit through Amsterdam Schiphol",
            groundHandler: "KLM",
            arrivalTime: "2025-09-21T16:45:00Z",
            etd: "2025-09-21T18:45:00Z",
            transportMode: "Air",
            vehicleNumber: "F3456",
            weatherConditions: "Light rain, 9°C"
          },
          {
            type: "milestone",
            location: "Dubai, UAE",
            status: "Pending",
            milestoneName: "Transit through Dubai",
            groundHandler: "Emirates",
            eta: "2025-09-22T02:30:00Z",
            etd: "2025-09-22T06:15:00Z",
            transportMode: "Air",
            vehicleNumber: "F7890",
            weatherConditions: "Expected: Clear, 28°C"
          },
          {
            type: "destination",
            location: "Tokyo, Japan",
            status: "Pending",
            milestoneName: "Arrival at Narita Airport",
            groundHandler: "Japan Airlines",
            eta: "2025-09-22T14:30:00Z",
            transportMode: "Air",
            vehicleNumber: "F1122",
            weatherConditions: "Expected: Partly cloudy, 18°C"
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
            alarmTypes: ["Temperature", "Humidity"],
            alarms: [
              {
                alarmId: 1,
                alarmType: "Temperature",
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
                alarmType: "Temperature",
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
            alarmTypes: ["Temperature", "Shock"],
            alarms: [
              {
                alarmId: 1,
                alarmType: "Temperature",
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
                alarmType: "Temperature",
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
        distance: 522, // Stockholm to Berlin by air
        co2Emissions: 133.11, // Air transport: 0.255 kg CO2/km
        milestones: [
          {
            type: "origin",
            location: "Stockholm, Sweden",
            status: "Completed",
            milestoneName: "Departure from Stockholm Arlanda",
            groundHandler: "SAS",
            arrivalTime: "2025-07-10T08:00:00Z",
            departedTime: "2025-07-10T11:30:00Z",
            transportMode: "Air",
            vehicleNumber: "F2345",
            weatherConditions: "Clear, 18°C"
          },
          {
            type: "milestone",
            location: "Frankfurt, Germany",
            status: "Completed",
            milestoneName: "Transit through Frankfurt",
            groundHandler: "Lufthansa",
            arrivalTime: "2025-07-10T13:15:00Z",
            departedTime: "2025-07-10T15:45:00Z",
            transportMode: "Air",
            vehicleNumber: "F6789",
            weatherConditions: "Partly cloudy, 22°C"
          },
          {
            type: "destination",
            location: "Berlin, Germany",
            status: "Completed",
            milestoneName: "Arrival at Berlin Brandenburg",
            groundHandler: "Lufthansa",
            arrivalTime: "2025-07-20T08:00:00Z",
            transportMode: "Air",
            vehicleNumber: "F6789",
            weatherConditions: "Sunny, 24°C"
          }
        ],
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
        milestones: [
          {
            type: "origin",
            location: "Macclesfield, UK",
            status: "Completed",
            milestoneName: "Departure from Macclesfield",
            groundHandler: "DHL",
            arrivalTime: "2025-07-10T06:00:00Z",
            departedTime: "2025-07-10T08:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T3456",
            weatherConditions: "Overcast, 12°C"
          },
          {
            type: "milestone",
            location: "Heathrow Airport, UK",
            status: "Completed",
            milestoneName: "Departure from Heathrow",
            groundHandler: "British Airways",
            arrivalTime: "2025-07-10T10:30:00Z",
            departedTime: "2025-07-10T14:15:00Z",
            transportMode: "Air",
            vehicleNumber: "F4567",
            weatherConditions: "Light rain, 14°C"
          },
          {
            type: "milestone",
            location: "Dubai, UAE",
            status: "Completed",
            milestoneName: "Transit through Dubai",
            groundHandler: "Emirates",
            arrivalTime: "2025-07-10T22:45:00Z",
            departedTime: "2025-07-11T02:30:00Z",
            transportMode: "Air",
            vehicleNumber: "F8901",
            weatherConditions: "Clear, 32°C"
          },
          {
            type: "destination",
            location: "Tokyo, Japan",
            status: "Completed",
            milestoneName: "Arrival at Narita Airport",
            groundHandler: "Japan Airlines",
            arrivalTime: "2025-07-20T08:00:00Z",
            transportMode: "Air",
            vehicleNumber: "F2345",
            weatherConditions: "Humid, 26°C"
          }
        ],
        loggerData: [
          {
            loggerId: "WL-1004A",
            loggerType: "Web Logger 2",
            deliveryId: "DL-1004A",
            tempProfile: "controlled room temperature",
            serialNumber: 1,
            missionStarted: "2025-07-10T08:00:00Z",
            missionEnded: "2025-07-20T08:00:00Z",
            alarms: [
              {
                alarmId: 1,
                alarmType: "Temperature",
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
                alarmType: "Temperature",
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
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", "Web Logger 2", "Delivered", 6, 45),
            productDetails: {
              prodfilename: "Insulin-2",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C",
            }
          },
          {
            loggerId: "WL-1004B",
            loggerType: "Web Logger 2",
            deliveryId: "DL-1004B",
            tempProfile: "controlled room temperature",
            serialNumber: 2,
            missionStarted: "2025-07-10T08:00:00Z",
            missionEnded: "2025-07-20T08:00:00Z",
            alarms: [
              {
                alarmId: 1,
                alarmType: "Temperature",
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
                alarmType: "Temperature",
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
        distance: 9560, // Macclesfield to Tokyo by air
        co2Emissions: 2437.8, // Air transport: 0.255 kg CO2/km
        milestones: [
          {
            type: "origin",
            location: "Macclesfield, UK",
            status: "Completed",
            milestoneName: "Departure from Macclesfield",
            groundHandler: "DHL",
            arrivalTime: "2025-06-10T06:00:00Z",
            departedTime: "2025-06-10T08:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T7890",
            weatherConditions: "Rainy, 10°C"
          },
          {
            type: "milestone",
            location: "Heathrow Airport, UK",
            status: "Completed",
            milestoneName: "Departure from Heathrow",
            groundHandler: "British Airways",
            arrivalTime: "2025-06-10T10:30:00Z",
            departedTime: "2025-06-10T14:15:00Z",
            transportMode: "Air",
            vehicleNumber: "F5678",
            weatherConditions: "Cloudy, 13°C"
          },
          {
            type: "milestone",
            location: "Amsterdam, Netherlands",
            status: "Completed",
            milestoneName: "Transit through Amsterdam Schiphol",
            groundHandler: "KLM",
            arrivalTime: "2025-06-10T16:45:00Z",
            departedTime: "2025-06-10T19:30:00Z",
            transportMode: "Air",
            vehicleNumber: "F9012",
            weatherConditions: "Light rain, 15°C"
          },
          {
            type: "destination",
            location: "Tokyo, Japan",
            status: "Completed",
            milestoneName: "Arrival at Narita Airport",
            groundHandler: "Japan Airlines",
            arrivalTime: "2025-06-20T08:00:00Z",
            transportMode: "Air",
            vehicleNumber: "F3456",
            weatherConditions: "Overcast, 22°C"
          }
        ],
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
                alarmType: "Temperature",
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
                alarmType: "Temperature",
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
            timeSeriesData: generateTimeSeriesData("2025-06-10T08:00:00Z", "2025-06-20T08:00:00Z", "Web Logger 2", "Delivered", 6, 45),
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
                alarmType: "Temperature",
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
                alarmType: "Temperature",
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
            timeSeriesData: generateTimeSeriesData("2025-06-10T08:00:00Z", "2025-06-20T08:00:00Z", "Web Logger 2", "Delivered", 8, 50),
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
        distance: "n/a", // Paris to Madrid by road
        co2Emissions: "n/a", // Road transport: 0.062 kg CO2/km
        milestones: [],
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
        distance: "n/a", // Paris to Madrid by road
        co2Emissions: "n/a", // Road transport: 0.062 kg CO2/km
        milestones: [],
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
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-13T08:00:00Z", "Web Logger 2", "Delivered", 4, 40),
            productDetails: {
              prodfilename: "Vaccine-X",
              producttype: "cold chain",
              temperatureProfile: "profile",
              highThreshold: "10 °C",
              lowThreshold: "2 °C"
            }
          }
        ]
      },
      {
        shipmentId: "SH007",
        origin: "Hamburg, Germany",
        destination: "Barcelona, Spain",
        eta: "2025-09-28",
        status: "In Transit",
        loggers: 10,
        freightForwarder: "DHL",
        currentLocation: "48°8'34.0N, 11°34'30.0E",
        modeOfTransport: "Road",
        packagingType: "Insulated Container",
        alarms: 2,
        events: 3,
        rcas: "Not Started",
        distance: 1165, // Hamburg to Barcelona by road
        co2Emissions: 72.23, // Road transport: 0.062 kg CO2/km
        milestones: [
          {
            type: "origin",
            location: "Hamburg, Germany",
            status: "Completed",
            milestoneName: "Departure from Hamburg",
            groundHandler: "DHL",
            arrived: "2025-09-25T08:00:00Z",
            delivered: "2025-09-25T10:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Overcast, 12°C"
          },
          {
            type: "milestone",
            location: "Frankfurt, Germany",
            status: "Completed",
            milestoneName: "Transit through Frankfurt",
            groundHandler: "DHL",
            arrived: "2025-09-25T14:30:00Z",
            delivered: "2025-09-25T15:30:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Light rain, 10°C"
          },
          {
            type: "milestone",
            location: "Munich, Germany",
            status: "Current",
            milestoneName: "Transit through Munich",
            groundHandler: "DHL",
            arrivalTime: "2025-09-25T20:00:00Z",
            etd: "2025-09-26T06:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Clear, 8°C"
          },
          {
            type: "milestone",
            location: "Lyon, France",
            status: "Pending",
            milestoneName: "Transit through Lyon",
            groundHandler: "DHL",
            eta: "2025-09-26T14:00:00Z",
            etd: "2025-09-26T16:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Expected: Partly cloudy, 15°C"
          },
          {
            type: "destination",
            location: "Barcelona, Spain",
            status: "Pending",
            milestoneName: "Arrival at Barcelona",
            groundHandler: "DHL",
            eta: "2025-09-28T10:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Expected: Sunny, 18°C"
          }
        ],
        loggerData: [
          {
            loggerId: "SENTRY-7001",
            loggerType: "Sentry",
            deliveryId: "DLV-7001",
            tempProfile: "controlled room temperature",
            serialNumber: 1,
            missionStarted: "2025-09-25T08:00:00Z",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-25T08:00:00Z", null, "Sentry", "In Transit", 6, 50),
            productDetails: {
              prodfilename: "Biologics-7A",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7002",
            loggerType: "Sentry",
            deliveryId: "DLV-7002",
            tempProfile: "controlled room temperature",
            serialNumber: 2,
            missionStarted: "2025-09-25T08:00:00Z",
            missionEnded: "n/a",
            alarms: [
              {
                alarmId: 7001,
                alarmType: "Temperature",
                errorMessage: "Temperature spike detected during loading",
                excursionMilestones: []
              }
            ],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-25T08:00:00Z", null, "Sentry", "In Transit", 7, 52),
            productDetails: {
              prodfilename: "Biologics-7B",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7003",
            loggerType: "Sentry",
            deliveryId: "DLV-7003",
            tempProfile: "controlled room temperature",
            serialNumber: 3,
            missionStarted: "2025-09-25T08:00:00Z",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-25T08:00:00Z", null, "Sentry", "In Transit", 5, 48),
            productDetails: {
              prodfilename: "Biologics-7C",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7004",
            loggerType: "Sentry",
            deliveryId: "DLV-7004",
            tempProfile: "controlled room temperature",
            serialNumber: 4,
            missionStarted: "2025-09-25T08:00:00Z",
            missionEnded: "n/a",
            alarms: [
              {
                alarmId: 7002,
                alarmType: "Humidity",
                errorMessage: "Humidity levels exceeded threshold",
                excursionMilestones: []
              }
            ],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-25T08:00:00Z", null, "Sentry", "In Transit", 6, 55),
            productDetails: {
              prodfilename: "Biologics-7D",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7005",
            loggerType: "Sentry",
            deliveryId: "DLV-7005",
            tempProfile: "controlled room temperature",
            serialNumber: 5,
            missionStarted: "2025-09-25T08:00:00Z",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-25T08:00:00Z", null, "Sentry", "In Transit", 6, 49),
            productDetails: {
              prodfilename: "Biologics-7E",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7006",
            loggerType: "Sentry",
            deliveryId: "DLV-7006",
            tempProfile: "controlled room temperature",
            serialNumber: 6,
            missionStarted: "2025-09-25T08:00:00Z",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-25T08:00:00Z", null, "Sentry", "In Transit", 7, 51),
            productDetails: {
              prodfilename: "Biologics-7F",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7007",
            loggerType: "Sentry",
            deliveryId: "DLV-7007",
            tempProfile: "controlled room temperature",
            serialNumber: 7,
            missionStarted: "2025-09-25T08:00:00Z",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-25T08:00:00Z", null, "Sentry", "In Transit", 5, 47),
            productDetails: {
              prodfilename: "Biologics-7G",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7008",
            loggerType: "Sentry",
            deliveryId: "DLV-7008",
            tempProfile: "controlled room temperature",
            serialNumber: 4,
            missionStarted: "2025-09-25T08:00:00Z",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: [],
            productDetails: {
              prodfilename: "Biologics-7H",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7009",
            loggerType: "Sentry",
            deliveryId: "DLV-7009",
            tempProfile: "controlled room temperature",
            serialNumber: 9,
            missionStarted: "n/a",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: [],
            productDetails: {
              prodfilename: "Biologics-7I",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-7010",
            loggerType: "Sentry",
            deliveryId: "DLV-7010",
            tempProfile: "controlled room temperature",
            serialNumber: 10,
            missionStarted: "n/a",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: [],
            productDetails: {
              prodfilename: "Biologics-7J",
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
        origin: "Hamburg, Germany",
        destination: "Barcelona, Spain",
        eta: "2025-09-24",
        status: "Delivered",
        loggers: 10,
        freightForwarder: "DHL",
        currentLocation: "Barcelona, Spain",
        modeOfTransport: "Road",
        packagingType: "Insulated Container",
        alarms: 2,
        events: 4,
        rcas: "In Progress",
        distance: 1165,
        co2Emissions: 72.23,
        milestones: [
          {
            type: "origin",
            location: "Hamburg, Germany",
            status: "Completed",
            milestoneName: "Departure from Hamburg",
            groundHandler: "DHL",
            arrived: "2025-09-22T08:00:00Z",
            delivered: "2025-09-22T10:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Overcast, 12°C"
          },
          {
            type: "milestone",
            location: "Frankfurt, Germany",
            status: "Completed",
            milestoneName: "Transit through Frankfurt",
            groundHandler: "DHL",
            arrived: "2025-09-22T14:30:00Z",
            delivered: "2025-09-22T15:30:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Light rain, 10°C"
          },
          {
            type: "milestone",
            location: "Lyon, France",
            status: "Completed",
            milestoneName: "Transit through Lyon",
            groundHandler: "DHL",
            arrived: "2025-09-23T10:00:00Z",
            delivered: "2025-09-23T11:00:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Sunny, 15°C"
          },
          {
            type: "destination",
            location: "Barcelona, Spain",
            status: "Completed",
            milestoneName: "Arrival in Barcelona",
            groundHandler: "DHL",
            arrived: "2025-09-24T14:22:00Z",
            delivered: "2025-09-24T15:22:00Z",
            transportMode: "Road",
            vehicleNumber: "T8901",
            weatherConditions: "Sunny, 18°C"
          }
        ],
        loggerData: [
          {
            loggerId: "SENTRY-14001",
            loggerType: "Sentry",
            deliveryId: "DLV-14001",
            tempProfile: "controlled room temperature",
            serialNumber: 1,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "2025-09-24T17:00:00Z",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-24T17:00:00Z", "Sentry", "Delivered", 6, 50),
            productDetails: {
              prodfilename: "Biologics-14A",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14002",
            loggerType: "Sentry",
            deliveryId: "DLV-14002",
            tempProfile: "controlled room temperature",
            serialNumber: 2,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "2025-09-24T17:00:00Z",
            alarms: [
              {
                alarmId: 14001,
                alarmType: "Temperature",
                errorMessage: "Temperature spike detected during loading",
                excursionMilestones: []
              }
            ],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-24T17:00:00Z", "Sentry", "Delivered", 7, 52),
            productDetails: {
              prodfilename: "Biologics-14B",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14003",
            loggerType: "Sentry",
            deliveryId: "DLV-14003",
            tempProfile: "controlled room temperature",
            serialNumber: 3,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "2025-09-24T17:00:00Z",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-24T17:00:00Z", "Sentry", "Delivered", 5, 48),
            productDetails: {
              prodfilename: "Biologics-14C",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14004",
            loggerType: "Sentry",
            deliveryId: "DLV-14004",
            tempProfile: "controlled room temperature",
            serialNumber: 4,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "2025-09-24T17:00:00Z",
            alarms: [
              {
                alarmId: 14002,
                alarmType: "Humidity",
                errorMessage: "Humidity levels exceeded threshold",
                excursionMilestones: []
              }
            ],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-24T17:00:00Z", "Sentry", "Delivered", 6, 55),
            productDetails: {
              prodfilename: "Biologics-14D",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14005",
            loggerType: "Sentry",
            deliveryId: "DLV-14005",
            tempProfile: "controlled room temperature",
            serialNumber: 5,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "2025-09-24T17:00:00Z",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-24T17:00:00Z", "Sentry", "Delivered", 6, 49),
            productDetails: {
              prodfilename: "Biologics-14E",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14006",
            loggerType: "Sentry",
            deliveryId: "DLV-14006",
            tempProfile: "controlled room temperature",
            serialNumber: 6,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "2025-09-24T17:00:00Z",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-24T17:00:00Z", "Sentry", "Delivered", 7, 51),
            productDetails: {
              prodfilename: "Biologics-14F",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14007",
            loggerType: "Sentry",
            deliveryId: "DLV-14007",
            tempProfile: "controlled room temperature",
            serialNumber: 7,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "2025-09-24T17:00:00Z",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-24T17:00:00Z", "Sentry", "Delivered", 5, 47),
            productDetails: {
              prodfilename: "Biologics-14G",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14008",
            loggerType: "Sentry",
            deliveryId: "DLV-14008",
            tempProfile: "controlled room temperature",
            serialNumber: 8,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "2025-09-24T17:00:00Z",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-24T17:00:00Z", "Sentry", "Delivered", 6, 53),
            productDetails: {
              prodfilename: "Biologics-14H",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14009",
            loggerType: "Sentry",
            deliveryId: "DLV-14009",
            tempProfile: "controlled room temperature",
            serialNumber: 9,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-25T15:22:00Z", "Sentry", "Delivered", 5, 49),
            productDetails: {
              prodfilename: "Biologics-14I",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTRY-14010",
            loggerType: "Sentry",
            deliveryId: "DLV-14010",
            tempProfile: "controlled room temperature",
            serialNumber: 10,
            missionStarted: "2025-09-22T08:00:00Z",
            missionEnded: "n/a",
            alarms: [],
            evaluation: null,
            rootCauseAnalysisStatusDetails: null,
            timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", "2025-09-25T15:22:00Z", "Sentry", "Delivered", 6, 51),
            productDetails: {
              prodfilename: "Biologics-14J",
              producttype: "controlled room temperature",
              temperatureProfile: "profile",
              highThreshold: "12 °C",
              lowThreshold: "2 °C"
            }
          }
        ]
      }
];