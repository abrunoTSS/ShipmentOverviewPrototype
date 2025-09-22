import type { Shipment, LoggerTimeSeriesData, ShipmentMilestone } from '../types';

// Helper function to generate time-series data with validation
function generateTimeSeriesData(
  startDate: string, 
  endDate: string | null, 
  baseTemp: number = 6, 
  baseHumidity: number = 45
): LoggerTimeSeriesData[] {
  const data: LoggerTimeSeriesData[] = [];
  const start = new Date(startDate);
  const end = endDate && endDate !== 'n/a' ? new Date(endDate) : new Date();
  
  // Generate data points every 30 minutes
  const intervalMs = 30 * 60 * 1000; // 30 minutes
  let current = new Date(start);
  
  while (current <= end) {
    // Add some realistic variation
    const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
    const humidityVariation = (Math.random() - 0.5) * 20; // ±10% variation
    
    data.push({
      timestamp: current.toISOString(),
      temperature: Math.round((baseTemp + tempVariation) * 10) / 10,
      humidity: Math.round((baseHumidity + humidityVariation) * 10) / 10
    });
    
    current = new Date(current.getTime() + intervalMs);
  }
  
  return data;
}

// Helper function to create shipment milestones
function createShipmentMilestones(
  origin: string,
  destination: string,
  status: string,
  eta: string,
  modeOfTransport: string = 'Road'
): ShipmentMilestone[] {
  const milestones: ShipmentMilestone[] = [];
  
  // Start milestone - Origin pickup
  milestones.push({
    location: origin,
    arrivalTime: '2025-07-10T08:00:00Z',
    status: 'Completed',
    transportMode: 'Loading',
    vehicleNumber: 'LOAD-001',
    weather: 'Clear, 22°C',
    milestoneType: 'start'
  });

  // Generate detailed route-specific milestones
  if (origin.includes('Stockholm') && destination.includes('Berlin')) {
    // Stockholm to Berlin route (Road)
    milestones.push({
      location: 'Malmö, Sweden',
      arrivalTime: '2025-07-10T14:00:00Z',
      status: 'Completed',
      transportMode: 'Road',
      vehicleNumber: 'SE-TR-456',
      weather: 'Overcast, 16°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Copenhagen, Denmark',
      arrivalTime: '2025-07-11T08:00:00Z',
      status: 'Completed',
      transportMode: 'Road',
      vehicleNumber: 'DK-TR-789',
      weather: 'Partly cloudy, 18°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Hamburg, Germany',
      arrivalTime: '2025-07-12T15:00:00Z',
      status: status === 'Delivered' ? 'Completed' : (status === 'In Transit' ? 'Current' : 'Completed'),
      transportMode: 'Road',
      vehicleNumber: 'DE-TR-123',
      weather: 'Sunny, 24°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Hannover, Germany',
      arrivalTime: '2025-07-13T10:00:00Z',
      status: status === 'Delivered' ? 'Completed' : (status === 'In Transit' ? 'Pending' : 'Pending'),
      transportMode: 'Road',
      vehicleNumber: 'DE-TR-123',
      weather: 'Clear, 26°C',
      milestoneType: 'transit'
    });
    
  } else if (origin.includes('Macclesfield') && destination.includes('Tokyo')) {
    // UK to Japan route (Air)
    milestones.push({
      location: 'Manchester Hub, UK',
      arrivalTime: '2025-07-11T06:00:00Z',
      status: 'Completed',
      transportMode: 'Road',
      vehicleNumber: 'UK-TR-001',
      weather: 'Rainy, 14°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Heathrow Airport, UK',
      arrivalTime: '2025-07-11T12:00:00Z',
      status: 'Completed',
      transportMode: 'Air Cargo',
      vehicleNumber: 'BA-CARGO-456',
      weather: 'Cloudy, 18°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Amsterdam Schiphol, Netherlands',
      arrivalTime: '2025-07-12T08:00:00Z',
      status: status === 'Delivered' ? 'Completed' : (status === 'In Transit' ? 'Current' : 'Completed'),
      transportMode: 'Air Cargo',
      vehicleNumber: 'KL-CARGO-789',
      weather: 'Clear, 22°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Dubai International, UAE',
      arrivalTime: '2025-07-13T14:00:00Z',
      status: status === 'Delivered' ? 'Completed' : (status === 'In Transit' ? 'Pending' : 'Pending'),
      transportMode: 'Air Cargo',
      vehicleNumber: 'EK-CARGO-123',
      weather: 'Hot, 38°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Narita Airport, Japan',
      arrivalTime: '2025-07-14T22:00:00Z',
      status: status === 'Delivered' ? 'Completed' : 'Pending',
      transportMode: 'Air Cargo',
      vehicleNumber: 'JL-CARGO-456',
      weather: 'Humid, 32°C',
      milestoneType: 'transit'
    });
    
  } else if (origin.includes('Paris') && destination.includes('Madrid')) {
    // Paris to Madrid route (Road)
    milestones.push({
      location: 'Orleans, France',
      arrivalTime: '2025-07-10T12:00:00Z',
      status: 'Completed',
      transportMode: 'Road',
      vehicleNumber: 'FR-TR-234',
      weather: 'Sunny, 28°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Bordeaux, France',
      arrivalTime: '2025-07-10T18:00:00Z',
      status: 'Completed',
      transportMode: 'Road',
      vehicleNumber: 'FR-TR-234',
      weather: 'Clear, 30°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'San Sebastian, Spain',
      arrivalTime: '2025-07-11T08:00:00Z',
      status: status === 'Delivered' ? 'Completed' : (status === 'In Transit' ? 'Current' : 'Completed'),
      transportMode: 'Road',
      vehicleNumber: 'ES-TR-567',
      weather: 'Partly cloudy, 26°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Burgos, Spain',
      arrivalTime: '2025-07-11T14:00:00Z',
      status: status === 'Delivered' ? 'Completed' : (status === 'In Transit' ? 'Pending' : 'Pending'),
      transportMode: 'Road',
      vehicleNumber: 'ES-TR-567',
      weather: 'Hot, 34°C',
      milestoneType: 'transit'
    });
    
  } else {
    // Generic route with 3 transit points
    milestones.push({
      location: 'Transit Hub 1',
      arrivalTime: '2025-07-11T10:00:00Z',
      status: 'Completed',
      transportMode: modeOfTransport,
      vehicleNumber: 'GEN-TR-001',
      weather: 'Clear, 20°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Transit Hub 2',
      arrivalTime: '2025-07-12T14:00:00Z',
      status: 'Completed',
      transportMode: modeOfTransport,
      vehicleNumber: 'GEN-TR-002',
      weather: 'Sunny, 24°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Transit Hub 3',
      arrivalTime: '2025-07-13T08:00:00Z',
      status: status === 'Delivered' ? 'Completed' : (status === 'In Transit' ? 'Current' : 'Pending'),
      transportMode: modeOfTransport,
      vehicleNumber: 'GEN-TR-003',
      weather: 'Partly cloudy, 22°C',
      milestoneType: 'transit'
    });
    
    milestones.push({
      location: 'Final Transit Point',
      arrivalTime: '2025-07-14T12:00:00Z',
      status: status === 'Delivered' ? 'Completed' : 'Pending',
      transportMode: modeOfTransport,
      vehicleNumber: 'GEN-TR-004',
      weather: 'Clear, 25°C',
      milestoneType: 'transit'
    });
  }
  
  // End milestone - Final delivery
  milestones.push({
    location: destination,
    arrivalTime: status === 'Delivered' ? eta + 'T16:00:00Z' : eta + 'T16:00:00Z',
    status: status === 'Delivered' ? 'Completed' : 'Pending',
    transportMode: 'Delivery',
    vehicleNumber: status === 'Delivered' ? 'DEL-789' : 'TBD',
    weather: status === 'Delivered' ? 'Clear, 20°C' : 'Expected: Clear, 20°C',
    milestoneType: 'end'
  });
  
  return milestones;
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
        milestones: createShipmentMilestones("Stockholm, Sweden", "Berlin, Germany", "In Transit", "2025-07-20", "Road"),
        loggerData: [
          {
            loggerId: "LG-1001",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-20T08:00:00Z",
            temperature: "6°C",
            deliveryId: "DEL-2025-004",
            alarms: 0,
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            events: [],
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", 5, 42),
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
        milestones: createShipmentMilestones("Macclesfield, UK", "Tokyo, Japan", "In Transit", "2025-07-20", "Air"),
        loggerData: [
          {
            loggerId: "SENTRY-1002",
            loggerType: "Sentry",
            loggerStarted: "2025-07-14T08:00:00Z",
            loggerEnded: "n/a",
            temperature: "6°C",
            deliveryId: "DEL-2025-002",
            timeSeriesData: generateTimeSeriesData("2025-07-14T08:00:00Z", null, 6, 50),
         
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
              lowThreshold: "2 °C"
            }
          },
          {
            loggerId: "SENTINEL-1002",
            loggerType: "Sentinel",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "n/a",
            temperature: "6°C",
            deliveryId: "DEL-2025-003",
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", null, 6, 48),
         
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
        milestones: createShipmentMilestones("Stockholm, Sweden", "Berlin, Germany", "Delivered", "2025-07-20", "Air"),
        loggerData: [
          {
            loggerId: "LG-1001",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-20T08:00:00Z",
            temperature: "n/a",
            deliveryId: "DEL-2025-011",
            alarms: 0,
            rootCauseAnalysis: null,
            rootCauseAnalysisStatusDetails: null,
            events: [],
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", 5, 42),
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
        milestones: createShipmentMilestones("Macclesfield, UK", "Tokyo, Japan", "Delivered", "2025-07-20", "Air"),
        loggerData: [
          {
            loggerId: "WL-1002",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-20T08:00:00Z",
            temperature: "6°C",
            deliveryId: "DEL-2025-005",
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", 7, 55),
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
            loggerId: "WL-1003",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-20T08:00:00Z",
            temperature: "n/a",
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", 6, 48),
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
        milestones: createShipmentMilestones("Macclesfield, UK", "Tokyo, Japan", "Delivered", "2025-06-20", "Air"),
        loggerData: [
          {
            loggerId: "WL-1006A",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-06-10T08:00:00Z",
            loggerEnded: "2025-06-20T08:00:00Z",
            temperature: "n/a",
            timeSeriesData: generateTimeSeriesData("2025-06-10T08:00:00Z", "2025-06-20T08:00:00Z", 8, 52),
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
            timeSeriesData: generateTimeSeriesData("2025-06-10T08:00:00Z", "2025-06-20T08:00:00Z", 7, 49),
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
        milestones: createShipmentMilestones("Paris, France", "Madrid, Spain", "In Transit", "2025-08-20", "Road"),
        loggerData: [
          {
            loggerId: "WB-1014C",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-08-10T08:00:00Z",
            loggerEnded: "n/a",
            temperature: "n/a",
            timeSeriesData: generateTimeSeriesData("2025-08-10T08:00:00Z", null, 4, 38),
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
            loggerEnded: "n/a",
            temperature: "n/a",
            timeSeriesData: generateTimeSeriesData("2025-08-10T08:00:00Z", null, 5, 41),
       
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
        milestones: createShipmentMilestones("Paris, France", "Madrid, Spain", "Delivered", "2025-07-13", "Road"),
        shipmentCurrentMilestone: [],
        loggerData: [
          {
            loggerId: "WB-1015A",
            loggerType: "Web Logger 2",
            loggerStarted: "2025-07-10T08:00:00Z",
            loggerEnded: "2025-07-13T08:00:00Z",
            temperature: "n/a",
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-13T08:00:00Z", 3, 35),
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
            deliveryId: "DEL-010",
            timeSeriesData: generateTimeSeriesData("2025-07-10T08:00:00Z", "2025-07-13T08:00:00Z", 4, 37),
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