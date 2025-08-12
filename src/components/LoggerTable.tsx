
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
  showSidePanel: boolean;
}

export function LoggerTable({ loggers, onLoggerClick, showSidePanel }: LoggerTableProps) {
  const columns: ColumnDef<Logger>[] = [
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
        return started ? new Date(started).toLocaleString() : 'N/A';
      },
    },
    {
      id: 'loggerEnded',
      header: 'Logger Ended',
      accessorKey: 'loggerEnded',
      cell: ({ getValue }) => {
        const ended = getValue() as string | null;
        return ended ? new Date(ended).toLocaleString() : 'N/A';
      },
    },
    {
      id: 'alarms',
      header: 'Alarms',
      accessorKey: 'alarms',
      cell: ({ getValue }) => {
        const alarms = getValue() as number | null;
        return alarms && alarms > 0 ? alarms.toString() : '0';
      },
    },
    {
      id: 'rootCauseAnalysis',
      header: 'Root Cause Analysis',
      accessorKey: 'rootCauseAnalysis',
      cell: ({ getValue }) => {
        const rca = getValue() as string | null;
        return rca || 'N/A';
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
            {showSidePanel ? (
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
