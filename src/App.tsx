import { useState } from 'react';
import type { Shipment, Logger } from './types';
import { shipments } from './data/Shipments';
import { ShipmentTable } from './components/ShipmentTable';
import LoggerDashboard from './components/LoggerDashboard';

function App() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedLogger, setSelectedLogger] = useState<Logger | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const handleRowClick = (shipmentId: string) => {
    setExpandedRow(prevId => (prevId === shipmentId ? null : shipmentId));
    setSelectedShipmentId(shipmentId);
  };

  const handleLoggerClick = (shipment: Shipment, logger: Logger) => {
    setSelectedShipment(shipment);
    setSelectedLogger(logger);
    setIsDashboardOpen(true);
  };

  const handleViewShipmentDetails = (shipment: Shipment) => {
    console.log('handleViewShipmentDetails called with shipment:', shipment.shipmentId);
    console.log('Setting isDashboardOpen to true');
    setSelectedShipment(shipment);
    setSelectedLogger(null); // No specific logger selected, just shipment details
    setIsDashboardOpen(true);
  };

  const closeDashboard = () => {
    setIsDashboardOpen(false);
    setSelectedLogger(null);
    setSelectedShipment(null);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Main Table */}
        <ShipmentTable
          shipments={shipments}
          expandedRow={expandedRow}
          onRowClick={handleRowClick}
          onLoggerClick={handleLoggerClick}
          selectedLoggerId={selectedLogger?.loggerId || null}
          selectedShipmentId={selectedShipmentId}
          onViewShipmentDetails={handleViewShipmentDetails}
        />
      </div>

      {/* Side Panel */}
      <LoggerDashboard
        shipment={selectedShipment}
        logger={selectedLogger}
        isOpen={isDashboardOpen}
        onClose={closeDashboard}
      />
    </div>
  );
}

export default App;
