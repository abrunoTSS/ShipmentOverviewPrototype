import type { Shipment, LoggerTimeSeriesData, AlarmCondition, CumulativeAlarm, Alarm } from '../types';

// Enhanced alarm profiles for different temperature profiles
const alarmProfiles = {
  Frozen: {
    // Instantaneous / consecutive breach alarms
    temperatureAlarms: [
      { condition: 'above', temperature: -15, durationMinutes: 3 },
      { condition: 'above', temperature: 0, durationMinutes: 1 },
      { condition: 'below', temperature: -25, durationMinutes: 1 }
    ] as AlarmCondition[],
    // MKT-based alarms (non-standard to use "below", but added per request)
    mktAlarms: [
      { condition: 'above', temperature: -15, durationMinutes: 0, severity: 'warning' },
      { condition: 'above', temperature: -10, durationMinutes: 0, severity: 'critical' },
      { condition: 'below', temperature: -25, durationMinutes: 0, severity: 'warning' },
      { condition: 'below', temperature: -30, durationMinutes: 0, severity: 'critical' }
    ] as AlarmCondition[],
    // Cumulative exposure alarms
    cumulativeAlarms: [
      { condition: 'above', temperature: -15, totalDurationMinutes: 60, severity: 'warning' },
      { condition: 'above', temperature: 0, totalDurationMinutes: 10, severity: 'critical' },
      { condition: 'below', temperature: -25, totalDurationMinutes: 30, severity: 'warning' },
      { condition: 'below', temperature: -30, totalDurationMinutes: 10, severity: 'critical' }
    ] as CumulativeAlarm[]
  },

  ColdChain: {
    temperatureAlarms: [
      { condition: 'above', temperature: 8, durationMinutes: 30 },
      { condition: 'above', temperature: 10, durationMinutes: 15 },
      { condition: 'below', temperature: 2, durationMinutes: 30 },
      { condition: 'below', temperature: 0, durationMinutes: 10 }
    ] as AlarmCondition[],
    mktAlarms: [
      { condition: 'above', temperature: 8, durationMinutes: 0, severity: 'warning' },
      { condition: 'above', temperature: 10, durationMinutes: 0, severity: 'critical' },
      { condition: 'below', temperature: 2, durationMinutes: 0, severity: 'warning' },
      { condition: 'below', temperature: 0, durationMinutes: 0, severity: 'critical' }
    ] as AlarmCondition[],
    cumulativeAlarms: [
      { condition: 'above', temperature: 8, totalDurationMinutes: 120, severity: 'warning' },
      { condition: 'above', temperature: 10, totalDurationMinutes: 30, severity: 'critical' },
      { condition: 'below', temperature: 2, totalDurationMinutes: 60, severity: 'warning' },
      { condition: 'below', temperature: 0, totalDurationMinutes: 10, severity: 'critical' }
    ] as CumulativeAlarm[]
  },

  CRT: {
    temperatureAlarms: [
      { condition: 'above', temperature: 30, durationMinutes: 60 },
      { condition: 'above', temperature: 40, durationMinutes: 15 },
      { condition: 'below', temperature: 15, durationMinutes: 60 }
    ] as AlarmCondition[],
    mktAlarms: [
      { condition: 'above', temperature: 25, durationMinutes: 0, severity: 'warning' },
      { condition: 'above', temperature: 30, durationMinutes: 0, severity: 'critical' },
      { condition: 'below', temperature: 15, durationMinutes: 0, severity: 'warning' },
      { condition: 'below', temperature: 5, durationMinutes: 0, severity: 'critical' }
    ] as AlarmCondition[],
    cumulativeAlarms: [
      { condition: 'above', temperature: 30, totalDurationMinutes: 240, severity: 'warning' },
      { condition: 'above', temperature: 40, totalDurationMinutes: 60, severity: 'critical' },
      { condition: 'below', temperature: 15, totalDurationMinutes: 240, severity: 'warning' },
      { condition: 'below', temperature: 5, totalDurationMinutes: 60, severity: 'critical' }
    ] as CumulativeAlarm[]
  }
} as const;


// Helper function to generate single alarms based on temperature conditions
function generateSingleAlarms(loggerId: string, temperatureAlarms: AlarmCondition[], baseTimestamp: string): Alarm[] {
  const singleAlarms: Alarm[] = [];
  let alarmIdCounter = 1000; // Start with high ID to distinguish from other alarms

  console.log(`Generating single alarms for logger ${loggerId}:`, temperatureAlarms);

  // Generate both high and low temperature alarms
  const highAlarms = temperatureAlarms.filter(condition => condition.condition === 'above').slice(0, 1);
  const lowAlarms = temperatureAlarms.filter(condition => condition.condition === 'below').slice(0, 1);
  
  [...highAlarms, ...lowAlarms].forEach((condition, index) => {
    const triggerTime = new Date(baseTimestamp);
    triggerTime.setHours(triggerTime.getHours() + index * 3); // Spread alarms over time
    
    const temperatureAtTrigger = condition.condition === 'above' 
      ? condition.temperature + 0.5 
      : condition.temperature - 0.5;
    
    const alarm: Alarm = {
      alarmId: alarmIdCounter++,
      alarmType: 'Single',
      isSingleAlarm: true,
      triggeredCondition: condition,
      triggeredAt: triggerTime.toISOString(),
      temperatureAtTrigger: temperatureAtTrigger,
      loggerId: loggerId,
      errorMessage: `Single alarm triggered: Temperature ${condition.condition} ${condition.temperature}°C for ${condition.durationMinutes} minutes (${temperatureAtTrigger}°C at ${triggerTime.toISOString()})`
    };
    singleAlarms.push(alarm);
    console.log(`Created single alarm:`, alarm);
  });

  console.log(`Generated ${singleAlarms.length} single alarms for logger ${loggerId}`);
  return singleAlarms;
}


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


// Helper function to generate temperature data with specific alarm spikes
function generateTempDataWithAlarmSpikes(
  startDate: string,
  endDate: string | null,
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
    shipmentId: "7100022402",
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
        arrived: "2025-09-22T08:00:00+02:00",
        departed: "2025-09-22T10:00:00+02:00",
        transportMode: "Road",
        vehicleNumber: "T1234",
      },
      {
        type: "milestone",
        location: "Copenhagen, Denmark",
        status: "Completed",
        milestoneName: "Transit through Copenhagen",
        groundHandler: "Geodis",
        arrived: "2025-09-22T14:30:00+02:00",
        departed: "2025-09-22T15:30:00+02:00",
        transportMode: "Road",
        vehicleNumber: "T1234",
      },
      {
        type: "milestone",
        location: "Hamburg, Germany",
        status: "Completed",
        milestoneName: "Transit through Hamburg",
        groundHandler: "Geodis",
        arrived: "2025-09-22T18:45:00+02:00",
        departed: "2025-09-22T22:30:00+02:00",
        transportMode: "Road",
        vehicleNumber: "T1234",
      },
      {
        type: "milestone",
        location: "In Transit",
        status: "Current",
        milestoneName: "In Transit",
        groundHandler: "Geodis",
        arrived: "2025-09-22T22:30:00+02:00",
        transportMode: "Road",
        vehicleNumber: "T1234",
      },
      {
        type: "destination",
        location: "Berlin, Germany",
        status: "Pending",
        milestoneName: "Arrival in Berlin",
        groundHandler: "Geodis",
        eta: "2025-09-23T08:00:00+02:00",
        transportMode: "Road",
        vehicleNumber: "T1234",
      }
    ],
    evaluation: "n/a",
    distance: 522,
    co2Emissions: 32.36,
    loggerData: [
      {
        loggerId: "9901733493728583",
        loggerType: "webLogger-II",
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-001",
        tempProfile: "CRT",
        serialNumber: 1,
        alarms: [],
        alarmTypes: [],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "webLogger-II", "In Transit", 5, 42),
        productDetails: {
          profileName: "Insulin-3",
          productType: "CRT",
          temperatureProfile: "profile",
          highThreshold: "30 °C",
          lowThreshold: "15 °C",
          temperatureAlarms: alarmProfiles.CRT.temperatureAlarms,
          mktAlarms: alarmProfiles.CRT.mktAlarms,
          cumulativeAlarms: alarmProfiles.CRT.cumulativeAlarms
        }
      }
    ]
  },
  {
    shipmentId: "7100022455",
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
        arrived: "2025-09-21T06:00:00+00:00",
        departed: "2025-09-21T08:00:00+00:00",
        transportMode: "Road",
        vehicleNumber: "T2456",
      },
      {
        type: "milestone",
        location: "Heathrow Airport, UK",
        status: "Completed",
        milestoneName: "Departure from Heathrow",
        groundHandler: "British Airways",
        arrived: "2025-09-21T10:30:00+00:00",
        departed: "2025-09-21T14:15:00+00:00",
        transportMode: "Air",
        vehicleNumber: "F8901",
      },
      {
        type: "milestone",
        location: "Amsterdam, Netherlands",
        status: "Completed",
        milestoneName: "Transit through Amsterdam Schiphol",
        groundHandler: "KLM",
        arrived: "2025-09-21T16:45:00+02:00",
        departed: "2025-09-21T18:45:00+02:00",
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
        eta: "2025-09-21T18:45:00+02:00"
      },
      {
        type: "milestone",
        location: "Dubai, UAE",
        status: "Pending",
        milestoneName: "Transit through Dubai",
        groundHandler: "Emirates",
        eta: "2025-09-22T02:30:00+04:00",
        etd: "2025-09-22T06:15:00+04:00",
        transportMode: "Air",
        vehicleNumber: "F7890",
      },
      {
        type: "destination",
        location: "Tokyo, Japan",
        status: "Pending",
        milestoneName: "Arrival at Narita Airport",
        groundHandler: "Japan Airlines",
        eta: "2025-09-22T14:30:00+09:00",
        transportMode: "Air",
        vehicleNumber: "F1122",
      }
    ],
    loggerData: [
      {
        loggerId: "3737C15052461636",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-002",
        tempProfile: "Frozen",
        serialNumber: 1,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-09-22T08:00:00Z", null, -18, 5, [
          {
            startTime: "2025-09-22 10:00",
            endTime: "2025-09-22 12:45",
            peakTemp: -5
          },
          {
            startTime: "2025-09-22 13:00",
            endTime: "2025-09-22 13:30",
            peakTemp: -27
          }
        ]),
        alarmTypes: ["Temperature"],
        // Single alarms only - include low temperature alarm
        alarms: [
          ...generateSingleAlarms("3737C15052461636", alarmProfiles.Frozen.temperatureAlarms, "2025-09-22T10:00:00Z")
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        productDetails: {
          profileName: "Insulin-2",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052294202",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-003",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarmTypes: ["Temperature"],
        // Single alarms only
        alarms: [
          ...generateSingleAlarms("3737C15052294202", alarmProfiles.Frozen.temperatureAlarms, "2025-09-22T14:00:00Z")
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-09-22T08:00:00Z", null, -18, 5, [
          {
            startTime: "2025-09-22 14:00",
            endTime: "2025-09-22 16:45",
            peakTemp: -5
          }
        ]),
        productDetails: {
          profileName: "Insulin-2",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C",
          temperatureAlarms: alarmProfiles.CRT.temperatureAlarms,
          mktAlarms: alarmProfiles.CRT.mktAlarms,
          cumulativeAlarms: alarmProfiles.CRT.cumulativeAlarms
        }
      }
    ]
  },
  {
    shipmentId: "3500377999",
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
    alarms: 6,
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
        arrivalTime: "2025-07-10T06:00:00+00:00",
        departedTime: "2025-07-10T08:00:00+00:00",
        transportMode: "Road",
        vehicleNumber: "T3456",
      },
      {
        type: "milestone",
        location: "Heathrow Airport, UK",
        status: "Completed",
        milestoneName: "Departure from Heathrow",
        groundHandler: "British Airways",
        arrivalTime: "2025-07-10T10:30:00+00:00",
        departedTime: "2025-07-10T14:15:00+00:00",
        transportMode: "Air",
        vehicleNumber: "F4567",
      },
      {
        type: "milestone",
        location: "Dubai, UAE",
        status: "Completed",
        milestoneName: "Transit through Dubai",
        groundHandler: "Emirates",
        arrivalTime: "2025-07-10T22:45:00+04:00",
        departedTime: "2025-07-11T02:30:00+04:00",
        transportMode: "Air",
        vehicleNumber: "F8901",
      },
      {
        type: "destination",
        location: "Tokyo, Japan",
        status: "Completed",
        milestoneName: "Arrival at Narita Airport",
        groundHandler: "Japan Airlines",
        arrivalTime: "2025-07-20T08:00:00+09:00",
        transportMode: "Air",
        vehicleNumber: "F2345",
      }
    ],
    loggerData: [
      {
        loggerId: "6001733832348975",
        loggerType: "webLogger-II",
        deliveryId: "DL-1004A",
        tempProfile: "CRT",
        serialNumber: 1,
        missionStarted: "2025-07-10T08:00:00Z",
        missionEnded: "2025-07-20T08:00:00Z",
        // Single alarms only
        alarms: [
          ...generateSingleAlarms("6001733832348975", alarmProfiles.ColdChain.temperatureAlarms, "2025-07-15T10:00:00Z")
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", 6, 45, [
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
          profileName: "Insulin-2",
          productType: "CRT",
          temperatureProfile: "profile",
          highThreshold: "12 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "6001733832348976",
        loggerType: "webLogger-II",
        deliveryId: "DL-1004B",
        tempProfile: "CRT",
        serialNumber: 1,
        missionStarted: "2025-07-10T08:00:00Z",
        missionEnded: "2025-07-20T08:00:00Z",
        // Single alarms only
        alarms: [
          ...generateSingleAlarms("6001733832348976", alarmProfiles.ColdChain.temperatureAlarms, "2025-07-15T10:00:00Z")
        ],
        evaluation: "Not Started",
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTempDataWithAlarmSpikes("2025-07-10T08:00:00Z", "2025-07-20T08:00:00Z", 8, 50, [
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
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      }
    ]
  },
  {
    shipmentId: "350037766",
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
    milestones: [
      {
        type: "origin",
        location: "Paris, France",
        status: "Completed",
        milestoneName: "Departure from Paris",
        groundHandler: "DHL",
        arrived: "2025-09-22T08:00:00+02:00",
        departed: "2025-09-22T10:00:00+02:00",
        transportMode: "Road",
        vehicleNumber: "T2456",
      },
      {
        type: "milestone",
        location: "Bordeaux, France",
        status: "Completed",
        milestoneName: "Transit through Bordeaux",
        groundHandler: "DHL",
        arrived: "2025-09-22T16:30:00+02:00",
        departed: "2025-09-22T17:30:00+02:00",
        transportMode: "Road",
        vehicleNumber: "T2456",
      },
      {
        type: "milestone",
        location: "San Sebastián, Spain",
        status: "Current",
        milestoneName: "Border crossing at San Sebastián",
        groundHandler: "DHL",
        arrived: "2025-09-22T20:00:00+02:00",
        departed: undefined,
        transportMode: "Road",
        vehicleNumber: "T2456",
      },
      {
        type: "destination",
        location: "Madrid, Spain",
        status: "Pending",
        milestoneName: "Arrival in Madrid",
        groundHandler: "DHL",
        eta: "2025-09-23T10:00:00+02:00",
        transportMode: "Road",
        vehicleNumber: "T2456",
      }
    ],
    loggerData: [
      {
        loggerId: "60017338323489757",
        loggerType: "webLogger-II",
        deliveryId: "DL-1006",
        tempProfile: "CRT",
        serialNumber: 1,
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "webLogger-II", "In Transit", 5, 40),
        alarms: [],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        productDetails: {
          profileName: "Vaccine-X",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "6001733832348978",
        loggerType: "webLogger-II",
        deliveryId: "DL-1007",
        tempProfile: "CRT",
        serialNumber: 1,
        missionStarted: "2025-09-22T08:00:00Z",
        missionEnded: "n/a",
        timeSeriesData: generateTimeSeriesData("2025-09-22T08:00:00Z", null, "webLogger-II", "In Transit", 5, 38),
        alarms: [],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        productDetails: {
          profileName: "Vaccine-X",
          productType: "CRT",
          temperatureProfile: "profile",
          highThreshold: "30 °C",
          lowThreshold: "15 °C",
          temperatureAlarms: alarmProfiles.CRT.temperatureAlarms,
          mktAlarms: alarmProfiles.CRT.mktAlarms,
          cumulativeAlarms: alarmProfiles.CRT.cumulativeAlarms
        }
      }
    ]
  },
  {
    shipmentId: "3500377977",
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
        arrived: "2025-09-18T06:00:00+00:00",
        departed: "2025-09-18T08:00:00+00:00",
        transportMode: "Road",
        vehicleNumber: "DHL-T789",
      },
      {
        type: "milestone",
        location: "Calais, France",
        status: "Completed",
        milestoneName: "Channel Crossing",
        groundHandler: "DHL",
        arrived: "2025-09-18T12:30:00+02:00",
        departed: "2025-09-18T14:00:00+02:00",
        transportMode: "Ferry",
        vehicleNumber: "Ferry-CH01",
      },
      {
        type: "destination",
        location: "Paris, France",
        status: "Completed",
        milestoneName: "Arrival in Paris",
        groundHandler: "DHL",
        arrived: "2025-09-18T18:00:00+02:00",
        transportMode: "Road",
        vehicleNumber: "DHL-T789",
      }
    ],
    loggerData: [
      {
        loggerId: "3737C15052294205",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-01",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 45),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052294233",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-02",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 50),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461647",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-03",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 42),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461641",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-04",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 48),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461642",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-05",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 46),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461643",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-06",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 44),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461644",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-07",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 47),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461645",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "2025-09-20T02:00:00Z",
        deliveryId: "DLV-016-08",
        tempProfile: "Frozen",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-18T06:00:00Z", "2025-09-20T02:00:00Z", "Sentinel-100L", "Delivered", -20, 49),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15°C",
          lowThreshold: "-25°C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461646",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-18T06:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-016-02",
        tempProfile: "Frozen",
        serialNumber: 1,
        // Single alarms only - high temperature alarms only
        alarms: [
          ...generateSingleAlarms("3737C15052461646", alarmProfiles.Frozen.temperatureAlarms.filter(alarm => alarm.condition === 'above'), "2025-09-18T21:15:00Z")
        ],
        evaluation: "In Progress",
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
          -20
        ),
        productDetails: {
          profileName: "Vaccine-Y",
          productType: "Frozen",
          temperatureProfile: "profile",
          highThreshold: "-15 °C",
          lowThreshold: "-25 °C",
          temperatureAlarms: alarmProfiles.Frozen.temperatureAlarms,
          mktAlarms: alarmProfiles.Frozen.mktAlarms,
          cumulativeAlarms: alarmProfiles.Frozen.cumulativeAlarms
        }
      }
    ]
  },
  {
    shipmentId: "7100022404",
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
        arrived: "2025-09-24T07:00:00+02:00",
        departed: "2025-09-24T09:00:00+02:00",
        transportMode: "Road",
        vehicleNumber: "FX-T456",
      },
      {
        type: "milestone",
        location: "Rotterdam, Netherlands",
        status: "Current",
        milestoneName: "Transit through Rotterdam",
        groundHandler: "Geodis",
        arrivalTime: "2025-09-24T12:00:00+02:00",
        etd: "2025-09-24T15:00:00+02:00",
        transportMode: "Road",
        vehicleNumber: "FX-T456",
      },
      {
        type: "destination",
        location: "Brussels, Belgium",
        status: "Pending",
        milestoneName: "Arrival in Brussels",
        groundHandler: "Geodis",
        eta: "2025-09-25T08:00:00+02:00",
        transportMode: "Road",
        vehicleNumber: "FX-T456",
      }
    ],
    loggerData: [
      {
        loggerId: "3737C15052461612",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-01",
        tempProfile: "cold chain",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 5, 45),
        productDetails: {
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461613",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-02",
        tempProfile: "cold chain",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 4, 50),
        productDetails: {
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461614",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-03",
        tempProfile: "cold chain",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 6, 42),
        productDetails: {
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461615",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-04",
        tempProfile: "cold chain",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 5, 48),
        productDetails: {
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461616",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-05",
        tempProfile: "cold chain",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 4, 46),
        productDetails: {
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461617",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-06",
        tempProfile: "cold chain",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 6, 44),
        productDetails: {
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461618",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-07",
        tempProfile: "cold chain",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 5, 47),
        productDetails: {
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461633",
        loggerType: "Sentinel-100L",
        missionStarted: "2025-09-24T07:00:00Z",
        missionEnded: "n/a",
        deliveryId: "DLV-017-08",
        tempProfile: "cold chain",
        serialNumber: 1,
        alarms: [],
        alarmTypes: ["Temperature"],
        evaluation: null,
        rootCauseAnalysisStatusDetails: null,
        timeSeriesData: generateTimeSeriesData("2025-09-24T07:00:00Z", null, "Sentinel-100L", "In Transit", 4, 49),
        productDetails: {
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461634",
        loggerType: "Sentinel-100L",
        missionStarted: "n/a",
        missionEnded: "n/a",
        deliveryId: "DLV-017-09",
        tempProfile: "cold chain",
        serialNumber: 1,
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
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      },
      {
        loggerId: "3737C15052461635",
        loggerType: "Sentinel-100L",
        missionStarted: "n/a",
        missionEnded: "n/a",
        deliveryId: "DLV-017-10",
        tempProfile: "cold chain",
        serialNumber: 1,
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
          profileName: "Insulin-Z",
          productType: "ColdChain",
          temperatureProfile: "profile",
          highThreshold: "8 °C",
          lowThreshold: "2 °C",
          temperatureAlarms: alarmProfiles.ColdChain.temperatureAlarms,
          mktAlarms: alarmProfiles.ColdChain.mktAlarms,
          cumulativeAlarms: alarmProfiles.ColdChain.cumulativeAlarms
        }
      }
    ]
  }
];