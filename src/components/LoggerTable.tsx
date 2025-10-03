
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, ChevronLeft, Droplets, Sun, Gauge, Zap, Thermometer, RotateCcw, AlertTriangle } from 'lucide-react';
import type { Logger, Shipment } from '../types';
import './LoggerTable.css';

interface LoggerTableProps {
  loggers: Logger[];
  onLoggerClick: (logger: Logger) => void;
  selectedLoggerId: string | null;
  visibleLoggers?: Set<string>;
  onLoggerVisibilityChange?: (loggerId: string, visible: boolean) => void;
  shipment?: Shipment;
  onViewShipmentDetails?: (shipment: Shipment) => void;
}

// Function to get alarm icon based on alarm type
const getAlarmIcon = (alarmType: string, size: number = 16) => {
  const type = alarmType.toLowerCase();
  switch (type) {
    case 'humidity':
      return <Droplets size={size} className="alarm-icon humidity" />;
    case 'light':
      return <Sun size={size} className="alarm-icon light" />;
    case 'pressure':
      return <Gauge size={size} className="alarm-icon pressure" />;
    case 'shock':
      return <Zap size={size} className="alarm-icon shock" />;
    case 'temperature':
      return <Thermometer size={size} className="alarm-icon temperature" />;
    case 'tilt':
      return <RotateCcw size={size} className="alarm-icon tilt" />;
    default:
      return <AlertTriangle size={size} className="alarm-icon default" />;
  }
};

export function LoggerTable({ 
  loggers, 
  selectedLoggerId, 
  visibleLoggers = new Set(loggers.map(l => l.loggerId)), 
  onLoggerVisibilityChange,
  shipment,
  onViewShipmentDetails
}: LoggerTableProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Master checkbox logic
  const allVisible = loggers.length > 0 && loggers.every(logger => visibleLoggers.has(logger.loggerId));
  const someVisible = loggers.some(logger => visibleLoggers.has(logger.loggerId));
  const indeterminate = someVisible && !allVisible;

  const handleMasterCheckboxChange = (checked: boolean) => {
    loggers.forEach(logger => {
      onLoggerVisibilityChange?.(logger.loggerId, checked);
    });
  };

  const columns: ColumnDef<Logger>[] = [
    {
      id: 'visibility',
      header: () => (
        <div className="visibility-header">
          <div className="visibility-label">
            <div>Display</div>
            <div>in Graph</div>
          </div>
          <input
            type="checkbox"
            checked={allVisible}
            ref={(input) => {
              if (input) input.indeterminate = indeterminate;
            }}
            onChange={(e) => handleMasterCheckboxChange(e.target.checked)}
            className="master-checkbox"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="visibility-cell">
          <input
            type="checkbox"
            checked={visibleLoggers.has(row.original.loggerId)}
            onChange={(e) => {
              onLoggerVisibilityChange?.(row.original.loggerId, e.target.checked);
            }}
            className="logger-visibility-checkbox"
          />
        </div>
      ),
    },
    {
      id: 'loggerId',
      header: () => (
        <div className="column-header mission-id-header">
          <div>UNIT S/N</div>
          <div>(SERIAL NUMBER)</div>
        </div>
      ),
      accessorKey: 'loggerId',
      cell: ({ getValue, row }) => {
        const loggerId = getValue() as string;
        const serialNumber = row.original.serialNumber as number | null;
        const displayValue = serialNumber ? `${loggerId} (${serialNumber})` : loggerId;
        const cellId = `${row.original.loggerId}-loggerId`;
        return (
          <div 
            className="table-cell-content"
            onMouseEnter={() => setHoveredCell(cellId)}
            onMouseLeave={() => setHoveredCell(null)}
            title={hoveredCell === cellId ? displayValue : undefined}
          >
            {displayValue}
          </div>
        );
      },
    },
    {
      id: 'deliveryId',
      header: () => (
        <div className="column-header">
          Delivery Number
        </div>
      ),
      accessorKey: 'deliveryId',
      cell: ({ getValue, row }) => {
        const value = (getValue() as string | null) || 'n/a';
        const cellId = `${row.original.loggerId}-deliveryId`;
        return (
          <div 
            className="table-cell-content"
            onMouseEnter={() => setHoveredCell(cellId)}
            onMouseLeave={() => setHoveredCell(null)}
            title={hoveredCell === cellId ? value : undefined}
          >
            {value}
          </div>
        );
      },
    },
    {
      id: 'loggerType',
      header: () => (
        <div className="column-header logger-type-header">
          <div>Logger</div>
          <div>Type</div>
        </div>
      ),
      accessorKey: 'loggerType',
      cell: ({ getValue, row }) => {
        const value = getValue() as string
        const cellId = `${row.original.loggerId}-loggerType`;
        return (
          <div 
            className="table-cell-content"
            onMouseEnter={() => setHoveredCell(cellId)}
            onMouseLeave={() => setHoveredCell(null)}
            title={hoveredCell === cellId ? value : undefined}
          >
            {value}
          </div>
        );
      },
    },
    {
      id: 'tempProfile',
      header: () => (
        <div className="column-header temp-profile-header">
          <div>Profile Type</div>
        </div>
      ),
      accessorKey: 'tempProfile',
      cell: ({ getValue, row }) => {
        const value = getValue() as string;
        const cellId = `${row.original.loggerId}-tempProfile`;
        return (
          <div 
            className="table-cell-content"
            onMouseEnter={() => setHoveredCell(cellId)}
            onMouseLeave={() => setHoveredCell(null)}
            title={hoveredCell === cellId ? value : undefined}
          >
            {value}
          </div>
        );
      },
    },
    {
      id: 'missionStarted',
      header: () => (
        <div className="column-header mission-date-header">
          Mission Started
        </div>
      ),
      accessorKey: 'missionStarted',
      cell: ({ getValue, row }) => {
        const started = getValue() as string | null;
        
        // Check if mission hasn't started (n/a or null/undefined)
        const missionNotStarted = !started || started === 'n/a';
        
        if (missionNotStarted) {
          // Show error icon and text for missions that haven't started
          const cellId = `${row.original.loggerId}-missionStarted`;
          return (
            <div 
              className="table-cell-content mission-error"
              onMouseEnter={() => setHoveredCell(cellId)}
              onMouseLeave={() => setHoveredCell(null)}
              title={hoveredCell === cellId ? "Error mission not started" : undefined}
            >
              <div className="mission-error-content">
                {getAlarmIcon('default', 16)}
                <span className="mission-error-text">Error mission not started</span>
              </div>
            </div>
          );
        }
        
        // For missions that have started, show the formatted date
        let value = 'n/a';
        if (started) {
          try {
            const date = new Date(started);
            value = date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'n/a';
          } catch {
            value = 'n/a';
          }
        }
        
        const cellId = `${row.original.loggerId}-missionStarted`;
        return (
          <div 
            className="table-cell-content"
            onMouseEnter={() => setHoveredCell(cellId)}
            onMouseLeave={() => setHoveredCell(null)}
            title={hoveredCell === cellId ? value : undefined}
          >
            {value}
          </div>
        );
      },
    },
    {
      id: 'missionEnded',
      header: () => (
        <div className="column-header mission-date-header">
          Mission Ended
        </div>
      ),
      accessorKey: 'missionEnded',
      cell: ({ row }) => {
        const ended = row.original.missionEnded as string;
        const shipmentStatus = row.original.shipmentStatus as string;
        
        // Check if mission hasn't ended (n/a) and shipment is departed - this is an error
        const missionNotEnded = (!ended || ended === 'n/a') && shipmentStatus === 'Delivered';
        
        if (missionNotEnded) {
          // Show error icon and text for missions that haven't ended on departed shipments
          const cellId = `${row.original.loggerId}-missionEnded`;
          return (
            <div 
              className="table-cell-content mission-error"
              onMouseEnter={() => setHoveredCell(cellId)}
              onMouseLeave={() => setHoveredCell(null)}
              title={hoveredCell === cellId ? "Error mission not ended" : undefined}
            >
              <div className="mission-error-content">
                {getAlarmIcon('default', 16)}
                <span className="mission-error-text">Error mission not ended</span>
              </div>
            </div>
          );
        }
        
        let value = 'n/a';
        
        // If the shipment is departed, show the shipment ETA
        if (shipmentStatus === 'Delivered' && row.original.shipmentEta) {
          try {
            const date = new Date(row.original.shipmentEta);
            value = date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'n/a';
          } catch {
            value = 'n/a';
          }
        } else if (shipmentStatus === 'In Transit' || ended === 'n/a') {
          value = 'n/a';
        } else if (ended) {
          try {
            const date = new Date(ended);
            value = date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'n/a';
          } catch {
            value = 'n/a';
          }
        }
        
        const cellId = `${row.original.loggerId}-missionEnded`;
        return (
          <div 
            className="table-cell-content"
            onMouseEnter={() => setHoveredCell(cellId)}
            onMouseLeave={() => setHoveredCell(null)}
            title={hoveredCell === cellId ? value : undefined}
          >
            {value}
          </div>
        );
      },
    },
    {
      id: 'alarms',
      header: () => (
        <div className="column-header">
          Alarm Type
        </div>
      ),
      cell: ({ row }) => {
        const logger = row.original;
        
        // Only show alarm icons if there are actual alarms, not just alarm types
        let alarmTypes: string[] = [];
        
        if (logger.alarms && logger.alarms.length > 0) {
          // Get unique alarm types from actual alarms array
          alarmTypes = [...new Set(logger.alarms.map(alarm => alarm.alarmType || 'Unknown'))];
        }
        
        if (alarmTypes.length === 0) {
          return (
            <div className="table-cell-content">
              None
            </div>
          );
        }
        
        return (
          <div className="table-cell-content">
            {alarmTypes.length > 0 ? alarmTypes.join(', ') : ''}
          </div>
        );
      },
    },
    {
      id: 'evaluation',
      header: () => (
        <div className="column-header">
          Evaluation
        </div>
      ),
      accessorKey: 'evaluation',
      cell: ({ getValue, row }) => {
        const value = (getValue() as string | null) || 'n/a';
        const cellId = `${row.original.loggerId}-evaluation`;
        return (
          <div 
            className="table-cell-content"
            onMouseEnter={() => setHoveredCell(cellId)}
            onMouseLeave={() => setHoveredCell(null)}
            title={hoveredCell === cellId ? value : undefined}
          >
            {value}
          </div>
        );
      },
    },
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => (
        <div className="logger-expand-cell">
          <span className="report-view-text">Report View</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Open shipment report for logger ${row.original.loggerId} in new tab`);
            }}
            className="expand-button"
          >
            {selectedLoggerId === row.original.loggerId ? (
              <ChevronLeft className="expand-icon expanded" size={16} />
            ) : (
              <ChevronRight className="expand-icon" size={16} />
            )}
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: loggers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="nested-table-wrapper">
      <table className="nested-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {shipment && onViewShipmentDetails && (
          <tfoot>
            <tr className="logger-table-footer">
              <td colSpan={columns.length} className="footer-cell">
                <button 
                  className="view-more-details-button"
                  onClick={() => {
                    onViewShipmentDetails(shipment);
                  }}
                >
                  <span>View More Shipping Details</span>
                  <ChevronRight size={16} className="view-more-chevron" />
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
