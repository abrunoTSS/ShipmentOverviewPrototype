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
  onLoggerClick: (logger: Logger) => void;
  showSidePanel: boolean;
}

export function ShipmentTable({ shipments, expandedRow, onRowClick, onLoggerClick, showSidePanel }: ShipmentTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    origin: '',
    destination: '',
    status: '',
    freightForwarder: '',
    modeOfTransport: '',
    packagingType: '',
    alarms: '',
    rootCauseAnalysis: '',
  });

  // Filter shipments based on current filters
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      // Search filter - matches any text field
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          shipment.id,
          shipment.origin,
          shipment.destination,
          shipment.eta,
          shipment.status,
          shipment.FF,
          shipment.currentLocation,
          shipment.modeOfTransport,
          shipment.packagingType,
          shipment.totalAlarms?.toString(),
          shipment.RCAS,
          shipment.lastSeen,
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
      if (filters.freightForwarder && shipment.FF?.toLowerCase() !== filters.freightForwarder.toLowerCase()) return false;
      if (filters.modeOfTransport && shipment.modeOfTransport?.toLowerCase() !== filters.modeOfTransport.toLowerCase()) return false;
      if (filters.packagingType && shipment.packagingType?.toLowerCase() !== filters.packagingType.toLowerCase()) return false;
      
      // Alarms filter (Yes/No based on totalAlarms > 0)
      if (filters.alarms) {
        const hasAlarms = (shipment.totalAlarms || 0) > 0;
        if (filters.alarms === 'Yes' && !hasAlarms) return false;
        if (filters.alarms === 'No' && hasAlarms) return false;
      }
      
      // Root Cause Analysis filter (case-insensitive)
      if (filters.rootCauseAnalysis && shipment.RCAS?.toLowerCase() !== filters.rootCauseAnalysis.toLowerCase()) return false;

      return true;
    });
  }, [shipments, filters]);
  const columns: ColumnDef<Shipment>[] = [
    {
      id: 'shipmentId',
      header: 'Shipment ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <div className="company-info">
          <span className="company-name">{row.original.id}</span>
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
        return eta ? new Date(eta).toLocaleDateString() : 'N/A';
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
      id: 'FF',
      header: 'FF',
      accessorKey: 'FF',
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
          {row.original.logger_data?.length || 0}
        </span>
      ),
    },
    {
      id: 'totalAlarms',
      header: 'Total Alarms',
      accessorKey: 'totalAlarms',
      cell: ({ getValue }) => {
        const alarms = getValue() as number | null;
        return alarms && alarms > 0 ? alarms.toString() : '0';
      },
    },
    {
      id: 'RCAS',
      header: 'RCAS',
      accessorKey: 'RCAS',
      cell: ({ getValue }) => {
        const rcas = getValue() as string | null;
        return rcas || 'N/A';
      },
    },
    {
      id: 'lastSeen',
      header: 'Last Seen',
      accessorKey: 'lastSeen',
      cell: ({ getValue }) => {
        const lastSeen = getValue() as string | null;
        return lastSeen ? (
          <div className="last-seen">
            {new Date(lastSeen).toLocaleString()}
          </div>
        ) : 'N/A';
      },
    },
    {
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(row.original.id);
          }}
          className="expand-button"
        >
          {expandedRow === row.original.id ? (
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
              <tr>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              
              {/* Nested Logger Table */}
              {expandedRow === row.original.id && (
                <tr>
                  <td colSpan={columns.length} className="nested-table-container">
                    <LoggerTable
                      loggers={row.original.logger_data}
                      onLoggerClick={onLoggerClick}
                      showSidePanel={showSidePanel}
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
