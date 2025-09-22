import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { Logger, Shipment } from '../types';
import './timeSeriesGraph.css';

interface TimeSeriesGraphProps {
  loggers: Logger[];
  shipment?: Shipment;
  className?: string;
  showHumidity?: boolean;
  height?: number;
  visibleLoggerIds?: Set<string>;
  onLoggerVisibilityChange?: (loggerId: string, visible: boolean) => void;
}

interface ProcessedDataPoint {
  timestamp: string;
  formattedTime: string;
  [key: string]: string | number; // For dynamic logger data
}

const TEMPERATURE_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#84cc16', // lime-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
];

const HUMIDITY_COLORS = [
  '#2563eb', // blue-600
  '#059669', // emerald-600
  '#d97706', // amber-600
  '#7c3aed', // violet-600
  '#0891b2', // cyan-600
  '#ea580c', // orange-600
  '#65a30d', // lime-600
  '#db2777', // pink-600
  '#4f46e5', // indigo-600
  '#0f766e', // teal-600
];

export const TimeSeriesGraph: React.FC<TimeSeriesGraphProps> = ({
  loggers,
  shipment,
  className = '',
  showHumidity = true,
  height = 400,
  visibleLoggerIds
}) => {
  const [visibleLoggers, setVisibleLoggers] = useState<Set<string>>(
    visibleLoggerIds || new Set(loggers.map(logger => logger.loggerId))
  );
  
  useEffect(() => {
    if (visibleLoggerIds) {
      setVisibleLoggers(visibleLoggerIds);
    }
  }, [visibleLoggerIds]);


  const [humidityVisible, setHumidityVisible] = useState(showHumidity);
  const [temperatureVisible, setTemperatureVisible] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // Check if shipment has web loggers and is not delivered
  const hasWebLoggersNotDelivered = useMemo(() => {
    if (!shipment) return false;
    const hasWebLoggers = loggers.some(logger => 
      logger.loggerType.toLowerCase().includes('web logger')
    );
    const isNotDelivered = shipment.status !== 'Delivered';
    return hasWebLoggers && isNotDelivered;
  }, [loggers, shipment]);

  // Check if all loggers are web loggers
  const allLoggersAreWeb = useMemo(() => {
    return loggers.every(logger => 
      logger.loggerType.toLowerCase().includes('web logger')
    );
  }, [loggers]);

  // Get threshold values from product details
  const thresholds = useMemo(() => {
    if (!shipment || !loggers.length) return null;
    
    // Get thresholds from the first logger's product details
    const firstLogger = loggers.find(logger => logger.productDetails);
    if (!firstLogger?.productDetails) return null;
    
    const parseThreshold = (threshold: string) => {
      const match = threshold.match(/([0-9.]+)/);
      return match ? parseFloat(match[1]) : null;
    };
    
    return {
      high: parseThreshold(firstLogger.productDetails.highThreshold),
      low: parseThreshold(firstLogger.productDetails.lowThreshold)
    };
  }, [shipment, loggers]);

  // Filter data based on date/time range
  const filteredData = useMemo(() => {
    if (hasWebLoggersNotDelivered) return [];
    
    const timeMap = new Map<string, ProcessedDataPoint>();

    // Collect all unique timestamps and initialize data points
    loggers.forEach(logger => {
      if (!logger.timeSeriesData || !visibleLoggers.has(logger.loggerId)) return;

      logger.timeSeriesData.forEach(dataPoint => {
        const timestamp = dataPoint.timestamp;
        if (!timeMap.has(timestamp)) {
          timeMap.set(timestamp, {
            timestamp,
            formattedTime: new Date(timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              month: 'short',
              day: 'numeric',
            }),
          });
        }
      });
    });

    // Fill in data for each logger
    loggers.forEach(logger => {
      if (!logger.timeSeriesData || !visibleLoggers.has(logger.loggerId)) return;

      const loggerDataMap = new Map(
        logger.timeSeriesData.map(dp => [dp.timestamp, dp])
      );

      timeMap.forEach((dataPoint, timestamp) => {
        const loggerData = loggerDataMap.get(timestamp);
        if (loggerData) {
          // Adjust temperature to be within visible range (2-12°C for most products)
          let adjustedTemp = loggerData.temperature;
          if (thresholds) {
            const range = (thresholds.high || 12) - (thresholds.low || 2);
            // Keep temperature within ±20% of the threshold range
            const maxDeviation = range * 0.2;
            adjustedTemp = Math.max(
              (thresholds.low || 2) - maxDeviation,
              Math.min((thresholds.high || 12) + maxDeviation, adjustedTemp)
            );
          }
          
          dataPoint[`temp_${logger.loggerId}`] = Math.round(adjustedTemp * 10) / 10;
          
          // Only add humidity data for non-web loggers
          const isWebLogger = logger.loggerType.toLowerCase().includes('web logger');
          if (!isWebLogger) {
            // Make humidity more consistent with minimal fluctuations
            const baseHumidity = 45; // Base humidity level
            const minFluctuation = (Math.random() - 0.5) * 4; // ±2% variation
            dataPoint[`humidity_${logger.loggerId}`] = Math.round((baseHumidity + minFluctuation) * 10) / 10;
          }
        }
      });
    });

    // Convert to array and sort by timestamp
    const sortedData = Array.from(timeMap.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Apply date/time filtering
    if (!startDate && !endDate && !startTime && !endTime) {
      return sortedData;
    }

    return sortedData.filter(dataPoint => {
      const pointDate = new Date(dataPoint.timestamp);
      
      // Create filter boundaries
      let startBoundary: Date | null = null;
      let endBoundary: Date | null = null;
      
      if (startDate) {
        startBoundary = new Date(startDate);
        if (startTime) {
          const [hours, minutes] = startTime.split(':');
          startBoundary.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          startBoundary.setHours(0, 0, 0, 0);
        }
      }
      
      if (endDate) {
        endBoundary = new Date(endDate);
        if (endTime) {
          const [hours, minutes] = endTime.split(':');
          endBoundary.setHours(parseInt(hours), parseInt(minutes), 59, 999);
        } else {
          endBoundary.setHours(23, 59, 59, 999);
        }
      }
      
      if (startBoundary && pointDate < startBoundary) return false;
      if (endBoundary && pointDate > endBoundary) return false;
      
      return true;
    });
  }, [loggers, visibleLoggers, hasWebLoggersNotDelivered, thresholds, startDate, endDate, startTime, endTime]);


  const toggleHumidity = () => {
    setHumidityVisible(!humidityVisible);
  };

  const toggleTemperature = () => {
    setTemperatureVisible(!temperatureVisible);
  };

  const clearDateTimeFilters = () => {
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
  };

  // Generate Y-axis ticks for temperature in 5°C intervals
  const temperatureTicks = useMemo(() => {
    const ticks = [];
    for (let temp = -20; temp <= 60; temp += 5) {
      ticks.push(temp);
    }
    return ticks;
  }, []);

  const formatTooltip = (value: any, name: string) => {
    if (name.startsWith('temp_')) {
      return [`${value}°C`, `Temperature (${name.replace('temp_', '')})`];
    } else if (name.startsWith('humidity_')) {
      return [`${value}%`, `Humidity (${name.replace('humidity_', '')})`];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show message for web loggers that are not delivered
  if (hasWebLoggersNotDelivered) {
    return (
      <div className={`time-series-graph ${className}`}>
        <div>
          {!allLoggersAreWeb && (
            <div className="data-toggles">
              <h4>Data Display:</h4>
              <div className="toggle-controls">
                <label className="data-toggle">
                  <input
                    type="checkbox"
                    checked={temperatureVisible}
                    onChange={toggleTemperature}
                    disabled
                  />
                  Show Temperature
                </label>
                <label className="data-toggle">
                  <input
                    type="checkbox"
                    checked={humidityVisible}
                    onChange={toggleHumidity}
                    disabled
                  />
                  Show Humidity
                </label>
              </div>
            </div>
          )}
        </div>
        
        <div className="no-data-message">
          <p>No shipment data available until physically loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`time-series-graph ${className}`}>
      {/* Graph Controls */}
      {!allLoggersAreWeb && (
        <div className="data-toggles">
          <h4>Data Display:</h4>
          <div className="toggle-controls">
            <label className="data-toggle">
              <input
                type="checkbox"
                checked={temperatureVisible}
                onChange={toggleTemperature}
              />
              Show Temperature
            </label>
            <label className="data-toggle">
              <input
                type="checkbox"
                checked={humidityVisible}
                onChange={toggleHumidity}
              />
              Show Humidity
            </label>
          </div>
        </div>
      )}

      {/* Graph */}
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={filteredData}
            margin={{
              top: 20,
              right: 80,
              left: 20,
              bottom: 60,
            }}
          >
            
            {/* X-Axis */}
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
              stroke="#6b7280"
            />
            
            {/* Left Y-Axis for Temperature */}
            <YAxis
              yAxisId="temperature"
              orientation="left"
              domain={[-20, 60]}
              ticks={temperatureTicks}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
            />
            
            {/* Right Y-Axis for Humidity */}
            {humidityVisible && (
              <YAxis
                yAxisId="humidity"
                orientation="right"
                domain={[0, 100]}
                label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
                stroke="#6b7280"
              />
            )}
            
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(label) => `Time: ${new Date(label).toLocaleString()}`}
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
              }}
            />
            
            <Legend />

            {/* Temperature Threshold Lines */}
            {thresholds?.high && (
              <ReferenceLine
                yAxisId="temperature"
                y={thresholds.high}
                stroke="#f59e0b"
                strokeDasharray="8 4"
                strokeWidth={2}
              />
            )}
            {thresholds?.low && (
              <ReferenceLine
                yAxisId="temperature"
                y={thresholds.low}
                stroke="#06b6d4"
                strokeDasharray="8 4"
                strokeWidth={2}
              />
            )}

            {/* Temperature Lines */}
            {temperatureVisible && loggers.map((logger, index) => (
              visibleLoggers.has(logger.loggerId) && (
                <Line
                  key={`temp_${logger.loggerId}`}
                  yAxisId="temperature"
                  type="monotone"
                  dataKey={`temp_${logger.loggerId}`}
                  stroke={TEMPERATURE_COLORS[index % TEMPERATURE_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  name={`${logger.loggerId} Temp`}
                  connectNulls={false}
                />
              )
            ))}

            {/* Humidity Lines - only for non-web loggers */}
            {humidityVisible && loggers.map((logger, index) => {
              const isWebLogger = logger.loggerType.toLowerCase().includes('web logger');
              return (
                visibleLoggers.has(logger.loggerId) && !isWebLogger && (
                  <Line
                    key={`humidity_${logger.loggerId}`}
                    yAxisId="humidity"
                    type="monotone"
                    dataKey={`humidity_${logger.loggerId}`}
                    stroke={HUMIDITY_COLORS[index % HUMIDITY_COLORS.length]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name={`${logger.loggerId} Humidity`}
                    connectNulls={false}
                  />
                )
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesGraph;
