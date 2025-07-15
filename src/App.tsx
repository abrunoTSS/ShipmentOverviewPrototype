import { useState } from 'react';
import type { Logger } from './types';
import { shipments } from './data/Shipments';
import { ShipmentTable } from './components/ShipmentTable';
import { SidePanel } from './components/SidePanel';

function App() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sidePanelData, setSidePanelData] = useState<Logger | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const handleRowClick = (shipmentId: string) => {
    setExpandedRow(expandedRow === shipmentId ? null : shipmentId);
  };

  const handleLoggerClick = (logger: Logger) => {
    setSidePanelData(logger);
    setShowSidePanel(true);
  };

  const closeSidePanel = () => {
    setShowSidePanel(false);
    setSidePanelData(null);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h1>Shipment Visibility</h1>
          <p>Track shipments and monitor logger data</p>
        </div>

        {/* Main Table */}
        <ShipmentTable
          shipments={shipments}
          expandedRow={expandedRow}
          onRowClick={handleRowClick}
          onLoggerClick={handleLoggerClick}
        />
      </div>

      {/* Side Panel */}
      <SidePanel
        logger={sidePanelData}
        isOpen={showSidePanel}
        onClose={closeSidePanel}
      />
    </div>
  );
}

export default App;
