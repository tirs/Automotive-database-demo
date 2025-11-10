import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';
import './Search.css';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all'); // all, vehicles, owners, service_records
  const [results, setResults] = useState({
    vehicles: [],
    owners: [],
    serviceRecords: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    vehicleStatus: '',
    ownerType: '',
    serviceType: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const debounceTimer = setTimeout(() => {
        performSearch();
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setResults({ vehicles: [], owners: [], serviceRecords: [] });
    }
  }, [searchQuery, searchType, filters]);

  const performSearch = async () => {
    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchPromises = [];

      // Search Vehicles
      if (searchType === 'all' || searchType === 'vehicles') {
        let vehicleQuery = supabase
          .from('vehicle')
          .select(`
            *,
            vehicle_model:vehicle_model_id (
              name,
              manufacturer:manufacturer_id (
                name
              )
            ),
            owner:owner_id (
              first_name,
              last_name
            )
          `);

        // Apply search query
        if (searchQuery.trim()) {
          vehicleQuery = vehicleQuery.or(`vin.ilike.%${searchQuery}%,license_plate.ilike.%${searchQuery}%,color.ilike.%${searchQuery}%`);
        }

        // Apply filters
        if (filters.vehicleStatus) {
          vehicleQuery = vehicleQuery.eq('status', filters.vehicleStatus);
        }

        searchPromises.push(vehicleQuery);
      }

      // Search Owners
      if (searchType === 'all' || searchType === 'owners') {
        let ownerQuery = supabase
          .from('owner')
          .select('*');

        if (searchQuery.trim()) {
          ownerQuery = ownerQuery.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
        }

        if (filters.ownerType) {
          ownerQuery = ownerQuery.eq('owner_type', filters.ownerType);
        }

        searchPromises.push(ownerQuery);
      }

      // Search Service Records
      if (searchType === 'all' || searchType === 'service_records') {
        let serviceQuery = supabase
          .from('service_record')
          .select(`
            *,
            vehicle:vehicle_id (
              vin,
              vehicle_model:vehicle_model_id (
                name,
                manufacturer:manufacturer_id (
                  name
                )
              )
            ),
            service_center:service_center_id (
              name
            ),
            technician:technician_id (
              first_name,
              last_name
            )
          `);

        if (searchQuery.trim()) {
          serviceQuery = serviceQuery.ilike('description', `%${searchQuery}%`);
        }

        if (filters.serviceType) {
          serviceQuery = serviceQuery.eq('service_type', filters.serviceType);
        }

        if (filters.dateRange.start) {
          serviceQuery = serviceQuery.gte('service_date', filters.dateRange.start);
        }

        if (filters.dateRange.end) {
          serviceQuery = serviceQuery.lte('service_date', filters.dateRange.end);
        }

        searchPromises.push(serviceQuery);
      }

      const results = await Promise.all(searchPromises);

      const newResults = {
        vehicles: [],
        owners: [],
        serviceRecords: []
      };

      let resultIndex = 0;

      if (searchType === 'all' || searchType === 'vehicles') {
        if (results[resultIndex]?.data) {
          newResults.vehicles = results[resultIndex].data;
        }
        resultIndex++;
      }

      if (searchType === 'all' || searchType === 'owners') {
        if (results[resultIndex]?.data) {
          newResults.owners = results[resultIndex].data;
        }
        resultIndex++;
      }

      if (searchType === 'all' || searchType === 'service_records') {
        if (results[resultIndex]?.data) {
          newResults.serviceRecords = results[resultIndex].data;
        }
      }

      setResults(newResults);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.toString().split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  const totalResults = results.vehicles.length + results.owners.length + results.serviceRecords.length;

  return (
    <>
      <div className="page-header">
        <h1>Search</h1>
        <p>Search across vehicles, owners, and service records</p>
      </div>

      <div className="glass-container">
        <div className="search-container">
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="Search by VIN, name, email, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <select
              className="search-type-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="vehicles">Vehicles</option>
              <option value="owners">Owners</option>
              <option value="service_records">Service Records</option>
            </select>
          </div>

          {/* Advanced Filters */}
          <div className="search-filters">
            <div className="filter-group">
              <label>Vehicle Status:</label>
              <select
                value={filters.vehicleStatus}
                onChange={(e) => setFilters({ ...filters, vehicleStatus: e.target.value })}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="totaled">Totaled</option>
                <option value="stolen">Stolen</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Owner Type:</label>
              <select
                value={filters.ownerType}
                onChange={(e) => setFilters({ ...filters, ownerType: e.target.value })}
              >
                <option value="">All</option>
                <option value="individual">Individual</option>
                <option value="dealership">Dealership</option>
                <option value="fleet">Fleet</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Service Type:</label>
              <select
                value={filters.serviceType}
                onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
              >
                <option value="">All</option>
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="inspection">Inspection</option>
                <option value="recall">Recall</option>
                <option value="warranty">Warranty</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date From:</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
              />
            </div>

            <div className="filter-group">
              <label>Date To:</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
              />
            </div>

            <button
              className="clear-filters-btn"
              onClick={() => setFilters({
                vehicleStatus: '',
                ownerType: '',
                serviceType: '',
                dateRange: { start: '', end: '' }
              })}
            >
              Clear Filters
            </button>
          </div>

          {loading && (
            <div className="search-loading">Searching...</div>
          )}

          {error && (
            <div className="error">Error: {error}</div>
          )}

          {!loading && !error && searchQuery.trim().length >= 2 && (
            <div className="search-results-summary">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {!loading && !error && searchQuery.trim().length >= 2 && (
        <div className="search-results">
          {/* Vehicle Results */}
          {results.vehicles.length > 0 && (
            <div className="glass-container">
              <h2 className="section-title">Vehicles ({results.vehicles.length})</h2>
              <div className="modern-table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>VIN</th>
                      <th>Year</th>
                      <th>Manufacturer</th>
                      <th>Model</th>
                      <th>Color</th>
                      <th>Owner</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="clickable-row">
                        <td>{highlightText(vehicle.vin, searchQuery)}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.vehicle_model?.manufacturer?.name || 'N/A'}</td>
                        <td>{vehicle.vehicle_model?.name || 'N/A'}</td>
                        <td>{highlightText(vehicle.color || 'N/A', searchQuery)}</td>
                        <td>
                          {vehicle.owner?.first_name} {vehicle.owner?.last_name}
                        </td>
                        <td>
                          <span className={`badge badge-${vehicle.status}`}>
                            {vehicle.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Owner Results */}
          {results.owners.length > 0 && (
            <div className="glass-container">
              <h2 className="section-title">Owners ({results.owners.length})</h2>
              <div className="modern-table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.owners.map((owner) => (
                      <tr key={owner.id} className="clickable-row">
                        <td>
                          {highlightText(`${owner.first_name} ${owner.last_name}`, searchQuery)}
                        </td>
                        <td>{highlightText(owner.email || 'N/A', searchQuery)}</td>
                        <td>{highlightText(owner.phone || 'N/A', searchQuery)}</td>
                        <td>{owner.city || 'N/A'}</td>
                        <td>{owner.state || 'N/A'}</td>
                        <td>
                          <span className="badge badge-active">{owner.owner_type}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Service Record Results */}
          {results.serviceRecords.length > 0 && (
            <div className="glass-container">
              <h2 className="section-title">Service Records ({results.serviceRecords.length})</h2>
              <div className="modern-table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Vehicle</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Service Center</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.serviceRecords.map((record) => (
                      <tr key={record.id} className="clickable-row">
                        <td>{new Date(record.service_date).toLocaleDateString()}</td>
                        <td>
                          {record.vehicle?.vin} - {record.vehicle?.vehicle_model?.manufacturer?.name} {record.vehicle?.vehicle_model?.name}
                        </td>
                        <td>
                          <span className={`badge badge-${record.service_type}`}>
                            {record.service_type}
                          </span>
                        </td>
                        <td>{highlightText(record.description || 'N/A', searchQuery)}</td>
                        <td>{record.service_center?.name || 'N/A'}</td>
                        <td>
                          <strong>${parseFloat(record.total_cost || 0).toFixed(2)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Results */}
          {totalResults === 0 && (
            <div className="glass-container">
              <div className="empty-state">
                <div className="empty-state-text">
                  No results found for "{searchQuery}". Try different search terms or adjust your filters.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!loading && searchQuery.trim().length < 2 && (
        <div className="glass-container">
          <div className="empty-state">
            <div className="empty-state-text">
              <p>Start typing to search across vehicles, owners, and service records.</p>
              <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.7 }}>
                Minimum 2 characters required. Use filters to narrow down results.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Search;

