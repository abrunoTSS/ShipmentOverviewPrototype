import React from 'react';
import { Line } from 'react-chartjs-2';
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
import Annotation from 'chartjs-plugin-annotation';
import type { ExcursionGraphData, Logger, Shipment } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Annotation
);

interface ExcursionGraphProps {
  data: ExcursionGraphData[];
  logger: Logger;
  shipment: Shipment;
}

const ExcursionGraph: React.FC<ExcursionGraphProps> = ({ data, logger, shipment }) => {
  // For Web Logger 2, show message if shipment is still in transit
  if (logger.loggerType === 'Web Logger 2' && shipment.status === 'In Transit') {
    return (
      <div className="graph-placeholder">
        <p>Graph data for Web Logger 2 is only available once the shipment is complete.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="graph-placeholder">
        <p>No graph data available for this excursion.</p>
      </div>
    );
  }

  // --- Thresholds ---
  const tempHighThreshold = logger.productDetails?.highThreshold ? parseInt(logger.productDetails.highThreshold.replace(/[^\d]/g, '')) : 12;
  const tempLowThreshold = logger.productDetails?.lowThreshold ? parseInt(logger.productDetails.lowThreshold.replace(/[^\d]/g, '')) : 2;

  // --- Data Configuration ---

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
    ],
  };

  // --- Y-Axis Range Calculation ---
  const tempValues = data.map(d => d.temperature);
  const tempMin = Math.min(...tempValues);
  const tempMax = Math.max(...tempValues);
  const tempPadding = (tempMax - tempMin) * 0.2;


  // --- Chart Options ---
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' as const },
      annotation: {
        annotations: {
          tempHigh: {
            type: 'line',
            yMin: tempHighThreshold,
            yMax: tempHighThreshold,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: { content: `High Temp: ${tempHighThreshold}°C`, display: false, position: 'end' }
          },
          tempLow: {
            type: 'line',
            yMin: tempLowThreshold,
            yMax: tempLowThreshold,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: { content: `Low Temp: ${tempLowThreshold}°C`, display: false, position: 'start' }
          },
        }
      }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Time' } },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Temperature (°C)' },
        min: Math.floor(tempMin - tempPadding),
        max: Math.ceil(tempMax + tempPadding),
      },
    },
  };

  return (
    <div className="excursion-graph">
      <div style={{ height: '500px', width: '100%' }}>
        <span>Graph Data</span> <br />
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ExcursionGraph;
