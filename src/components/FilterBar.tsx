import { Search, X } from 'lucide-react';
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

  // Get active filters for display as bubbles
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> = [];
    
    if (filters.search) activeFilters.push({ key: 'search', label: 'Search', value: filters.search });
    if (filters.origin) activeFilters.push({ key: 'origin', label: 'Origin', value: filters.origin });
    if (filters.destination) activeFilters.push({ key: 'destination', label: 'Destination', value: filters.destination });
    if (filters.status) activeFilters.push({ key: 'status', label: 'Status', value: filters.status });
    if (filters.freightForwarder) activeFilters.push({ key: 'freightForwarder', label: 'Freight Forwarder', value: filters.freightForwarder });
    if (filters.modeOfTransport) activeFilters.push({ key: 'modeOfTransport', label: 'Mode of Transport', value: filters.modeOfTransport });
    if (filters.packagingType) activeFilters.push({ key: 'packagingType', label: 'Packaging Type', value: filters.packagingType });
    if (filters.alarms) activeFilters.push({ key: 'alarms', label: 'Alarms', value: filters.alarms });
    if (filters.rootCauseAnalysis) activeFilters.push({ key: 'rootCauseAnalysis', label: 'Root Cause Analysis', value: filters.rootCauseAnalysis });
    
    return activeFilters;
  };

  // Remove individual filter
  const removeFilter = (filterKey: string) => {
    handleFilterChange(filterKey as keyof FilterState, '');
  };

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

      {/* Active Filter Bubbles */}
      {hasActiveFilters && (
        <div className="active-filters">
          <div className="active-filters-row">
            {getActiveFilters().map((filter) => (
              <div key={filter.key} className="filter-bubble">
                <span className="filter-bubble-label">{filter.label}:</span>
                <span className="filter-bubble-value">{filter.value}</span>
                <button 
                  onClick={() => removeFilter(filter.key)}
                  className="filter-bubble-remove"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button onClick={clearAllFilters} className="remove-all-filters-btn">
              Remove All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
