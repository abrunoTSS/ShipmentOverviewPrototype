import React from 'react';
import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Shipment, Logger } from '../types';
import { LoggerTable } from './LoggerTable';
import { FilterBar, type FilterState } from './FilterBar';

interface ShipmentTableProps {
  shipments: Shipment[];
  expandedRow: string | null;
  onRowClick: (shipmentId: string) => void;
  onLoggerClick: (shipment: Shipment, logger: Logger) => void;
  selectedLoggerId: string | null;
  selectedShipmentId: string | null;
}

export function ShipmentTable({ shipments, expandedRow, onRowClick, onLoggerClick, selectedLoggerId, selectedShipmentId }: ShipmentTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    origin: '',
    destination: '',
    status: '',
    freightForwarder: '',
    modeOfTransport: '',
    packagingType: '',
    alarms: '',
    rcas: '',
    startDate: null,
    endDate: null,
  });

  // Filter shipments based on current filters
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      // Search filter - matches any text field
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          shipment.shipmentId,
          shipment.origin,
          shipment.destination,
          shipment.eta,
          shipment.status,
          shipment.freightForwarder,
          shipment.currentLocation,
          shipment.modeOfTransport,
          shipment.packagingType,
          shipment.alarms?.toString(),
          shipment.rcas,
        ];
        
        const matchesSearch = searchableFields.some(field => 
          field?.toLowerCase().includes(searchTerm)
        );
        
        if (!matchesSearch) return false;
      }

      // Dropdown filters (case-insensitive)
      if (filters.origin && shipment.origin?.toLowerCase() !== filters.origin.toLowerCase()) return false;
      if (filters.destination && shipment.destination?.toLowerCase() !== filters.destination.toLowerCase()) return false;
      if (filters.status && shipment.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.freightForwarder && shipment.freightForwarder?.toLowerCase() !== filters.freightForwarder.toLowerCase()) return false;
      if (filters.modeOfTransport && shipment.modeOfTransport?.toLowerCase() !== filters.modeOfTransport.toLowerCase()) return false;
      if (filters.packagingType && shipment.packagingType?.toLowerCase() !== filters.packagingType.toLowerCase()) return false;
      
      // Alarms filter (Yes/No based on totalAlarms > 0)
      if (filters.alarms) {
        const hasAlarms = (shipment.alarms || 0) > 0;
        if (filters.alarms === 'Yes' && !hasAlarms) return false;
        if (filters.alarms === 'No' && hasAlarms) return false;
      }
      
      // Root Cause Analysis filter (case-insensitive)
      if (filters.rcas && shipment.rcas?.toLowerCase() !== filters.rcas.toLowerCase()) return false;

      // Date range filter
      if (filters.startDate && filters.endDate) {
        const mostRecentLastSeen = shipment.loggerData?.reduce((latest, logger) => {
          if (!logger.lastSeen) return latest;
          const loggerDate = new Date(logger.lastSeen);
          return latest && latest > loggerDate ? latest : loggerDate;
        }, null as Date | null);

        if (!mostRecentLastSeen) return false; // Filter out if no valid date

        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);

        if (mostRecentLastSeen < startDate || mostRecentLastSeen > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [shipments, filters]);
  const columns: ColumnDef<Shipment>[] = [
    {
      id: 'shipmentId',
      header: 'Shipment ID',
      accessorKey: 'shipmentId',
      cell: ({ row }) => (
        <div className="company-info">
          <span className="company-name">{row.original.shipmentId}</span>
        </div>
      ),
    },
    {
      id: 'origin',
      header: 'Origin',
      accessorKey: 'origin',
    },
    {
      id: 'destination',
      header: 'Destination',
      accessorKey: 'destination',
    },
    {
      id: 'eta',
      header: 'ETA',
      accessorKey: 'eta',
      cell: ({ getValue }) => {
        const eta = getValue() as string | null;
        // Check if eta is a valid date string or a special value like "Unavailable"
        if (!eta) return 'N/A';
        if (eta === 'Unavailable') return 'Unavailable';
        
        // Try to parse as date, but handle invalid dates gracefully
        const date = new Date(eta);
        return isNaN(date.getTime()) ? eta : date.toLocaleDateString();
      },
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() as string | null;
        return status || 'N/A';
      },
    },
    {
      id: 'freightForwarder',
      header: 'FF',
      accessorKey: 'freightForwarder',
    },
    {
      id: 'currentLocation',
      header: 'Current Location',
      accessorKey: 'currentLocation',
    },
    {
      id: 'modeOfTransport',
      header: 'Mode of Transport',
      accessorKey: 'modeOfTransport',
    },
    {
      id: 'packagingType',
      header: 'Packaging Type',
      accessorKey: 'packagingType',
    },
    {
      id: 'loggers',
      header: 'Loggers',
      cell: ({ row }) => (
        <span className="logger-count">
          {row.original.loggerData?.length || 0}
        </span>
      ),
    },
    {
      id: 'alarms',
      header: 'Total Alarms',
      accessorKey: 'alarms',
      cell: ({ getValue }) => {
        const alarms = getValue() as number | null;
        return alarms && alarms > 0 ? alarms.toString() : '0';
      },
    },
    {
      id: 'rcas',
      header: 'RCAS',
      accessorKey: 'rcas',
      cell: ({ getValue }) => {
        const rcas = getValue() as string | null;
        return rcas || 'N/A';
      },
    },
    {
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(row.original.shipmentId);
          }}
          className="expand-button"
        >
          {expandedRow === row.original.shipmentId ? (
            <ChevronUp className="expand-icon expanded" size={16} />
          ) : (
            <ChevronDown className="expand-icon" size={16} />
          )}
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredShipments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="table-container">
      <FilterBar 
        shipments={shipments}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <table className="main-table">
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
            <React.Fragment key={row.id}>
              <tr 
                className={`table-row ${row.original.shipmentId === selectedShipmentId ? 'selected-shipment' : ''}`}
                onClick={() => onRowClick(row.original.shipmentId)}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              
              {/* Nested Logger Table */}
              {expandedRow === row.original.shipmentId && (
                <tr className="nested-row">
                  <td colSpan={columns.length} className="nested-table-container">
                    <LoggerTable
                      loggers={row.original.loggerData.map(logger => ({
                        ...logger,
                        shipmentStatus: row.original.status,
                        shipmentEta: row.original.eta
                      }))}
                      onLoggerClick={(logger) => onLoggerClick(row.original, logger)}
                      selectedLoggerId={selectedLoggerId}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
