import React from 'react';
import { ChevronDown, ChevronRight, Package, AlertTriangle } from 'lucide-react';
import type { Shipment } from '../types';

interface ShipmentRowProps {
  shipment: Shipment;
  isExpanded: boolean;
  onRowClick: (shipmentId: string) => void;
}

export const ShipmentRow: React.FC<ShipmentRowProps> = ({
  shipment,
  isExpanded,
  onRowClick,
}) => {
  return (
    <tr
      onClick={() => onRowClick(shipment.id)}
      className={isExpanded ? "expanded" : ""}
    >
      <td>
        <div className="company-info">
          <Package className="company-icon" />
          <span className="company-name">{shipment.shipmentId}</span>
        </div>
      </td>
      <td>
        <span className="origin">{shipment.origin}</span>
      </td>
      <td>
        <span className="destination">{shipment.destination}</span>
      </td>
      <td>
        <div className="eta-info">
          <span>{shipment.eta}</span>
        </div>
      </td>
      <td>
        <span className={`status-badge status-${shipment.status?.toLowerCase().replace(' ', '-')}`}>
          {shipment.status}
        </span>
      </td>
      <td>
        <span className="freight-forwarder">{shipment.FF}</span>
      </td>
      <td>
        <span className="current-location">{shipment.currentLocation}</span>
      </td>
      <td>
        <span className="transport-mode">{shipment.modeOfTransport}</span>
      </td>
      <td>
        <span className="packaging-type">{shipment.packagingType}</span>
      </td>
      <td>
        <span className="logger-count">{shipment.logger_data.length}</span>
      </td>
      <td>
        <div className="alarm-count">
          {shipment.totalAlarms && shipment.totalAlarms > 0 ? (
            <>
              <AlertTriangle className="alarm-icon" />
              <span>{shipment.totalAlarms}</span>
            </>
          ) : (
            <span className="no-alarms">0</span>
          )}
        </div>
      </td>
      <td>
        <span className="root-cause-status">{shipment.RCAS}</span>
      </td>
      <td>
        <span className="last-seen">{shipment.lastSeen ? new Date(shipment.lastSeen).toLocaleString() : 'N/A'}</span>
      </td>
      <td>
        {isExpanded ? (
          <ChevronDown className="expand-icon expanded" />
        ) : (
          <ChevronRight className="expand-icon" />
        )}
      </td>
    </tr>
  );
};
