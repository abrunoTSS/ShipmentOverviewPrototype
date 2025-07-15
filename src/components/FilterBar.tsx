import { Search } from 'lucide-react';
import type { Shipment } from '../types';

export interface FilterState {
  search: string;
  origin: string;
  destination: string;
  status: string;
  freightForwarder: string;
  modeOfTransport: string;
  packagingType: string;
  alarms: string;
  rootCauseAnalysis: string;
}

interface FilterBarProps {
  shipments: Shipment[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterBar({ shipments, filters, onFiltersChange }: FilterBarProps) {
  // Extract unique values from shipment data for dropdowns
  const getUniqueValues = (key: keyof Shipment) => {
    const values = shipments
      .map(shipment => shipment[key])
      .filter((value): value is string => value != null && value !== '')
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();
    return values;
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
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
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="filter-bar">
      <div className="filter-row">
        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search shipments…"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="clear-filters-btn">
            Clear All Filters
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Origin Filter */}
        <div className="filter-group">
          <label htmlFor="origin-filter">Origin</label>
          <select
            id="origin-filter"
            value={filters.origin}
            onChange={(e) => handleFilterChange('origin', e.target.value)}
            className="filter-select"
          >
            <option value="">All Origins</option>
            {getUniqueValues('origin').map(origin => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>
        </div>

        {/* Destination Filter */}
        <div className="filter-group">
          <label htmlFor="destination-filter">Destination</label>
          <select
            id="destination-filter"
            value={filters.destination}
            onChange={(e) => handleFilterChange('destination', e.target.value)}
            className="filter-select"
          >
            <option value="">All Destinations</option>
            {getUniqueValues('destination').map(destination => (
              <option key={destination} value={destination}>{destination}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Delayed">Delayed</option>
            <option value="In transit">In transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Freight Forwarder Filter */}
        <div className="filter-group">
          <label htmlFor="ff-filter">Freight Forwarder</label>
          <select
            id="ff-filter"
            value={filters.freightForwarder}
            onChange={(e) => handleFilterChange('freightForwarder', e.target.value)}
            className="filter-select"
          >
            <option value="">All Forwarders</option>
            <option value="DHL">DHL</option>
            <option value="Geodis">Geodis</option>
            <option value="Yusen">Yusen</option>
          </select>
        </div>

        {/* Mode of Transport Filter */}
        <div className="filter-group">
          <label htmlFor="transport-filter">Mode of Transport</label>
          <select
            id="transport-filter"
            value={filters.modeOfTransport}
            onChange={(e) => handleFilterChange('modeOfTransport', e.target.value)}
            className="filter-select"
          >
            <option value="">All Modes</option>
            <option value="Air">Air</option>
            <option value="Road">Road</option>
            <option value="Sea">Sea</option>
          </select>
        </div>

        {/* Packaging Type Filter */}
        <div className="filter-group">
          <label htmlFor="packaging-filter">Packaging Type</label>
          <select
            id="packaging-filter"
            value={filters.packagingType}
            onChange={(e) => handleFilterChange('packagingType', e.target.value)}
            className="filter-select"
          >
            <option value="">All Packaging</option>
            <option value="CryoBox">CryoBox</option>
            <option value="Pallet Shipper">Pallet Shipper</option>
            <option value="Insulated Cooler">Insulated Cooler</option>
            <option value="BioTherm Case">BioTherm Case</option>
            <option value="Phase Change Container">Phase Change Container</option>
          </select>
        </div>

        {/* Alarms Filter */}
        <div className="filter-group">
          <label htmlFor="alarms-filter">Alarms</label>
          <select
            id="alarms-filter"
            value={filters.alarms}
            onChange={(e) => handleFilterChange('alarms', e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Root Cause Analysis Filter */}
        <div className="filter-group">
          <label htmlFor="rca-filter">Root Cause Analysis</label>
          <select
            id="rca-filter"
            value={filters.rootCauseAnalysis}
            onChange={(e) => handleFilterChange('rootCauseAnalysis', e.target.value)}
            className="filter-select"
          >
            <option value="">All RCA</option>
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
