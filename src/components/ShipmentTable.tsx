import React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
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
import TimeSeriesGraph from './TimeSeriesGraph';

interface ShipmentTableProps {
  shipments: Shipment[];
  expandedRow: string | null;
  onRowClick: (shipmentId: string) => void;
  onLoggerClick: (shipment: Shipment, logger: Logger) => void;
  selectedLoggerId: string | null;
  selectedShipmentId: string | null;
  onViewShipmentDetails?: (shipment: Shipment) => void;
}

export function ShipmentTable({ shipments, expandedRow, onRowClick, onLoggerClick, selectedLoggerId, selectedShipmentId, onViewShipmentDetails }: ShipmentTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    origin: '',
    destination: '',
    status: '',
    freightForwarder: '',
    modeOfTransport: '',
    alarms: '',
    profileType: '',
    evaluation: '',
    milestoneData: '',
    missionStarted: '',
    missionEnded: '',
    startDate: null,
    endDate: null,
  });

  // State for managing logger visibility in graphs
  const [visibleLoggers, setVisibleLoggers] = useState<Map<string, Set<string>>>(new Map());

  // Selection state for shipments (checkboxes)
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(new Set());

  const handleLoggerVisibilityChange = (shipmentId: string, loggerId: string, visible: boolean) => {
    setVisibleLoggers(prev => {
      const newMap = new Map(prev);
      const shipmentLoggers = newMap.get(shipmentId) || new Set();
      
      if (visible) {
        shipmentLoggers.add(loggerId);
      } else {
        shipmentLoggers.delete(loggerId);
      }
      
      newMap.set(shipmentId, shipmentLoggers);
      return newMap;
    });
  };

  // Initialize visible loggers for expanded shipment
  const getVisibleLoggersForShipment = (shipmentId: string, loggers: Logger[]) => {
    if (!visibleLoggers.has(shipmentId)) {
      // Initialize with all loggers visible by default
      const allLoggerIds = new Set(loggers.map(logger => logger.loggerId));
      setVisibleLoggers(prev => new Map(prev).set(shipmentId, allLoggerIds));
      return allLoggerIds;
    }
    return visibleLoggers.get(shipmentId) || new Set();
  };

  // Filter shipments based on current filters
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      // Search filter - matches Shipping Number, mission ID, and Delivery Number
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        
        // Check Shipping Number
        const matchesShipmentId = shipment.shipmentId?.toLowerCase().includes(searchTerm);
        
        // Check mission IDs and Delivery Numbers from logger data
        const matchesLoggerData = shipment.loggerData?.some((logger: any) => {
          const matchesMissionId = logger.loggerId?.toLowerCase().includes(searchTerm);
          const matchesDeliveryId = logger.deliveryId?.toLowerCase().includes(searchTerm);
          return matchesMissionId || matchesDeliveryId;
        });
        
        const matchesSearch = matchesShipmentId || matchesLoggerData;
        
        if (!matchesSearch) return false;
      }

      // Dropdown filters (case-insensitive)
      if (filters.origin && shipment.origin?.toLowerCase() !== filters.origin.toLowerCase()) return false;
      if (filters.destination && shipment.destination?.toLowerCase() !== filters.destination.toLowerCase()) return false;
      if (filters.status && shipment.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.freightForwarder && shipment.freightForwarder?.toLowerCase() !== filters.freightForwarder.toLowerCase()) return false;
      if (filters.modeOfTransport && shipment.modeOfTransport?.toLowerCase() !== filters.modeOfTransport.toLowerCase()) return false;
      
      // Alarms filter (Yes/No based on totalAlarms > 0)
      if (filters.alarms) {
        const hasAlarms = (shipment.alarms || 0) > 0;
        if (filters.alarms === 'Yes' && !hasAlarms) return false;
        if (filters.alarms === 'No' && hasAlarms) return false;
      }
      
      // Profile Type filter
      if (filters.profileType) {
        if (!shipment.profileType) return false;
        const profile = shipment.profileType.toLowerCase();
        const selected = filters.profileType.toLowerCase();
        if (profile !== selected) return false;
      }
      
      // Root Cause Analysis filter (case-insensitive)
      if (filters.evaluation && shipment.evaluation?.toLowerCase() !== filters.evaluation.toLowerCase()) return false;
      
      // Milestone Data filter (SH014 is the only shipment without milestone data)
      if (filters.milestoneData) {
        const hasMilestoneData = shipment.shipmentId !== 'SH014';
        if (filters.milestoneData === 'Yes' && !hasMilestoneData) return false;
        if (filters.milestoneData === 'No' && hasMilestoneData) return false;
      }

      // Mission Started filter (Yes/No based on whether loggers have mission started)
      if (filters.missionStarted) {
        const allLoggersStarted = shipment.loggerData?.every(logger => 
          logger.missionStarted && logger.missionStarted !== 'n/a'
        ) || false;
        const hasNotStartedLoggers = shipment.loggerData?.some(logger => 
          !logger.missionStarted || logger.missionStarted === 'n/a'
        ) || false;
        
        if (filters.missionStarted === 'Yes' && !allLoggersStarted) return false;
        if (filters.missionStarted === 'No' && !hasNotStartedLoggers) return false;
      }
      
      // Mission Ended filter (Yes/No based on whether loggers have mission ended)
      if (filters.missionEnded) {
        const allLoggersEnded = shipment.loggerData?.every(logger => 
          logger.missionEnded && logger.missionEnded !== 'n/a'
        ) || false;
        const hasNotEndedLoggers = shipment.loggerData?.some(logger => 
          !logger.missionEnded || logger.missionEnded === 'n/a'
        ) || false;
        
        if (filters.missionEnded === 'Yes' && !allLoggersEnded) return false;
        if (filters.missionEnded === 'No' && !hasNotEndedLoggers) return false;
      }

      // Date range filter - using mission started date instead of lastSeen
      if (filters.startDate && filters.endDate) {
        const mostRecentMissionStarted = shipment.loggerData?.reduce((latest, logger) => {
          if (!logger.missionStarted) return latest;
          const loggerDate = new Date(logger.missionStarted);
          return latest && latest > loggerDate ? latest : loggerDate;
        }, null as Date | null);

        if (!mostRecentMissionStarted) return false; // Filter out if no valid date

        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);

        if (mostRecentMissionStarted < startDate || mostRecentMissionStarted > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [shipments, filters]);

  // Master checkbox derived state for filtered rows
  const allVisibleSelected = filteredShipments.length > 0 && filteredShipments.every(s => selectedShipments.has(s.shipmentId));
  const someVisibleSelected = filteredShipments.some(s => selectedShipments.has(s.shipmentId)) && !allVisibleSelected;
  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected, filteredShipments.length]);

  const toggleSelectAllVisible = (checked: boolean) => {
    setSelectedShipments(prev => {
      const next = new Set(prev);
      if (checked) {
        filteredShipments.forEach(s => next.add(s.shipmentId));
      } else {
        filteredShipments.forEach(s => next.delete(s.shipmentId));
      }
      return next;
    });
  };

  const toggleSelectOne = (shipmentId: string, checked: boolean) => {
    setSelectedShipments(prev => {
      const next = new Set(prev);
      if (checked) next.add(shipmentId); else next.delete(shipmentId);
      return next;
    });
  };
  const columns: ColumnDef<Shipment>[] = [
    {
      id: 'select',
      header: () => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input
            type="checkbox"
            ref={headerCheckboxRef}
            checked={allVisibleSelected}
            onChange={(e) => toggleSelectAllVisible(e.target.checked)}
            style={{ accentColor: '#99CC00', cursor: 'pointer' }}
            aria-label="Select all shipments"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input
            type="checkbox"
            checked={selectedShipments.has(row.original.shipmentId)}
            onChange={(e) => {
              e.stopPropagation();
              toggleSelectOne(row.original.shipmentId, e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ accentColor: '#99CC00', cursor: 'pointer' }}
            aria-label={`Select shipment ${row.original.shipmentId}`}
          />
        </div>
      )    
    },
    {
      id: 'shipmentId',
      header: 'Shipping Number',
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
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() as string | null;
        return status || 'n/a';
      },
    },
    {
      id: 'freightForwarder',
      header: 'Freight Forwarder',
      accessorKey: 'freightForwarder',
    },
    {
      id: 'modeOfTransport',
      header: 'Mode of Transport',
      accessorKey: 'modeOfTransport',
    },
    {
      id: 'packagingType',
      header: 'Packaging Solution',
      accessorKey: 'packagingType',
    },
    {
      id: 'alarms',
      header: 'Loggers Alarmed',
      cell: ({ row }) => {
        const loggers = row.original.loggerData || [];
        const totalLoggers = loggers.length;
        const loggersWithAlarms = loggers.filter(logger => {
          return logger.alarms && logger.alarms.length > 0;
        }).length;
        return `${loggersWithAlarms}/${totalLoggers} loggers`;
      },
    },
    {
      id: 'evaluation',
      header: 'Evaluation',
      accessorKey: 'evaluation',
      cell: ({ getValue }) => {
        const evaluation = getValue() as string | null;
        return evaluation || 'n/a';
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
              
              {/* Graph Section - always render when expanded; TimeSeriesGraph will show a fallback message if no data */}
              {expandedRow === row.original.shipmentId && row.original.loggerData && (
                <tr className="graph-nested-row">
                  <td colSpan={columns.length} className="graph-nested-container">
                    <TimeSeriesGraph 
                      loggers={row.original.loggerData.filter(logger => {
                        const visibleLoggersSet = getVisibleLoggersForShipment(row.original.shipmentId, row.original.loggerData);
                        // Do not filter out loggers without time series here; allow graph to decide and show fallback
                        return visibleLoggersSet.has(logger.loggerId);
                      })}
                      shipment={row.original}
                      height={400}
                      className="shipment-graph"
                    />
                  </td>
                </tr>
              )}
              
              {/* Logger Table as nested table */}
              {expandedRow === row.original.shipmentId && (
                <tr className="logger-nested-row">
                  <td colSpan={columns.length} className="logger-nested-container">
                    <LoggerTable
                      loggers={row.original.loggerData.map(logger => ({
                        ...logger,
                        shipmentStatus: row.original.status,
                        shipmentEta: row.original.eta
                      }))}
                      onLoggerClick={(logger) => onLoggerClick(row.original, logger)}
                      selectedLoggerId={selectedLoggerId}
                      visibleLoggers={getVisibleLoggersForShipment(row.original.shipmentId, row.original.loggerData)}
                      onLoggerVisibilityChange={(loggerId, visible) => 
                        handleLoggerVisibilityChange(row.original.shipmentId, loggerId, visible)
                      }
                      shipment={row.original}
                      onViewShipmentDetails={onViewShipmentDetails}
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
