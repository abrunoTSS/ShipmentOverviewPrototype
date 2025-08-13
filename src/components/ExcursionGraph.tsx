import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ExcursionGraphData, Logger } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ExcursionGraphProps {
  data: ExcursionGraphData[];
  logger: Logger;
}

const ExcursionGraph: React.FC<ExcursionGraphProps> = ({ data, logger }) => {
  if (!data || data.length === 0) {
    return (
      <div className="graph-placeholder">
        <p>No graph data available for this excursion.</p>
      </div>
    );
  }

  // Extract threshold values from product details
  const tempHighThreshold = logger.productDetails?.highThreshold ? 
    parseInt(logger.productDetails.highThreshold.replace(/[^\d]/g, '')) : 12;
  const tempLowThreshold = logger.productDetails?.lowThreshold ? 
    parseInt(logger.productDetails.lowThreshold.replace(/[^\d]/g, '')) : 2;
  
  const humidityHighThreshold = logger.productDetails?.highHumidityThreshold ? 
    parseInt(logger.productDetails.highHumidityThreshold.replace(/[^\d]/g, '')) : 60;
  const humidityLowThreshold = logger.productDetails?.lowHumidityThreshold ? 
    parseInt(logger.productDetails.lowHumidityThreshold.replace(/[^\d]/g, '')) : 30;

  // Check if humidity data is available for this logger type
  const hasHumidityData = ['Sentry', 'Sentinel'].includes(logger.loggerType) && 
    data.some(point => point.humidity !== undefined);

  // Prepare chart data
  const chartData = {
    labels: data.map(point => point.time),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map(point => point.temperature),
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      ...(hasHumidityData ? [{
        label: 'Humidity (%)',
        data: data.map(point => point.humidity || 0),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      }] : [])
    ],
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Excursion Timeline',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
        // Add threshold lines as annotations would require additional plugin
        min: Math.min(tempLowThreshold - 5, ...data.map(d => d.temperature)),
        max: Math.max(tempHighThreshold + 5, ...data.map(d => d.temperature)),
      },
      ...(hasHumidityData ? {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Humidity (%)',
          },
          grid: {
            drawOnChartArea: false,
          },
          min: Math.min(humidityLowThreshold - 10, ...data.map(d => d.humidity || 0)),
          max: Math.max(humidityHighThreshold + 10, ...data.map(d => d.humidity || 0)),
        },
      } : {}),
    },
  };

  return (
    <div className="excursion-graph">
      <div style={{ height: '400px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
      
      {/* Threshold indicators */}
      <div className="threshold-indicators">
        <div className="threshold-item">
          <span className="threshold-label temp-high">High Temp Threshold:</span>
          <span>{tempHighThreshold}°C</span>
        </div>
        <div className="threshold-item">
          <span className="threshold-label temp-low">Low Temp Threshold:</span>
          <span>{tempLowThreshold}°C</span>
        </div>
        {hasHumidityData && (
          <>
            <div className="threshold-item">
              <span className="threshold-label humidity-high">High Humidity Threshold:</span>
              <span>{humidityHighThreshold}%</span>
            </div>
            <div className="threshold-item">
              <span className="threshold-label humidity-low">Low Humidity Threshold:</span>
              <span>{humidityLowThreshold}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExcursionGraph;
