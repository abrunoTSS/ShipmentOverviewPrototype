
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { Logger } from '../types';

interface LoggerTableProps {
  loggers: Logger[];
  onLoggerClick: (logger: Logger) => void;
  selectedLoggerId: string | null;
  visibleLoggerIds?: Set<string>;
  onLoggerVisibilityChange?: (loggerId: string, visible: boolean) => void;
}

export function LoggerTable({ loggers, onLoggerClick, selectedLoggerId, visibleLoggerIds, onLoggerVisibilityChange }: LoggerTableProps) {
  // Calculate if all loggers are selected
  const allSelected = visibleLoggerIds ? loggers.every(logger => visibleLoggerIds.has(logger.loggerId)) : true;
  const someSelected = visibleLoggerIds ? loggers.some(logger => visibleLoggerIds.has(logger.loggerId)) : true;

  const handleSelectAll = (checked: boolean) => {
    if (onLoggerVisibilityChange) {
      loggers.forEach(logger => {
        onLoggerVisibilityChange(logger.loggerId, checked);
      });
    }
  };

  const columns: ColumnDef<Logger>[] = [
    {
      id: 'checkbox',
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected && !allSelected;
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={!onLoggerVisibilityChange}
            title={allSelected ? 'Deselect All' : 'Select All'}
          />
          <span>Show in Graph</span>
        </div>
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={visibleLoggerIds?.has(row.original.loggerId) ?? true}
          onChange={(e) => {
            if (onLoggerVisibilityChange) {
              onLoggerVisibilityChange(row.original.loggerId, e.target.checked);
            }
          }}
          disabled={!onLoggerVisibilityChange}
        />
      ),
    },
    {
      id: 'loggerId',
      header: 'Logger ID',
      accessorKey: 'loggerId',
    },
    {
      id: 'loggerType',
      header: 'Logger Type',
      accessorKey: 'loggerType',
    },
    {
      id: 'loggerStarted',
      header: 'Logger Started',
      accessorKey: 'loggerStarted',
      cell: ({ getValue }) => {
        const started = getValue() as string | null;
        if (!started) return 'n/a';
        try {
          const date = new Date(started);
          return date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'n/a';
        } catch {
          return 'n/a';
        }
      },
    },
    {
      id: 'loggerEnded',
      header: 'Logger Ended',
      accessorKey: 'loggerEnded',
      cell: ({ row }) => {
        const ended = row.original.loggerEnded as string;
        const shipmentStatus = row.original.shipmentStatus as string;
        
        // If the shipment is delivered, show the shipment ETA
        if (shipmentStatus === 'Delivered' && row.original.shipmentEta) {
          try {
            const date = new Date(row.original.shipmentEta);
            return date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'n/a';
          } catch {
            return 'n/a';
          }
        }
        
        // If the shipment is in transit, show 'Active'
        if (shipmentStatus === 'In Transit' || ended === 'n/a') {
          return 'n/a';
        }
        
        // Otherwise try to parse the logger end date
        if (ended) {
          try {
            const date = new Date(ended);
            return date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'n/a';
          } catch {
            return 'n/a';
          }
        }
        
        return 'n/a';
      },
    },
    {
      id: 'deliveryId',
      header: 'Delivery ID',
      accessorKey: 'deliveryId',
      cell: ({ row }) => {
        return row.original.deliveryId || 'n/a';
      },
    },

    {
      id: 'alarms',
      header: 'Alarms',
      accessorKey: 'alarms',
      cell: ({ row }) => {
        const alarms = row.original.alarms;
        const alarmCount = Array.isArray(alarms) ? alarms.length : alarms;
        return alarmCount > 0 ? alarmCount.toString() : '0';
      },
    },
    {
      id: 'lastSeen',
      header: 'Last Seen',
      accessorKey: 'lastSeen',
      cell: ({ getValue }) => {
        const lastSeen = getValue() as string | undefined;
        if (!lastSeen) return 'n/a';
        try {
          const date = new Date(lastSeen);
          return date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'n/a';
        } catch {
          return 'n/a';
        }
      },
    },
    {
      id: 'profile',
      header: 'Profile',
      cell: ({ row }) => {
        const productDetails = row.original.productDetails;
        if (productDetails) {
          return `${productDetails.lowThreshold} to ${productDetails.highThreshold}`;
        }
        return 'n/a';
      },
    },
    {
      id: 'rootCauseAnalysis',
      header: 'Root Cause Analysis',
      accessorKey: 'rootCauseAnalysis',
      cell: ({ getValue }) => {
        const rca = getValue() as string | null;
        return rca || 'n/a';
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
