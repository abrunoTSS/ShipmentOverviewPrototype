import type { Shipment, LoggerTimeSeriesData } from '../types';

// Helper function to generate time-series data with validation
function generateTimeSeriesData(
  startDate: string, 
  endDate: string | null, 
  loggerType: string,
  shipmentStatus: string,
  baseTemp: number = 6, 
  _baseHumidity: number = 45
): LoggerTimeSeriesData[] {
  const data: LoggerTimeSeriesData[] = [];
  
  // webLogger-IIs should only have temperature data if shipment is departed
  if (loggerType.includes('webLogger-II') && shipmentStatus !== 'Delivered') {
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
    
    const dataPoint: LoggerTimeSeriesData = {
      timestamp: current.toISOString(),
      temperature: Math.round((baseTemp + tempVariation) * 10) / 10,
    };
    
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
  _baseHumidity: number = 45,
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

    if (current >= sustainStart) {
      // Hold around sustainTemp with small jitter
      temperature = sustainTemp + (Math.random() - 0.5) * 0.6;
    }

    const dataPoint: LoggerTimeSeriesData = {
      timestamp: current.toISOString(),
      temperature: Math.round(temperature * 10) / 10,
    };

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
  _baseHumidity: number = 45,
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
    // humidity removed
    
    // Add normal variation
    const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
    // humidity removed
    
    temperature = baseTemp + tempVariation;
    
    
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
    
    // Normal temperature until mission should have ended
    if (current <= normalEnd) {
      const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
      temperature = baseTemp + tempVariation;
      // humidity removed
    } else {
      // Temperature rises after mission should have ended (mission not stopped)
      const hoursAfterEnd = (current.getTime() - normalEnd.getTime()) / (60 * 60 * 1000);
      const tempIncrease = Math.min(hoursAfterEnd * 0.9, 22); // Gradual increase up to 28°C
      temperature = baseTemp + tempIncrease + (Math.random() - 0.5) * 2;
      // humidity removed
    }
    
    const dataPoint: LoggerTimeSeriesData = {
      timestamp: current.toISOString(),
      temperature: Math.round(temperature * 10) / 10,
    };
    
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
    profileType: "Cold Chain",
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
        arrived: "2025-09-22T08:00:00 CET",
        departed: "2025-09-22T10:00:00 CET",
        transportMode: "Road",
        vehicleNumber: "T1234",
      },
      {
        type: "milestone",
        location: "Copenhagen, Denmark",
        status: "Completed",
        milestoneName: "Transit through Copenhagen",
        groundHandler: "Geodis",
        arrived: "2025-09-22T14:30:00 CET",
        departed: "2025-09-22T15:30:00 CET",
        transportMode: "Road",
        vehicleNumber: "T1234",
      },
      {
        type: "milestone",
        location: "Hamburg, Germany",
        status: "Completed",
        milestoneName: "Transit through Hamburg",
        groundHandler: "Geodis",
        arrived: "2025-09-22T18:45:00 CET",
        departed: "2025-09-22T22:30:00 CET",
        transportMode: "Road",
        vehicleNumber: "T1234",
      },
      {
        type: "milestone",
        location: "In Transit",
        status: "Current",
        milestoneName: "In Transit",
        groundHandler: "Geodis",
        arrived: "2025-09-22T22:30:00 CET",
        transportMode: "Road",
        vehicleNumber: "T1234",
      },
      {
        type: "destination",
        location: "Berlin, Germany",
        status: "Pending",
        milestoneName: "Arrival in Berlin",
        groundHandler: "Geodis",
        eta: "2025-09-23T08:00:00 CET",
        etd: "2025-09-23T10:00:00 CET",
        transportMode: "Road",
        vehicleNumber: "T1234",
      }
    ],
    evaluation: "n/a",
    distance: 522,
    co2Emissions: 32.36,
    loggerData: [
      {
        loggerId: "LG-1001",
        loggerType: "webLogger-II",
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-001",
        tempProfile: "CRT",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "webLogger-II", "In Transit", 5, 42),
        productDetails: {
          prodfilename: "Insulin-3",
          producttype: "CRT",
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
    profileType: "Frozen",
    alarms: 2,
    events: 4,
    evaluation: "Not Started",
    distance: 9560,
    co2Emissions: 2437.8,
    milestones: [
      {
        type: "origin",
        location: "Macclesfield, UK",
        status: "Completed",
        milestoneName: "Departure from Macclesfield",
        groundHandler: "Geodis",
        arrived: "2025-09-21T06:00:00 GMT",
        departed: "2025-09-21T08:00:00 GMT",
        transportMode: "Road",
        vehicleNumber: "T2456",
      },
      {
        type: "milestone",
        location: "Heathrow Airport, UK",
        status: "Completed",
        milestoneName: "Departure from Heathrow",
        groundHandler: "British Airways",
        arrived: "2025-09-21T10:30:00 GMT",
        departed: "2025-09-21T14:15:00 GMT",
        transportMode: "Air",
        vehicleNumber: "F8901",
      },
      {
        type: "milestone",
        location: "Amsterdam, Netherlands",
        status: "Completed",
        milestoneName: "Transit through Amsterdam Schiphol",
        groundHandler: "KLM",
        arrived: "2025-09-21T16:45:00 CET",
        departed: "2025-09-21T18:45:00 CET",
        transportMode: "Air",
        vehicleNumber: "F3456",
      },
      {
        type: "milestone",
        location: "In Transit",
        status: "Current",
        milestoneName: "In Transit",
        groundHandler: "KLM",
        transportMode: "Air",
        vehicleNumber: "F3456",
        eta: "2025-09-21T18:45:00 CET"
      },
      {
        type: "milestone",
        location: "Dubai, UAE",
        status: "Pending",
        milestoneName: "Transit through Dubai",
        groundHandler: "Emirates",
        eta: "2025-09-22T02:30:00 GST",
        etd: "2025-09-22T06:15:00 GST",
        transportMode: "Air",
        vehicleNumber: "F7890",
      },
      {
        type: "destination",
        location: "Tokyo, Japan",
        status: "Pending",
        milestoneName: "Arrival at Narita Airport",
        groundHandler: "Japan Airlines",
        eta: "2025-09-22T14:30:00 JST",
        transportMode: "Air",
        vehicleNumber: "F1122",
      }
    ],
    loggerData: [
      {
        loggerId: "Sentinel-100L-100L-1002",
        loggerType: "Sentinel-100L-100L",
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-002",
        tempProfile: "Frozen",
        serialNumber: 2,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-09-22T08:00:00Z", null, "Sentinel-100L-100L", 6, 50, [
          {
            startTime: "2025-09-22 10:00",
            endTime: "2025-09-22 12:45",
            peakTemp: 25
          }
        ]),
        alarmTypes: ["Temperature"],
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
          }
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        productDetails: {
          prodfilename: "Insulin-2",
          producttype: "CRT",
          temperatureProfile: "profile",
          highThreshold: "12 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-100L-1003",
        loggerType: "Sentinel-100L-100L",
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-003",
        tempProfile: "Frozen",
        serialNumber: 3,
        alarmTypes: ["Temperature"],
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
          }
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-09-22T08:00:00Z", null, "Sentinel-100L", 6, 45, [
          {
            startTime: "2025-09-22 14:00",
            endTime: "2025-09-22 16:45",
            peakTemp: 25
          }
        ]),
        productDetails: {
          prodfilename: "Insulin-2",
          producttype: "CRT",
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
    profileType: "CRT",
    alarms: 2,
    events: 4,
    evaluation: "Not Started",
    distance: 9560,
    co2Emissions: 2437.8,
    milestones: [
      {
        type: "origin",
        location: "Macclesfield, UK",
        status: "Completed",
        milestoneName: "Departure from Macclesfield",
        groundHandler: "DHL",
        arrivalTime: "2025-07-10T06:00:00 GMT",
        departedTime: "2025-07-10T08:00:00 GMT",
        transportMode: "Road",
        vehicleNumber: "T3456",
      },
      {
        type: "milestone",
        location: "Heathrow Airport, UK",
        status: "Completed",
        milestoneName: "Departure from Heathrow",
        groundHandler: "British Airways",
        arrivalTime: "2025-07-10T10:30:00 GMT",
        departedTime: "2025-07-10T14:15:00 GMT",
        transportMode: "Air",
        vehicleNumber: "F4567",
      },
      {
        type: "milestone",
        location: "Dubai, UAE",
        status: "Completed",
        milestoneName: "Transit through Dubai",
        groundHandler: "Emirates",
        arrivalTime: "2025-07-10T22:45:00 GST",
        departedTime: "2025-07-11T02:30:00 GST",
        transportMode: "Air",
        vehicleNumber: "F8901",
      },
      {
        type: "destination",
        location: "Tokyo, Japan",
        status: "Completed",
        milestoneName: "Arrival at Narita Airport",
        groundHandler: "Japan Airlines",
        arrivalTime: "2025-07-20T08:00:00 JST",
        transportMode: "Air",
        vehicleNumber: "F2345",
      }
    ],
    loggerData: [
      {
        loggerId: "WL-1004A",
        loggerType: "webLogger-II",
        deliveryId: "DL-1004A",
        tempProfile: "CRT",
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
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", "webLogger-II", 6, 45, [
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
          producttype: "CRT",
          temperatureProfile: "profile",
          highThreshold: "12 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "WL-1004B",
        loggerType: "webLogger-II",
        deliveryId: "DL-1004B",
        tempProfile: "CRT",
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
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", "webLogger-II", 8, 50, [
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
          producttype: "CRT",
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
    profileType: "Cold Chain",
    alarms: 0,
    totalAlarms: 0,
    events: 0,
    evaluation: "Not Started",
    distance: 0,
    co2Emissions: 0,
    milestones: [],
    loggerData: [
      {
        loggerId: "WB-1014C",
        loggerType: "webLogger-II",
        deliveryId: "DL-1006",
        tempProfile: "CRT",
        serialNumber: 3,
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "webLogger-II", "In Transit", 5, 40),
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
        loggerType: "webLogger-II",
        deliveryId: "DL-1007",
        tempProfile: "CRT",
        serialNumber: 2,
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "webLogger-II", "In Transit", 5, 38),
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
    shipmentId: "SH016",
    origin: "London, UK",
    destination: "Paris, France",
    eta: "2025-09-20",
    etd: "2025-09-18",
    status: "Delivered",
    loggers: 10,
    freightForwarder: "DHL",
    currentLocation: "Paris, France",
    profileType: "Frozen",
    modeOfTransport: "Road",
    packagingType: "Insulated Container",
    alarms: 2,
    events: 8,
    evaluation: "In Progress",
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
        departed: "2025-09-18T08:00:00Z",
        transportMode: "Road",
        vehicleNumber: "DHL-T789",
      },
      {
        type: "milestone",
        location: "Calais, France",
        status: "Completed",
        milestoneName: "Channel Crossing",
        groundHandler: "DHL",
        arrived: "2025-09-18T12:30:00Z",
        departed: "2025-09-18T14:00:00Z",
        transportMode: "Ferry",
        vehicleNumber: "Ferry-CH01",
      },
      {
        type: "destination",
        location: "Paris, France",
        status: "Completed",
        milestoneName: "Arrival in Paris",
        groundHandler: "DHL",
        arrived: "2025-09-18T18:00:00Z",
        departed: "2025-09-20T02:00:00Z",
        transportMode: "Road",
        vehicleNumber: "DHL-T789",
      }
    ],
    loggerData: [
      {
        loggerId: "Sentinel-100L-2001",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-01",
        tempProfile: "Frozen",
        serialNumber: 2001,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 45),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-2002",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-02",
        tempProfile: "Frozen",
        serialNumber: 2002,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 50),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-2003",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-03",
        tempProfile: "Frozen",
        serialNumber: 2003,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 42),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-2004",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-04",
        tempProfile: "Frozen",
        serialNumber: 2004,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 48),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C"
        }
      },
      {
        loggerId: "Sentinel-100L-2005",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-05",
        tempProfile: "Frozen",
        serialNumber: 2005,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 46),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C"
        }
      },
      {
        loggerId: "Sentinel-100L-2006",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-06",
        tempProfile: "Frozen",
        serialNumber: 2006,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 44),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C"
        }
      },
      {
        loggerId: "Sentinel-100L-2007",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-07",
        tempProfile: "Frozen",
        serialNumber: 2007,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 47),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C"
        }
      },
      {
        loggerId: "Sentinel-100L-2008",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-08",
        tempProfile: "Frozen",
        serialNumber: 2008,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 49),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C"
        }
      },
      {
        loggerId: "Sentinel-100L-2009",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-016-09",
        tempProfile: "Frozen",
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
        alarmTypes: ["Temperature"],
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
        timeSeriesData: generateTempDataWithMissionEndIssue(
          "2025-09-18T06:00:00Z",
          "2025-09-20T02:00:00Z",
          "Sentinel-100L",
          -20,
        ),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C"
        }
      },
      {
        loggerId: "Sentinel-100L-2010",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-016-10",
        tempProfile: "Frozen",
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
        alarmTypes: ["Temperature"],
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
        timeSeriesData: generateTempDataWithMissionEndIssue(
          "2025-09-18T06:00:00Z",
          "2025-09-20T02:00:00Z",
          "Sentinel-100L",
          -20,
        ),
        productDetails: {
          prodfilename: "Vaccine-Y",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C"
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
    profileType: "Cold Chain",
    loggers: 10,
    freightForwarder: "Geodis",
    currentLocation: "Rotterdam, Netherlands",
    modeOfTransport: "Road",
    packagingType: "Insulated Box",
    alarms: 0,
    events: 2,
    evaluation: "Not Started",
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
        departed: "2025-09-24T09:00:00Z",
        transportMode: "Road",
        vehicleNumber: "FX-T456",
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
      }
    ],
    loggerData: [
      {
        loggerId: "Sentinel-100L-3001",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-01",
        tempProfile: "cold chain",
        serialNumber: 3001,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 5, 45),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-3002",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-02",
        tempProfile: "cold chain",
        serialNumber: 3002,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 4, 50),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-3003",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-03",
        tempProfile: "cold chain",
        serialNumber: 3003,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 6, 42),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-3004",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-04",
        tempProfile: "cold chain",
        serialNumber: 3004,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 5, 48),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-3005",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-05",
        tempProfile: "cold chain",
        serialNumber: 3005,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 4, 46),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-3006",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-06",
        tempProfile: "cold chain",
        serialNumber: 3006,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 6, 44),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-3007",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-07",
        tempProfile: "cold chain",
        serialNumber: 3007,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 5, 47),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-3008",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-08",
        tempProfile: "cold chain",
        serialNumber: 3008,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 4, 49),
        productDetails: {
          prodfilename: "Insulin-Z",
          producttype: "cold chain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C"
        }
      },
      {
        loggerId: "Sentinel-100L-3009",
        loggerType: "Sentinel-100L",
        missionStarted: "n/a",
        missionEnded: "n/a",
        deliveryId: "DLV-017-09",
        tempProfile: "cold chain",
        serialNumber: 3009,
        alarms: [],
        alarmTypes: ["Temperature"],
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
        loggerId: "Sentinel-100L-3010",
        loggerType: "Sentinel-100L",
        missionStarted: "n/a",
        missionEnded: "n/a",
        deliveryId: "DLV-017-10",
        tempProfile: "cold chain",
        serialNumber: 3010,
        alarms: [],
        alarmTypes: ["Temperature"],
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