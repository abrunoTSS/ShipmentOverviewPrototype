import { Search, X, Filter, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { Shipment } from '../types';
import './filterBar.css';
import './LoggerTable.css';

export interface FilterState {
  search: string;
  origin: string;
  destination: string;
  status: string;
  freightForwarder: string;
  modeOfTransport: string;
  alarms: string;
  alarmType: string;
  rcas: string;
  milestoneData: string;
  missionStarted: string;
  missionEnded: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

interface FilterBarProps {
  shipments: Shipment[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterPill = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <div className="filter-pill">
    <span>{label}</span>
    <button onClick={onRemove} className="remove-pill-btn">
      <X size={14} />
    </button>
  </div>
);

const getUniqueValues = (shipments: Shipment[], key: keyof Shipment) => {
  const values = shipments.map(shipment => shipment[key]);
  return [...new Set(values)].filter(Boolean) as string[];
};


export const FilterBar = ({ shipments, filters, onFiltersChange }: FilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleDownloadXLSX = () => {
    // This is a placeholder function for downloading shipment data as XLSX
    console.log('Downloading shipment data as XLSX...');
    alert('XLSX download functionality will be implemented in the next sprint');
    // In a real implementation, we would use a library like xlsx or exceljs to generate
    // and download the Excel file with the current filtered shipment data
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      origin: '',
      destination: '',
      status: '',
      freightForwarder: '',
      modeOfTransport: '',
      alarms: '',
      alarmType: '',
      rcas: '',
      milestoneData: '',
      missionStarted: '',
      missionEnded: '',
      startDate: null,
      endDate: null,
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '' && value !== null && value !== undefined);
  }, [filters]);

  const activeFilters = useMemo(() => {
    const active: Array<{ key: string; label: string; onRemove: () => void }> = [];
    
    (Object.keys(filters) as Array<keyof FilterState>).forEach(key => {
      const value = filters[key];
      if (!value) return;

      if (key === 'startDate' && filters.endDate) {
        active.push({
          key: 'dateRange',
          label: `Date: ${new Date(filters.startDate!).toLocaleDateString()} - ${new Date(filters.endDate!).toLocaleDateString()}`,
          onRemove: () => {
            handleFilterChange('startDate', null);
            handleFilterChange('endDate', null);
          }
        });
      } else if (key !== 'endDate') {
        let label = '';
        switch(key) {
          case 'search': label = `Search: ${value}`; break;
          case 'origin': label = `Origin: ${value}`; break;
          case 'destination': label = `Destination: ${value}`; break;
          case 'status': label = `Status: ${value}`; break;
          case 'freightForwarder': label = `Forwarder: ${value}`; break;
          case 'modeOfTransport': label = `Transport: ${value}`; break;
          case 'alarms': label = `Alarms: ${value}`; break;
          case 'alarmType': label = `Alarm Type: ${value}`; break;
          case 'rcas': label = `RCA: ${value}`; break;
          case 'milestoneData': label = `Milestone Data: ${value}`; break;
          case 'missionStarted': label = `Mission Started: ${value}`; break;
          case 'missionEnded': label = `Mission Ended: ${value}`; break;
        }
        if (label) {
            active.push({ key, label, onRemove: () => handleFilterChange(key, '') });
        }
      }
    });

    return active;
  }, [filters]);

  const renderSelect = (key: keyof FilterState, label: string, options: string[]) => (
    <div className="filter-group">
      <label>{label}</label>
      <select
        value={filters[key] as string}
        onChange={(e) => handleFilterChange(key, e.target.value)}
        className="filter-select"
      >
        <option value="">All {label}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const renderAlarmTypeSelect = () => (
    <div className="filter-group">
      <label>Alarm Type</label>
      <select
        value={filters.alarmType}
        onChange={(e) => handleFilterChange('alarmType', e.target.value)}
        className="filter-select alarm-type-select"
      >
        <option value="">All Alarm Types</option>
        {uniqueAlarmTypes.map(alarmType => (
          <option key={alarmType} value={alarmType}>
            {alarmType}
          </option>
        ))}
      </select>
    </div>
  );

  const uniqueOrigins = useMemo(() => getUniqueValues(shipments, 'origin'), [shipments]);
  const uniqueDestinations = useMemo(() => getUniqueValues(shipments, 'destination'), [shipments]);
  const uniqueStatuses = useMemo(() => getUniqueValues(shipments, 'status'), [shipments]);
  const uniqueForwarders = useMemo(() => getUniqueValues(shipments, 'freightForwarder'), [shipments]);
  const uniqueTransportModes = useMemo(() => getUniqueValues(shipments, 'modeOfTransport'), [shipments]);
  const uniqueRCAStatuses = useMemo(() => getUniqueValues(shipments, 'rcas'), [shipments]);

  // Get unique alarm types from all loggers across all shipments
  const uniqueAlarmTypes = useMemo(() => {
    const alarmTypes = new Set<string>();
    try {
      shipments.forEach(shipment => {
        if (shipment?.loggerData && Array.isArray(shipment.loggerData)) {
          shipment.loggerData.forEach((logger: any) => {
            if (logger?.alarmTypes && Array.isArray(logger.alarmTypes)) {
              logger.alarmTypes.forEach((alarmType: string) => {
                if (alarmType && typeof alarmType === 'string') {
                  alarmTypes.add(alarmType);
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.error('Error extracting unique alarm types:', error);
    }
    return Array.from(alarmTypes).sort();
  }, [shipments]);

  return (
    <div className="filter-bar-wrapper">
      <div className="filter-bar">
        <div className="filter-main-controls">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search shipments, missions, or delivery IDs..."
              className="search-input"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="button-container">
            <button onClick={() => handleDownloadXLSX()} className="filter-toggle-btn download-btn">
              <Download size={20} />
              <span>Download XLSX</span>
            </button>
            <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle-btn">
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-dropdown-section">
            <div className="filter-grid">
              {renderSelect('origin', 'Origin', uniqueOrigins)}
              {renderSelect('destination', 'Destination', uniqueDestinations)}
              {renderSelect('status', 'Status', uniqueStatuses)}
              {renderSelect('freightForwarder', 'Freight Forwarder', uniqueForwarders)}
              {renderSelect('modeOfTransport', 'Transport', uniqueTransportModes)}
              {renderSelect('alarms', 'Alarms', ['Yes', 'No'])}
              {renderAlarmTypeSelect()}
              {renderSelect('rcas', 'RCA', uniqueRCAStatuses)}
              {renderSelect('milestoneData', 'Milestone Data', ['Yes', 'No'])}
              {renderSelect('missionStarted', 'Mission Started', ['Yes', 'No'])}
              {renderSelect('missionEnded', 'Mission Ended', ['Yes', 'No'])}
            </div>
            <div className="filter-group date-range-group">
              <label>Shipment Date Range</label>
              <div className="date-pickers">
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  selectsStart
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  placeholderText="Start Date"
                  className="date-input"
                  isClearable
                />
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  selectsEnd
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  minDate={filters.startDate}
                  placeholderText="End Date"
                  className="date-input"
                  isClearable
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          <div className="pills-container">
            {activeFilters.map(filter => (
              <FilterPill key={filter.key} label={filter.label} onRemove={filter.onRemove} />
            ))}
          </div>
          <button onClick={clearAllFilters} className="remove-all-filters-btn">
            Remove All
          </button>
        </div>
      )}
    </div>
  );
};
