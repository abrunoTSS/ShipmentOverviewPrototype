import React from 'react';
import type { Shipment, Logger } from '../types';
import { ShipmentRow } from './ShipmentRow';
import { LoggerTable } from './LoggerTable';

interface ShipmentTableProps {
  shipments: Shipment[];
  expandedRow: string | null;
  onRowClick: (shipmentId: string) => void;
  onLoggerClick: (logger: Logger) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  expandedRow,
  onRowClick,
  onLoggerClick,
}) => {
  return (
    <div className="table-container">
      <table className="main-table">
        <thead>
          <tr>
            <th>Shipment ID</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>ETA</th>
            <th>Status</th>
            <th>FF</th>
            <th>Current Location</th>
            <th>Mode of Transport</th>
            <th>Packaging Type</th>
            <th>Loggers</th>
            <th>Total Alarms</th>
            <th>RCAS</th>
            <th>Last Seen</th>
            <th></th>
          </tr>
        </thead>
          <tbody>
            {shipments.map((shipment) => (
              <React.Fragment key={shipment.id}>
                <ShipmentRow
                  shipment={shipment}
                  isExpanded={expandedRow === shipment.id}
                  onRowClick={onRowClick}
                />

                {/* Nested Logger Table */}
                {expandedRow === shipment.id && (
                  <tr>
                    <td colSpan={14} className="nested-table-container">
                      <LoggerTable
                        loggers={shipment.logger_data}
                        onLoggerClick={onLoggerClick}
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
