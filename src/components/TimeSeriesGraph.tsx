import React, { useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Logger } from '../types';
import './timeSeriesGraph.css';

interface TimeSeriesGraphProps {
  loggers: Logger[];
  shipment?: any;
  showHumidity?: boolean;
  height?: number;
  className?: string;
}

interface GraphState {
  data: any[];
  left: string | number;
  right: string | number;
  refAreaLeft: string;
  refAreaRight: string;
  top: string | number;
  bottom: string | number;
  top2: string | number;
  bottom2: string | number;
}

const TimeSeriesGraph: React.FC<TimeSeriesGraphProps> = ({ 
  loggers, 
  shipment, 
  showHumidity = true, 
  height = 400, 
  className = '' 
}) => {
  // Get threshold values from loggers
  const thresholds = React.useMemo(() => {
    const thresholdValues: { low: number | null, high: number | null } = { low: null, high: null };
    
    loggers.forEach(logger => {
      if (logger.productDetails) {
        // Extract numeric values from strings like "2 °C" or "12 °C"
        const lowMatch = logger.productDetails.lowThreshold.match(/(-?\d+(?:\.\d+)?)/);
        const highMatch = logger.productDetails.highThreshold.match(/(-?\d+(?:\.\d+)?)/);
        
        const low = lowMatch ? parseFloat(lowMatch[1]) : null;
        const high = highMatch ? parseFloat(highMatch[1]) : null;
        
        if (low !== null && !isNaN(low) && (thresholdValues.low === null || low < thresholdValues.low)) {
          thresholdValues.low = low;
        }
        if (high !== null && !isNaN(high) && (thresholdValues.high === null || high > thresholdValues.high)) {
          thresholdValues.high = high;
        }
      }
    });
    
    return thresholdValues;
  }, [loggers]);

  // Combine all logger data into a single dataset
  const combinedData = React.useMemo(() => {
    const dataMap = new Map<string, any>();
    
    loggers.forEach(logger => {
      if (logger.timeSeriesData && logger.timeSeriesData.length > 0) {
        logger.timeSeriesData.forEach(point => {
          const timestamp = new Date(point.timestamp).getTime();
          const key = timestamp.toString();
          
          if (!dataMap.has(key)) {
            dataMap.set(key, {
              timestamp,
              time: new Date(point.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            });
          }
          
          const entry = dataMap.get(key);
          entry[`${logger.loggerId}_temp`] = point.temperature;
          if (point.humidity !== undefined) {
            entry[`${logger.loggerId}_humidity`] = point.humidity;
          }
        });
      }
    });
    
    return Array.from(dataMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }, [loggers, thresholds]);

  // Calculate dynamic Y-axis ranges
  const yAxisRanges = React.useMemo(() => {
    if (combinedData.length === 0) {
      return {
        temperature: { min: -10, max: 60 },
        humidity: { min: 0, max: 100 }
      };
    }

    // Get all temperature and humidity values
    const tempValues: number[] = [];
    const humidityValues: number[] = [];

    combinedData.forEach(dataPoint => {
      Object.keys(dataPoint).forEach(key => {
        if (key.endsWith('_temp') && dataPoint[key] != null) {
          tempValues.push(dataPoint[key]);
        }
        if (key.endsWith('_humidity') && dataPoint[key] != null) {
          humidityValues.push(dataPoint[key]);
        }
      });
    });

    // Calculate temperature range including thresholds
    let tempMin = tempValues.length > 0 ? Math.min(...tempValues) : 0;
    let tempMax = tempValues.length > 0 ? Math.max(...tempValues) : 30;

    // Include thresholds in the range calculation
    if (thresholds.low !== null) {
      tempMin = Math.min(tempMin, thresholds.low);
    }
    if (thresholds.high !== null) {
      tempMax = Math.max(tempMax, thresholds.high);
    }

    // Add padding (10% of range, minimum 2 degrees)
    const tempRange = tempMax - tempMin;
    const tempPadding = Math.max(tempRange * 0.1, 2);
    tempMin = Math.floor(tempMin - tempPadding);
    tempMax = Math.ceil(tempMax + tempPadding);

    // Calculate humidity range
    let humidityMin = humidityValues.length > 0 ? Math.min(...humidityValues) : 0;
    let humidityMax = humidityValues.length > 0 ? Math.max(...humidityValues) : 100;

    // Add padding (10% of range, minimum 5%)
    const humidityRange = humidityMax - humidityMin;
    const humidityPadding = Math.max(humidityRange * 0.1, 5);
    humidityMin = Math.max(0, Math.floor(humidityMin - humidityPadding));
    humidityMax = Math.min(100, Math.ceil(humidityMax + humidityPadding));

    return {
      temperature: { min: tempMin, max: tempMax },
      humidity: { min: humidityMin, max: humidityMax }
    };
  }, [combinedData, thresholds]);

  const [state, setState] = useState<GraphState>({
    data: combinedData,
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    top: 'dataMax+2',
    bottom: 'dataMin-2',
    top2: 'dataMax+10',
    bottom2: 'dataMin-10',
  });

  React.useEffect(() => {
    setState(prev => ({ ...prev, data: combinedData }));
  }, [combinedData]);

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = state;
    const { data } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setState(prevState => ({
        ...prevState,
        refAreaLeft: '',
        refAreaRight: '',
      }));
      return;
    }

    // Convert to timestamps for proper comparison
    const leftTimestamp = Number(refAreaLeft);
    const rightTimestamp = Number(refAreaRight);
    
    // Ensure left is smaller than right
    const startTime = Math.min(leftTimestamp, rightTimestamp);
    const endTime = Math.max(leftTimestamp, rightTimestamp);

    // Find data points within the selected range
    const filteredData = data.filter(point => 
      point.timestamp >= startTime && point.timestamp <= endTime
    );

    if (filteredData.length === 0) {
      setState(prevState => ({
        ...prevState,
        refAreaLeft: '',
        refAreaRight: '',
      }));
      return;
    }

    // Find temperature and humidity keys
    const tempKeys = Object.keys(data[0] || {}).filter(key => key.includes('_temp'));
    const humidityKeys = Object.keys(data[0] || {}).filter(key => key.includes('_humidity'));

    // Calculate Y-axis domains based on filtered data
    let bottom = Infinity, top = -Infinity;
    let bottom2 = Infinity, top2 = -Infinity;

    filteredData.forEach(point => {
      tempKeys.forEach(key => {
        if (point[key] !== undefined && point[key] !== null) {
          bottom = Math.min(bottom, point[key]);
          top = Math.max(top, point[key]);
        }
      });
      humidityKeys.forEach(key => {
        if (point[key] !== undefined && point[key] !== null) {
          bottom2 = Math.min(bottom2, point[key]);
          top2 = Math.max(top2, point[key]);
        }
      });
    });

    setState(prevState => ({
      ...prevState,
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: startTime,
      right: endTime,
      bottom: bottom === Infinity ? 0 : Math.max(0, bottom - 2),
      top: top === -Infinity ? 20 : top + 2,
      bottom2: bottom2 === Infinity ? 0 : Math.max(0, bottom2 - 10),
      top2: top2 === -Infinity ? 100 : top2 + 10,
    }));
  };

  const zoomOut = () => {
    const { data } = state;
    setState(prevState => ({
      ...prevState,
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+2',
      bottom: 'dataMin-2',
      top2: 'dataMax+10',
      bottom2: 'dataMin-10',
    }));
  };

  const {
    data,
    refAreaLeft,
    refAreaRight,
    left,
    right,
    top,
    bottom,
    top2,
    bottom2,
  } = state;

  if (!data || data.length === 0) {
    return (
      <div className={`time-series-graph ${className}`}>
        <div className="no-data-message">
          No time-series data available for this shipment.
        </div>
      </div>
    );
  }

  // Generate colors for different loggers
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];
  const tempKeys = Object.keys(data[0] || {}).filter(key => key.includes('_temp'));
  const humidityKeys = Object.keys(data[0] || {}).filter(key => key.includes('_humidity'));

  return (
    <div className={`time-series-graph ${className}`} style={{ userSelect: 'none', width: '100%' }}>
      <div className="graph-controls">
        <button type="button" className="zoom-out-btn" onClick={zoomOut}>
          Zoom Out
        </button>
        <div className="graph-info">
          <span>Temperature & Humidity Timeline</span>
          {shipment && <span className="shipment-id">({shipment.shipmentId})</span>}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          onMouseDown={(e) => {
            if (e && e.activeLabel !== undefined && e.activeLabel !== null) {
              setState(prevState => ({ ...prevState, refAreaLeft: e.activeLabel!.toString() }));
            }
          }}
          onMouseMove={(e) => {
            if (state.refAreaLeft && e && e.activeLabel !== undefined && e.activeLabel !== null) {
              setState(prevState => ({ ...prevState, refAreaRight: e.activeLabel!.toString() }));
            }
          }}
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            allowDataOverflow 
            dataKey="timestamp" 
            domain={[left, right]} 
            type="number"
            scale="time"
            tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          />
          <YAxis 
            allowDataOverflow 
            domain={[yAxisRanges.temperature.min, yAxisRanges.temperature.max]} 
            type="number" 
            yAxisId="temperature"
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          {showHumidity && humidityKeys.length > 0 && (
            <YAxis 
              orientation="right" 
              allowDataOverflow 
              domain={[yAxisRanges.humidity.min, yAxisRanges.humidity.max]} 
              type="number" 
              yAxisId="humidity"
              label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
            />
          )}
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
            formatter={(value: any, name: string) => {
              const isTemp = name.includes('_temp');
              const isHumidity = name.includes('_humidity');
              const loggerName = name.split('_')[0];
              
              if (isTemp) {
                return [`${value}°C`, `${loggerName} Temperature`];
              } else if (isHumidity) {
                return [`${value}%`, `${loggerName} Humidity`];
              }
              return [value, name];
            }}
          />
          <Legend 
            content={(props) => {
              const { payload } = props;
              if (!payload) return null;
              
              // Group by logger name
              const loggerGroups: { [key: string]: { temp?: any, humidity?: any } } = {};
              
              payload.forEach((entry: any) => {
                const loggerName = entry.dataKey?.split('_')[0];
                if (!loggerName) return;
                
                if (!loggerGroups[loggerName]) {
                  loggerGroups[loggerName] = {};
                }
                
                if (entry.dataKey?.includes('_temp')) {
                  loggerGroups[loggerName].temp = entry;
                } else if (entry.dataKey?.includes('_humidity')) {
                  loggerGroups[loggerName].humidity = entry;
                }
              });
              
              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '10px' }}>
                  {Object.entries(loggerGroups).map(([loggerName, data]) => (
                    <div key={loggerName} style={{ margin: '0 15px 5px 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{loggerName}:</span>
                      {data.temp && (
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                          <div 
                            style={{ 
                              width: '12px', 
                              height: '2px', 
                              backgroundColor: data.temp.color, 
                              marginRight: '4px' 
                            }} 
                          />
                          <span style={{ fontSize: '12px' }}>Temp</span>
                        </div>
                      )}
                      {data.humidity && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div 
                            style={{ 
                              width: '12px', 
                              height: '2px', 
                              backgroundColor: data.humidity.color,
                              backgroundImage: `repeating-linear-gradient(90deg, ${data.humidity.color} 0px, ${data.humidity.color} 3px, transparent 3px, transparent 6px)`,
                              marginRight: '4px' 
                            }} 
                          />
                          <span style={{ fontSize: '12px' }}>Humidity</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            }}
          />

          {/* Temperature lines */}
          {tempKeys.map((key, index) => (
            <Line
              key={key}
              yAxisId="temperature"
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              name={`${key.split('_')[0]} Temperature`}
              connectNulls={false}
            />
          ))}

          {/* Humidity lines */}
          {showHumidity && humidityKeys.map((key, index) => {
            // Find the matching temperature logger index to use the same color
            const loggerName = key.split('_')[0];
            const tempIndex = tempKeys.findIndex(tempKey => tempKey.split('_')[0] === loggerName);
            const colorIndex = tempIndex >= 0 ? tempIndex : index;
            
            return (
              <Line
                key={key}
                yAxisId="humidity"
                type="monotone"
                dataKey={key}
                stroke={colors[colorIndex % colors.length]}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name={`${loggerName} Humidity`}
                connectNulls={false}
              />
            );
          })}

          {/* Threshold reference lines */}
          {thresholds.low !== null && (
            <ReferenceLine 
              yAxisId="temperature" 
              y={thresholds.low} 
              stroke="#ff4444" 
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{ value: `Low: ${thresholds.low}°C`, position: 'insideTopLeft' }}
            />
          )}
          {thresholds.high !== null && (
            <ReferenceLine 
              yAxisId="temperature" 
              y={thresholds.high} 
              stroke="#ff4444" 
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{ value: `High: ${thresholds.high}°C`, position: 'insideTopLeft' }}
            />
          )}

          {refAreaLeft && refAreaRight ? (
            <ReferenceArea yAxisId="temperature" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesGraph;
