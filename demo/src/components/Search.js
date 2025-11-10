import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Components.css';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const searchTypes = [
    { value: 'all', label: 'All' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'owners', label: 'Owners' },
    { value: 'service_records', label: 'Service Records' },
    { value: 'warranties', label: 'Warranties' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'inspections', label: 'Inspections' },
    { value: 'accidents', label: 'Accidents' },
    { value: 'recalls', label: 'Recalls' }
  ];

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not initialized.');
      }

      const searchResults = [];

      if (searchType === 'all' || searchType === 'vehicles') {
        const { data, error } = await supabase
          .from('vehicle')
          .select(`
            *,
            vehicle_model:vehicle_model_id (
              name,
              manufacturer:manufacturer_id (name)
            ),
            owner:owner_id (first_name, last_name)
          `)
          .or(`vin.ilike.%${searchTerm}%,license_plate.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Vehicle',
              id: item.id,
              title: `${item.vehicle_model?.manufacturer?.name} ${item.vehicle_model?.name} ${item.year}`,
              subtitle: `VIN: ${item.vin}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'owners') {
        const { data, error } = await supabase
          .from('owner')
          .select('*')
          .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Owner',
              id: item.id,
              title: `${item.first_name} ${item.last_name}`,
              subtitle: item.email || item.phone || 'N/A',
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'service_records') {
        const { data, error } = await supabase
          .from('service_record')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .ilike('description', `%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Service Record',
              id: item.id,
              title: `Service for ${item.vehicle?.vin || 'N/A'}`,
              subtitle: `${item.service_type} - ${new Date(item.service_date).toLocaleDateString()}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'warranties') {
        const { data, error } = await supabase
          .from('warranty')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .ilike('provider_name', `%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Warranty',
              id: item.id,
              title: `${item.warranty_type} Warranty`,
              subtitle: `Vehicle: ${item.vehicle?.vin || 'N/A'}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'insurance') {
        const { data, error } = await supabase
          .from('insurance_policy')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .or(`insurance_company.ilike.%${searchTerm}%,policy_number.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Insurance',
              id: item.id,
              title: `${item.insurance_company} - ${item.policy_number}`,
              subtitle: `Vehicle: ${item.vehicle?.vin || 'N/A'}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'recalls') {
        const { data, error } = await supabase
          .from('recall')
          .select(`
            *,
            vehicle_model:vehicle_model_id (name),
            manufacturer:manufacturer_id (name)
          `)
          .or(`recall_number.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Recall',
              id: item.id,
              title: item.title,
              subtitle: `Recall #${item.recall_number}`,
              data: item
            });
          });
        }
      }

      setResults(searchResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchType]);

  const handleResultClick = (result) => {
    const routes = {
      'Vehicle': '/vehicles',
      'Owner': '/owners',
      'Service Record': '/service-records',
      'Warranty': '/warranties',
      'Insurance': '/insurance',
      'Recall': '/recalls'
    };
    const route = routes[result.type];
    if (route) {
      navigate(route);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Advanced Search</h1>
        <p>Search across all database entities</p>
      </div>

      <div className="glass-container">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px'
                }}
              />
            </div>
            <div style={{ minWidth: '150px' }}>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px'
                }}
              >
                {searchTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading">Searching...</div>
        )}

        {error && (
          <div className="error">Error: {error}</div>
        )}

        {!loading && !error && (
          <div>
            {results.length === 0 && searchTerm ? (
              <div className="empty-state">
                <div className="empty-state-text">No results found</div>
              </div>
            ) : results.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {results.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(result)}
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span className={`badge ${result.type === 'Vehicle' ? 'badge-active' : result.type === 'Owner' ? 'badge-maintenance' : 'badge-repair'}`}>
                            {result.type}
                          </span>
                          <strong style={{ fontSize: '16px' }}>{result.title}</strong>
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.7, marginLeft: '8px' }}>
                          {result.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-text">Enter a search term to begin</div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Search;
