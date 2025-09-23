
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { Logger } from '../types';
import './LoggerTable.css';

interface LoggerTableProps {
  loggers: Logger[];
  onLoggerClick: (logger: Logger) => void;
  selectedLoggerId: string | null;
  visibleLoggers?: Set<string>;
  onLoggerVisibilityChange?: (loggerId: string, visible: boolean) => void;
}

export function LoggerTable({ 
  loggers, 
  onLoggerClick, 
  selectedLoggerId, 
  visibleLoggers = new Set(loggers.map(l => l.loggerId)), 
  onLoggerVisibilityChange 
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
          <input
            type="checkbox"
            checked={allVisible}
            ref={(input) => {
              if (input) input.indeterminate = indeterminate;
            }}
            onChange={(e) => handleMasterCheckboxChange(e.target.checked)}
            className="master-checkbox"
          />
          <div className="visibility-label">
            <div>Display</div>
            <div>in Graph</div>
          </div>
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
          <div>Mission</div>
          <div>ID</div>
        </div>
      ),
      accessorKey: 'loggerId',
      cell: ({ getValue, row }) => {
        const value = getValue() as string;
        const cellId = `${row.original.loggerId}-loggerId`;
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
      id: 'serialNumber',
      header: () => (
        <div className="column-header">
          Serial Number
        </div>
      ),
      accessorKey: 'serialNumber',
      cell: ({ getValue, row }) => {
        const serialNumber = getValue() as number | null;
        const value = serialNumber ? serialNumber.toString() : 'n/a';
        const cellId = `${row.original.loggerId}-serialNumber`;
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
      id: 'deliveryId',
      header: () => (
        <div className="column-header">
          Delivery ID
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
        <div className="column-header">
          Logger Type
        </div>
      ),
      accessorKey: 'loggerType',
      cell: ({ getValue, row }) => {
        const value = getValue() as string;
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
      id: 'missionStarted',
      header: () => (
        <div className="column-header mission-date-header">
          Mission Started
        </div>
      ),
      accessorKey: 'missionStarted',
      cell: ({ getValue, row }) => {
        const started = getValue() as string | null;
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
        let value = 'n/a';
        
        // If the shipment is delivered, show the shipment ETA
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
      id: 'tempProfile',
      header: () => (
        <div className="column-header">
          Temperature Profile
        </div>
      ),
      cell: ({ row }) => {
        const productDetails = row.original.productDetails;
        let value = 'n/a';
        if (productDetails?.lowThreshold && productDetails?.highThreshold) {
          value = `${productDetails.lowThreshold} - ${productDetails.highThreshold}`;
        }
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
      id: 'alarms',
      header: () => (
        <div className="column-header">
          Alarm Type
        </div>
      ),
      cell: ({ row }) => {
        const alarms = row.original.alarms;
        let value = 'None';
        if (Array.isArray(alarms) && alarms.length > 0) {
          // Get unique alarm types
          const alarmTypes = [...new Set(alarms.map(alarm => alarm.alarmType || 'Unknown'))];
          value = alarmTypes.join(', ');
        } else if (typeof alarms === 'number' && alarms > 0) {
          value = 'Temperature'; // Default for numeric alarms
        }
        const cellId = `${row.original.loggerId}-alarms`;
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLoggerClick(row.original);
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
      </table>
    </div>
  );
}
