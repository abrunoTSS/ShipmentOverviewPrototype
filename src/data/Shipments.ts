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

// Helper to generate time-series with sustained high temperature from a specific timestamp
function generateTempDataWithSustainedHigh(
  startDate: string,
  endDate: string | null,
  loggerType: string,
  baseTemp: number = 6,
  baseHumidity: number = 45,
  sustainStartISO: string,
  sustainTemp: number = 25
): LoggerTimeSeriesData[] {
  const data: LoggerTimeSeriesData[] = [];
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const sustainStart = new Date(sustainStartISO);

  const intervalMs = 15 * 60 * 1000;
  let current = new Date(start);

  while (current <= end) {
    let temperature = baseTemp + (Math.random() - 0.5) * 2;
    let humidity = baseHumidity + (Math.random() - 0.5) * 10;

    if (current >= sustainStart) {
      // Hold around sustainTemp with small jitter
      temperature = sustainTemp + (Math.random() - 0.5) * 0.6;
    }

    const dataPoint: LoggerTimeSeriesData = {
      timestamp: current.toISOString(),
      temperature: Math.round(temperature * 10) / 10,
    };

    if ((loggerType.includes('Sentinel') || loggerType.includes('Sentry')) && !loggerType.includes('Web Logger')) {
      dataPoint.humidity = Math.round(humidity * 10) / 10;
    }

    data.push(dataPoint);
    current = new Date(current.getTime() + intervalMs);
  }

  return data;
}

// Helper function to generate temperature data with specific alarm spikes
function generateTempDataWithAlarmSpikes(
  startDate: string,
  endDate: string | null,
  loggerType: string,
  baseTemp: number = 6,
  baseHumidity: number = 45,
  alarmSpikes: Array<{
    startTime: string;
    endTime: string;
    peakTemp: number;
  }> = []
): LoggerTimeSeriesData[] {
  const data: LoggerTimeSeriesData[] = [];
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const intervalMs = 15 * 60 * 1000; // 15 minutes
  let current = new Date(start);
  
  // Parse alarm periods
  const alarmPeriods = alarmSpikes.map(spike => ({
    startTime: new Date(spike.startTime.replace(' ', 'T') + ':00.000Z'),
    endTime: new Date(spike.endTime.replace(' ', 'T') + ':00.000Z'),
    peakTemp: spike.peakTemp
  }));
  
  while (current <= end) {
    let temperature = baseTemp;
    let humidity = baseHumidity;
    
    // Add normal variation
    const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
    const humidityVariation = (Math.random() - 0.5) * 20; // ±10% variation
    
    temperature = baseTemp + tempVariation;
    humidity = baseHumidity + humidityVariation;
    
    // Check if current time falls within any alarm period
    alarmPeriods.forEach(period => {
      if (current >= period.startTime && current <= period.endTime) {
        const totalDuration = period.endTime.getTime() - period.startTime.getTime();
        const currentProgress = current.getTime() - period.startTime.getTime();
        const progressRatio = currentProgress / totalDuration;
        
        // Create a spike pattern: gradual rise to peak, then gradual fall
        let spikeMultiplier = 0;
        if (progressRatio <= 0.5) {
          // Rising phase
          spikeMultiplier = progressRatio * 2;
        } else {
          // Falling phase
          spikeMultiplier = 2 - (progressRatio * 2);
        }
        
        const spike = (period.peakTemp - baseTemp) * spikeMultiplier;
        temperature = baseTemp + spike + (tempVariation * 0.3); // Reduced normal variation during spike
      }
    });
    
    const dataPoint: LoggerTimeSeriesData = {
      timestamp: current.toISOString(),
      temperature: Math.round(temperature * 10) / 10,
    };
    
    if (loggerType.includes('Sentinel') || loggerType.includes('Sentry')) {
      dataPoint.humidity = Math.round(humidity * 10) / 10;
    }
    
    data.push(dataPoint);
    current = new Date(current.getTime() + intervalMs);
  }
  
  return data;
}

// Helper function to generate temperature data with mission end issues
function generateTempDataWithMissionEndIssue(
  startDate: string, 
  normalEndDate: string,
  loggerType: string,
  baseTemp: number = 6
): LoggerTimeSeriesData[] {
  const data: LoggerTimeSeriesData[] = [];
  const start = new Date(startDate);
  const normalEnd = new Date(normalEndDate);
  const extendedEnd = new Date(normalEnd.getTime() + (24 * 60 * 60 * 1000)); // 24 hours after normal end
  
  const intervalMs = 15 * 60 * 1000; // 15 minutes
  let current = new Date(start);
  
  while (current <= extendedEnd) {
    let temperature = baseTemp;
    let humidity = 45;
    
    // Normal temperature until mission should have ended
    if (current <= normalEnd) {
      const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
      temperature = baseTemp + tempVariation;
      const humidityVariation = (Math.random() - 0.5) * 20; // ±10% variation
      humidity = 45 + humidityVariation;
    } else {
      // Temperature rises after mission should have ended (mission not stopped)
      const hoursAfterEnd = (current.getTime() - normalEnd.getTime()) / (60 * 60 * 1000);
      const tempIncrease = Math.min(hoursAfterEnd * 0.9, 22); // Gradual increase up to 28°C
      temperature = baseTemp + tempIncrease + (Math.random() - 0.5) * 2;
      humidity = 45 + (Math.random() - 0.5) * 30; // More variation in humidity
    }
    
    const dataPoint: LoggerTimeSeriesData = {
      timestamp: current.toISOString(),
      temperature: Math.round(temperature * 10) / 10,
    };
    
    if (loggerType.includes('Sentinel') || loggerType.includes('Sentry')) {
      dataPoint.humidity = Math.round(humidity * 10) / 10;
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
    distance: 522,
    co2Emissions: 32.36,
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
    alarms: 9,
    events: 4,
    rcas: "Not Started",
    distance: 9560,
    co2Emissions: 2437.8,
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
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-09-22T08:00:00Z", null, "Sentry", 6, 50, [
          {
            startTime: "2025-09-22 10:00",
            endTime: "2025-09-22 12:45",
            peakTemp: 25
          }
        ]),
        alarmTypes: ["Temperature", "Humidity"],
        // Transformed alarms: collapsed duplicate Temperature alarms into a single Temperature alarm.
        // NOTE: excursion timestamps are in July 2025 while shipment milestones are in Sept 2025 — flagged.
        alarms: [
          {
            alarmId: 1,
            alarmType: "Temperature",
            excursion: {
              id: 1,
              highest: "25°C",
              // keeping the original earliest start / latest end summarised (original entries were 2025-07-15 09:00 and 2025-07-17 09:30 -> 2025-07-15 09:00 to 2025-07-17 10:45)
              startTime: "2025-09-22 10:00",
              endTime: "2025-09-22 12:45",
              duration: "2d 1h 45m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          },
          {
            alarmId: 2,
            alarmType: "Humidity",
            excursion: {
              id: 2,
              highest: "70%",
              // original single Humidity excursion was 2025-07-17 09:30 to 2025-07-17 10:45
              startTime: "2025-09-22 10:00",
              endTime: "2025-09-22 12:45",
              duration: "1h 15m",
              type: "Humidity"
            }
          }
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        productDetails: {
          prodfilename: "Insulin-2",
          producttype: "controlled room temperature",
          temperatureProfile: "profile",
          highThreshold: "12 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTRY-1003",
        loggerType: "Sentry",
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-003",
        tempProfile: "controlled room temperature",
        serialNumber: 3,
        alarmTypes: ["Temperature", "Shock", "Tilt", "Pressure", "Light"],
        // Original had 2 Temperature alarms and no Shock alarm -> collapse Temps and add a placeholder Shock alarm
        alarms: [
          {
            alarmId: 1,
            alarmType: "Temperature",
            excursion: {
              id: 1,
              highest: "25°C",
              // summarised from the two original temp entries: earliest start 2025-07-15 09:00, latest end 2025-07-17 10:45
              startTime: "2025-07-22 10:00",
              endTime: "2025-09-22 12:45",
              duration: "2d 1h 45m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm",
            }
          },
          {
            alarmId: 2,
            alarmType: "Shock",
            excursion: {
              id: 2,
              type: "Shock",
              highest: "N/A",
              startTime: "2025-09-21T16:45:00Z",
              endTime: "2025-09-21T16:45:00Z",
              duration: "N/A"
            }
          },
          {
            alarmId: 3,
            alarmType: "Tilt",
            excursion: {
              id: 3,
              highest: "45°",
              startTime: "2025-09-21 14:15",
              endTime: "2025-09-21 14:18",
              duration: "3 min",
              type: "Tilt",
            }
          },
          {
            alarmId: 4,
            alarmType: "Pressure",
            excursion: {
              id: 4,
              highest: "1.2 bar",
              startTime: "2025-09-22 06:45",
              endTime: "2025-09-22 07:30",
              duration: "45 min",
              type: "Pressure",
            }
          },
          {
            alarmId: 5,
            alarmType: "Light",
            excursion: {
              id: 5,
              highest: "850 lux",
              startTime: "2025-09-22 12:00",
              endTime: "2025-09-22 12:25",
              duration: "25 min",
              type: "Light",
            }
          }
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-09-22T08:00:00Z", null, "Sentinel", 6, 45, [
          {
            startTime: "2025-09-22 14:00",
            endTime: "2025-09-22 16:45",
            peakTemp: 25
          }
        ]),
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
    shipmentId: "SH003",
    origin: "Stockholm, Sweden",
    destination: "Berlin, Germany",
    eta: "2025-07-10T08:00:00Z",
    status: "Delivered",
    loggers: 2,
    freightForwarder: "DHL",
    currentLocation: "n/a",
    modeOfTransport: "Air",
    packagingType: "Insulated Box",
    alarms: 2,
    events: 0,
    rcas: "n/a",
    distance: 522,
    co2Emissions: 133.11,
    milestones: [
      {
        type: "origin",
        location: "Stockholm, Sweden",
        status: "Completed",
        milestoneName: "Departure from Stockholm Arlanda Hub",
        groundHandler: "DHL",
        arrivalTime: "2025-07-10T08:00:00Z",
        departedTime: "2025-07-10T11:30:00Z",
        transportMode: "Road",
        vehicleNumber: "SH12345",
        weatherConditions: "Clear, 18°C"
      },
      {
        type: "milestone",
        location: "Frankfurt, Germany",
        status: "Completed",
        milestoneName: "Wait Frankfurt Hub",
        groundHandler: "DHL",
        arrivalTime: "2025-07-10T13:15:00Z",
        departedTime: "2025-07-11T08:45:00Z",
        transportMode: "Road",
        vehicleNumber: "SH12345",
        weatherConditions: "Partly cloudy, 22°C"
      },
      {
        type: "destination",
        location: "Berlin, Germany",
        status: "Completed",
        milestoneName: "Arrival at Berlin Brandenburg",
        groundHandler: "DHL",
        arrivalTime: "2025-07-11T17:00:00Z",
        transportMode: "Road",
        vehicleNumber: "SH12345",
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
        missionEnded: "2025-07-11T18:00:00Z",
        alarms: [
          {
            alarmId: 1,
            alarmType: "Temperature",
            excursion: {
              id: 1,
              highest: "25.2°C",
              startTime: "2025-07-11 09:30",
              endTime: "2025-07-11 10:15",
              duration: "45 min",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          },
        ],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-07-10T08:00:00Z", "2025-07-11T18:00:00Z", "Web Logger 2", 6, 45, [
          {
            startTime: "2025-07-11 09:30",
            endTime: "2025-07-11 10:15",
            peakTemp: 25.2
          },
          {
            startTime: "2025-07-11 14:20",
            endTime: "2025-07-11 14:40",
            peakTemp: 15.8
          }
        ]),
        productDetails: {
          prodfilename: "Insulin-3",
          producttype: "controlled room temperature",
          temperatureProfile: "profile",
          highThreshold: "12 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "LG-1002",
        loggerType: "Web Logger 2",
        deliveryId: "DL-1002",
        tempProfile: "controlled room temperature",
        serialNumber: 2,
        missionStarted: "2025-07-10T08:00:00Z",
        missionEnded: "2025-07-11T18:00:00Z",
        alarms: [
          {
            alarmId: 1,
            alarmType: "Temperature",
            excursion: {
              id: 1,
              highest: "25.0°C",
              startTime: "2025-07-10 10:30",
              endTime: "2025-07-11 18:00",
              duration: "1d 7h 30m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          }
        ],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithSustainedHigh(
          "2025-07-10T08:00:00Z",
          "2025-07-11T18:00:00Z",
          "Web Logger 2",
          6,
          45,
          "2025-07-10T10:30:00Z",
          25
        ),
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
    distance: 9560,
    co2Emissions: 2437.8,
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
        // Converted excursionMilestones -> single excursion per alarm
        alarms: [
          {
            alarmId: 1,
            alarmType: "Temperature",
            excursion: {
              id: 1,
              highest: "25°C",
              // excursion was present in the second milestone item for alarm 1
              startTime: "2025-07-15 10:00",
              endTime: "2025-07-15 11:15",
              duration: "1h 15m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          },
          {
            alarmId: 2,
            alarmType: "Temperature",
            excursion: {
              id: 2,
              highest: "25°C",
              // excursion found in the Amsterdam lane for alarm 2
              startTime: "2025-07-17 10:00",
              endTime: "2025-07-17 11:00",
              duration: "1h 00m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          }
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", "Web Logger 2", 6, 45, [
          {
            startTime: "2025-07-15 09:00",
            endTime: "2025-07-15 10:15",
            peakTemp: 25
          },
          {
            startTime: "2025-07-17 09:30",
            endTime: "2025-07-17 11:00",
            peakTemp: 25
          }
        ]),
        productDetails: {
          prodfilename: "Insulin-2",
          producttype: "controlled room temperature",
          temperatureProfile: "profile",
          highThreshold: "12 °C",
          lowThreshold: "2 °C"
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
            excursion: {
              id: 1,
              highest: "25°C",
              startTime: "2025-07-15 10:00",
              endTime: "2025-07-15 11:15",
              duration: "1h 15m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          },
          {
            alarmId: 2,
            alarmType: "Temperature",
            excursion: {
              id: 2,
              highest: "25°C",
              startTime: "2025-07-17 09:30",
              endTime: "2025-07-17 11:00",
              duration: "1h 30m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          }
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", "Web Logger 2", 8, 50, [
          {
            startTime: "2025-07-15 09:00",
            endTime: "2025-07-15 10:15",
            peakTemp: 25
          },
          {
            startTime: "2025-07-17 09:30",
            endTime: "2025-07-17 11:00",
            peakTemp: 25
          }
        ]),
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
    distance: 9560,
    co2Emissions: 2437.8,
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
            excursion: {
              id: 1,
              highest: "25°C",
              // #1 excursion was during Heathrow transfer on 2025-06-15 09:00-10:15
              startTime: "2025-06-15 09:00",
              endTime: "2025-06-15 10:15",
              duration: "1h 15m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          },
          {
            alarmId: 2,
            alarmType: "Temperature",
            excursion: {
              id: 2,
              highest: "25°C",
              // #2 excursion found in Amsterdam lane on 2025-06-17 09:30 with departedTime 11:00
              startTime: "2025-06-17 09:30",
              endTime: "2025-06-17 11:00",
              duration: "1h 30m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          }
        ],
        evaluation: "Pending",
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
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-06-10T08:00:00Z", "2025-06-20T08:00:00Z", "Web Logger 2", 6, 45, [
          {
            startTime: "2025-06-15 09:00",
            endTime: "2025-06-15 10:15",
            peakTemp: 25
          },
          {
            startTime: "2025-06-17 09:30",
            endTime: "2025-06-17 11:00",
            peakTemp: 25
          }
        ]),
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
            excursion: {
              id: 1,
              highest: "25°C",
              startTime: "2025-06-15 09:00",
              endTime: "2025-06-15 10:15",
              duration: "1h 15m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          },
          {
            alarmId: 2,
            alarmType: "Temperature",
            excursion: {
              id: 2,
              highest: "25°C",
              startTime: "2025-06-17 09:30",
              endTime: "2025-06-17 11:00",
              duration: "1h 30m",
              type: "Temperature",
              temperatureProfile: "High Threshold Alarm"
            }
          }
        ],
        evaluation: "Completed",
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
    distance: 0,
    co2Emissions: 0,
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
    distance: 0,
    co2Emissions: 0,
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
    shipmentId: "SH016",
    origin: "London, UK",
    destination: "Paris, France",
    eta: "2025-09-20",
    etd: "2025-09-18",
    status: "Delivered",
    loggers: 10,
    freightForwarder: "DHL",
    currentLocation: "Paris, France",
    modeOfTransport: "Road",
    packagingType: "Insulated Container",
    alarms: 4,
    events: 8,
    rcas: "In Progress",
    distance: 344,
    co2Emissions: 87.7,
    milestones: [
      {
        type: "origin",
        location: "London, UK",
        status: "Completed",
        milestoneName: "Departure from London",
        groundHandler: "DHL",
        arrived: "2025-09-18T06:00:00Z",
        delivered: "2025-09-18T08:00:00Z",
        transportMode: "Road",
        vehicleNumber: "DHL-T789",
        weatherConditions: "Clear, 18°C"
      },
      {
        type: "milestone",
        location: "Calais, France",
        status: "Completed",
        milestoneName: "Channel Crossing",
        groundHandler: "DHL",
        arrived: "2025-09-18T12:30:00Z",
        delivered: "2025-09-18T14:00:00Z",
        transportMode: "Ferry",
        vehicleNumber: "Ferry-CH01",
        weatherConditions: "Partly cloudy, 16°C"
      },
      {
        type: "destination",
        location: "Paris, France",
        status: "Completed",
        milestoneName: "Arrival in Paris",
        groundHandler: "DHL",
        arrived: "2025-09-18T18:00:00Z",
        delivered: "2025-09-18T20:00:00Z",
        transportMode: "Road",
        vehicleNumber: "DHL-T789",
        weatherConditions: "Clear, 20°C"
      }
    ],
    loggerData: [
      {
        loggerId: "SENTINEL-2001",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-18T20:00:00Z",
        deliveryId: "DLV-016-01",
        tempProfile: "cold chain",
        serialNumber: 2001,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", "Delivered", 5, 45),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2002",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-18T20:00:00Z",
        deliveryId: "DLV-016-02",
        tempProfile: "cold chain",
        serialNumber: 2002,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", "Delivered", 4, 50),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2003",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-18T20:00:00Z",
        deliveryId: "DLV-016-03",
        tempProfile: "cold chain",
        serialNumber: 2003,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", "Delivered", 6, 42),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2004",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-18T20:00:00Z",
        deliveryId: "DLV-016-04",
        tempProfile: "cold chain",
        serialNumber: 2004,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", "Delivered", 5, 48),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2005",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-18T20:00:00Z",
        deliveryId: "DLV-016-05",
        tempProfile: "cold chain",
        serialNumber: 2005,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", "Delivered", 4, 46),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2006",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-18T20:00:00Z",
        deliveryId: "DLV-016-06",
        tempProfile: "cold chain",
        serialNumber: 2006,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", "Delivered", 6, 44),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2007",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-18T20:00:00Z",
        deliveryId: "DLV-016-07",
        tempProfile: "cold chain",
        serialNumber: 2007,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", "Delivered", 5, 47),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2008",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-18T20:00:00Z",
        deliveryId: "DLV-016-08",
        tempProfile: "cold chain",
        serialNumber: 2008,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", "Delivered", 4, 49),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2009",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-016-09",
        tempProfile: "cold chain",
        serialNumber: 2009,
        alarms: [
          {
            alarmId: 1,
            alarmType: "Temperature",
            errorMessage: "Temperature exceeded threshold",
            excursion: {
              id: 1,
              highest: "28.5°C",
              startTime: "2025-09-18T21:15:00Z",
              endTime: "2025-09-19T18:00:00Z",
              duration: "20h 45m",
              type: "Temperature",
              temperatureProfile: "Cold chain breach - mission not stopped"
            }
          }
        ],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: "Under Investigation",
        rootCauseAnalysisStatusDetails: {
          status: "In Progress",
          details: "Logger mission not properly stopped, causing temperature rise",
          UTCDateStarted: "2025-09-19T08:00:00Z",
          evaluatedBy: "Quality Team",
          type: "Mission Management",
          primaryRootCause: "Logger not stopped after delivery",
          reason: "Operational error - mission end procedure not followed"
        },
        timeSeriesData: generateTempDataWithMissionEndIssue("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", 5),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-2010",
        loggerType: "Sentinel",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-016-10",
        tempProfile: "cold chain",
        serialNumber: 2010,
        alarms: [
          {
            alarmId: 1,
            alarmType: "Temperature",
            errorMessage: "Temperature exceeded threshold",
            excursion: {
              id: 1,
              highest: "27.8°C",
              startTime: "2025-09-18T22:30:00Z",
              endTime: "2025-09-19T18:00:00Z",
              duration: "19h 30m",
              type: "Temperature",
              temperatureProfile: "Cold chain breach - mission not stopped"
            }
          }
        ],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: "Under Investigation",
        rootCauseAnalysisStatusDetails: {
          status: "In Progress",
          details: "Logger mission not properly stopped, causing temperature rise",
          UTCDateStarted: "2025-09-19T08:00:00Z",
          evaluatedBy: "Quality Team",
          type: "Mission Management",
          primaryRootCause: "Logger not stopped after delivery",
          reason: "Operational error - mission end procedure not followed"
        },
        timeSeriesData: generateTempDataWithMissionEndIssue("2025-09-18T06:00:00Z", "2025-09-18T20:00:00Z", "Sentinel", 4),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      }
    ]
  },
  {
    shipmentId: "SH017",
    origin: "Amsterdam, Netherlands",
    destination: "Brussels, Belgium",
    eta: "2025-09-25",
    etd: "2025-09-24",
    status: "In Transit",
    loggers: 10,
    freightForwarder: "Geodis",
    currentLocation: "Rotterdam, Netherlands",
    modeOfTransport: "Road",
    packagingType: "Insulated Box",
    alarms: 0,
    events: 2,
    rcas: "Not Started",
    distance: 174,
    co2Emissions: 44.3,
    milestones: [
      {
        type: "origin",
        location: "Amsterdam, Netherlands",
        status: "Completed",
        milestoneName: "Departure from Amsterdam",
        groundHandler: "Geodis",
        arrived: "2025-09-24T07:00:00Z",
        delivered: "2025-09-24T09:00:00Z",
        transportMode: "Road",
        vehicleNumber: "FX-T456",
        weatherConditions: "Clear, 16°C"
      },
      {
        type: "milestone",
        location: "Rotterdam, Netherlands",
        status: "Current",
        milestoneName: "Transit through Rotterdam",
        groundHandler: "Geodis",
        arrivalTime: "2025-09-24T12:00:00Z",
        etd: "2025-09-24T15:00:00Z",
        transportMode: "Road",
        vehicleNumber: "FX-T456",
        weatherConditions: "Partly cloudy, 14°C"
      },
      {
        type: "destination",
        location: "Brussels, Belgium",
        status: "Pending",
        milestoneName: "Arrival in Brussels",
        groundHandler: "Geodis",
        eta: "2025-09-25T08:00:00Z",
        etd: "2025-09-25T10:00:00Z",
        transportMode: "Road",
        vehicleNumber: "FX-T456",
        weatherConditions: "Expected: Light rain, 12°C"
      }
    ],
    loggerData: [
      {
        loggerId: "SENTINEL-3001",
        loggerType: "Sentinel",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-01",
        tempProfile: "cold chain",
        serialNumber: 3001,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel", "In Transit", 5, 45),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3002",
        loggerType: "Sentinel",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-02",
        tempProfile: "cold chain",
        serialNumber: 3002,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel", "In Transit", 4, 50),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3003",
        loggerType: "Sentinel",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-03",
        tempProfile: "cold chain",
        serialNumber: 3003,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel", "In Transit", 6, 42),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3004",
        loggerType: "Sentinel",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-04",
        tempProfile: "cold chain",
        serialNumber: 3004,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel", "In Transit", 5, 48),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3005",
        loggerType: "Sentinel",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-05",
        tempProfile: "cold chain",
        serialNumber: 3005,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel", "In Transit", 4, 46),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3006",
        loggerType: "Sentinel",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-06",
        tempProfile: "cold chain",
        serialNumber: 3006,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel", "In Transit", 6, 44),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3007",
        loggerType: "Sentinel",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-07",
        tempProfile: "cold chain",
        serialNumber: 3007,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel", "In Transit", 5, 47),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3008",
        loggerType: "Sentinel",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-08",
        tempProfile: "cold chain",
        serialNumber: 3008,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel", "In Transit", 4, 49),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3009",
        loggerType: "Sentinel",
        missionStarted: "n/a",
        missionEnded: "n/a",
        deliveryId: "DLV-017-09",
        tempProfile: "cold chain",
        serialNumber: 3009,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: {
          status: "Not Started",
          details: "Logger mission not started - no temperature monitoring active",
          UTCDateStarted: undefined,
          evaluatedBy: "Operations Team",
          type: "Mission Management",
          primaryRootCause: "Logger not activated",
          reason: "Operational error - mission start procedure not followed"
        },
        timeSeriesData: [], // No data - mission not started
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "SENTINEL-3010",
        loggerType: "Sentinel",
        missionStarted: "n/a",
        missionEnded: "n/a",
        deliveryId: "DLV-017-10",
        tempProfile: "cold chain",
        serialNumber: 3010,
        alarms: [],
        alarmTypes: ["Temperature", "Humidity"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: {
          status: "Not Started",
          details: "Logger mission not started - no temperature monitoring active",
          UTCDateStarted: undefined,
          evaluatedBy: "Operations Team",
          type: "Mission Management",
          primaryRootCause: "Logger not activated",
          reason: "Operational error - mission start procedure not followed"
        },
        timeSeriesData: [], // No data - mission not started
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      }
    ]
  }
];