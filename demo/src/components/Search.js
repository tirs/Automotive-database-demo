import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Components.css';
import './DetailModal.css';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    { value: 'financing', label: 'Financing' },
    { value: 'recalls', label: 'Recalls' },
    { value: 'fuel_records', label: 'Fuel Records' },
    { value: 'documents', label: 'Documents' },
    { value: 'appraisals', label: 'Appraisals' }
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
        const existingIds = new Set();
        
        // 1. Search vehicles by direct fields (VIN, license plate, color, notes)
        const { data: directVehicles, error: directError } = await supabase
          .from('vehicle')
          .select(`
            *,
            vehicle_model:vehicle_model_id (
              name,
              manufacturer:manufacturer_id (name)
            ),
            owner:owner_id (first_name, last_name)
          `)
          .or(`vin.ilike.%${searchTerm}%,license_plate.ilike.%${searchTerm}%,color.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
          .limit(20);

        if (!directError && directVehicles) {
          directVehicles.forEach(item => {
            existingIds.add(item.id);
            const makeModel = `${item.vehicle_model?.manufacturer?.name || ''} ${item.vehicle_model?.name || ''}`.trim();
            searchResults.push({
              type: 'Vehicle',
              id: item.id,
              title: `${makeModel} ${item.year || ''}`.trim() || 'Unknown Vehicle',
              subtitle: `VIN: ${item.vin || 'N/A'} | License: ${item.license_plate || 'N/A'}`,
              data: item
            });
          });
        }

        // 2. Search manufacturers by name, then find their vehicles
        const { data: manufacturers, error: mfgError } = await supabase
          .from('manufacturer')
          .select('id, name')
          .ilike('name', `%${searchTerm}%`)
          .limit(10);

        if (!mfgError && manufacturers && manufacturers.length > 0) {
          const manufacturerIds = manufacturers.map(m => m.id);
          
          // Get vehicle models for these manufacturers
          const { data: models, error: modelError } = await supabase
            .from('vehicle_model')
            .select('id')
            .in('manufacturer_id', manufacturerIds)
            .limit(50);

          if (!modelError && models && models.length > 0) {
            const modelIds = models.map(m => m.id);
            
            // Get vehicles with these models
            const { data: vehiclesByMfg, error: vbmError } = await supabase
              .from('vehicle')
              .select(`
                *,
                vehicle_model:vehicle_model_id (
                  name,
                  manufacturer:manufacturer_id (name)
                ),
                owner:owner_id (first_name, last_name)
              `)
              .in('vehicle_model_id', modelIds)
              .limit(20);

            if (!vbmError && vehiclesByMfg) {
              vehiclesByMfg.forEach(item => {
                if (!existingIds.has(item.id)) {
                  existingIds.add(item.id);
                  const makeModel = `${item.vehicle_model?.manufacturer?.name || ''} ${item.vehicle_model?.name || ''}`.trim();
                  searchResults.push({
                    type: 'Vehicle',
                    id: item.id,
                    title: `${makeModel} ${item.year || ''}`.trim() || 'Unknown Vehicle',
                    subtitle: `VIN: ${item.vin || 'N/A'} | License: ${item.license_plate || 'N/A'}`,
                    data: item
                  });
                }
              });
            }
          }
        }

        // 3. Search vehicle models by name, then find their vehicles
        const { data: modelsByName, error: modelNameError } = await supabase
          .from('vehicle_model')
          .select('id, name, manufacturer:manufacturer_id (name)')
          .ilike('name', `%${searchTerm}%`)
          .limit(20);

        if (!modelNameError && modelsByName && modelsByName.length > 0) {
          const modelIdsByName = modelsByName.map(m => m.id);
          
          const { data: vehiclesByModel, error: vbmError2 } = await supabase
            .from('vehicle')
            .select(`
              *,
              vehicle_model:vehicle_model_id (
                name,
                manufacturer:manufacturer_id (name)
              ),
              owner:owner_id (first_name, last_name)
            `)
            .in('vehicle_model_id', modelIdsByName)
            .limit(20);

          if (!vbmError2 && vehiclesByModel) {
            vehiclesByModel.forEach(item => {
              if (!existingIds.has(item.id)) {
                existingIds.add(item.id);
                const makeModel = `${item.vehicle_model?.manufacturer?.name || ''} ${item.vehicle_model?.name || ''}`.trim();
                searchResults.push({
                  type: 'Vehicle',
                  id: item.id,
                  title: `${makeModel} ${item.year || ''}`.trim() || 'Unknown Vehicle',
                  subtitle: `VIN: ${item.vin || 'N/A'} | License: ${item.license_plate || 'N/A'}`,
                  data: item
                });
              }
            });
          }
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
          .or(`description.ilike.%${searchTerm}%,service_type.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Service Record',
              id: item.id,
              title: `${item.service_type} - ${item.vehicle?.vin || 'N/A'}`,
              subtitle: `${new Date(item.service_date).toLocaleDateString()} - ${item.description || 'No description'}`,
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
          .or(`provider_name.ilike.%${searchTerm}%,warranty_type.ilike.%${searchTerm}%,coverage_details.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Warranty',
              id: item.id,
              title: `${item.warranty_type} - ${item.provider_name}`,
              subtitle: `Vehicle: ${item.vehicle?.vin || 'N/A'} | Expires: ${new Date(item.expiry_date).toLocaleDateString()}`,
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
          .or(`insurance_company.ilike.%${searchTerm}%,policy_number.ilike.%${searchTerm}%,coverage_type.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Insurance',
              id: item.id,
              title: `${item.insurance_company} - ${item.policy_number || 'N/A'}`,
              subtitle: `Vehicle: ${item.vehicle?.vin || 'N/A'} | Coverage: ${item.coverage_type || 'N/A'}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'inspections') {
        const { data, error } = await supabase
          .from('inspection')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .or(`inspection_type.ilike.%${searchTerm}%,inspector_name.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%,result.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Inspection',
              id: item.id,
              title: `${item.inspection_type} - ${item.vehicle?.vin || 'N/A'}`,
              subtitle: `${new Date(item.inspection_date).toLocaleDateString()} | Result: ${item.result || 'N/A'}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'accidents') {
        const { data, error } = await supabase
          .from('accident')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .or(`description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,report_number.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Accident',
              id: item.id,
              title: `Accident - ${item.vehicle?.vin || 'N/A'}`,
              subtitle: `${new Date(item.accident_date).toLocaleDateString()} | ${item.location || 'Location N/A'}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'financing') {
        const { data, error } = await supabase
          .from('financing')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .or(`lender_name.ilike.%${searchTerm}%,loan_number.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Financing',
              id: item.id,
              title: `${item.lender_name} - ${item.vehicle?.vin || 'N/A'}`,
              subtitle: `Loan #${item.loan_number || 'N/A'} | Amount: $${item.loan_amount?.toLocaleString() || '0'}`,
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
          .or(`recall_number.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Recall',
              id: item.id,
              title: item.title,
              subtitle: `Recall #${item.recall_number} | ${item.manufacturer?.name || ''} ${item.vehicle_model?.name || ''}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'fuel_records') {
        const { data, error } = await supabase
          .from('fuel_record')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .or(`fuel_type.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Fuel Record',
              id: item.id,
              title: `Fuel Record - ${item.vehicle?.vin || 'N/A'}`,
              subtitle: `${new Date(item.fuel_date).toLocaleDateString()} | ${item.gallons || 0} gallons @ $${item.price_per_gallon || 0}/gal`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'documents') {
        const { data, error } = await supabase
          .from('vehicle_document')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .or(`document_type.ilike.%${searchTerm}%,file_name.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Document',
              id: item.id,
              title: `${item.document_type} - ${item.file_name || 'Unnamed'}`,
              subtitle: `Vehicle: ${item.vehicle?.vin || 'N/A'} | ${new Date(item.uploaded_at).toLocaleDateString()}`,
              data: item
            });
          });
        }
      }

      if (searchType === 'all' || searchType === 'appraisals') {
        const { data, error } = await supabase
          .from('vehicle_appraisal')
          .select(`
            *,
            vehicle:vehicle_id (vin)
          `)
          .or(`appraiser_name.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%,condition_rating.ilike.%${searchTerm}%`)
          .limit(10);

        if (!error && data) {
          data.forEach(item => {
            searchResults.push({
              type: 'Appraisal',
              id: item.id,
              title: `Appraisal - ${item.vehicle?.vin || 'N/A'}`,
              subtitle: `${new Date(item.appraisal_date).toLocaleDateString()} | Value: $${item.appraised_value?.toLocaleString() || '0'} | Condition: ${item.condition_rating || 'N/A'}`,
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

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (term) => {
    if (!term.trim() || term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const suggestionsList = [];

      // Get manufacturer suggestions
      const { data: manufacturers } = await supabase
        .from('manufacturer')
        .select('name')
        .ilike('name', `%${term}%`)
        .limit(5);

      if (manufacturers) {
        manufacturers.forEach(m => {
          suggestionsList.push({ type: 'Manufacturer', text: m.name, category: 'vehicles' });
        });
      }

      // Get model suggestions
      const { data: models } = await supabase
        .from('vehicle_model')
        .select('name, manufacturer:manufacturer_id (name)')
        .ilike('name', `%${term}%`)
        .limit(5);

      if (models) {
        models.forEach(m => {
          suggestionsList.push({ 
            type: 'Model', 
            text: `${m.manufacturer?.name || ''} ${m.name}`.trim(), 
            category: 'vehicles' 
          });
        });
      }

      // Get owner name suggestions
      const { data: owners } = await supabase
        .from('owner')
        .select('first_name, last_name')
        .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%`)
        .limit(5);

      if (owners) {
        owners.forEach(o => {
          suggestionsList.push({ 
            type: 'Owner', 
            text: `${o.first_name} ${o.last_name}`, 
            category: 'owners' 
          });
        });
      }

      // Get VIN suggestions
      if (term.length >= 3) {
        const { data: vehicles } = await supabase
          .from('vehicle')
          .select('vin, vehicle_model:vehicle_model_id (name, manufacturer:manufacturer_id (name))')
          .ilike('vin', `%${term}%`)
          .limit(3);

        if (vehicles) {
          vehicles.forEach(v => {
            const makeModel = `${v.vehicle_model?.manufacturer?.name || ''} ${v.vehicle_model?.name || ''}`.trim();
            suggestionsList.push({ 
              type: 'VIN', 
              text: `${makeModel} - ${v.vin}`, 
              category: 'vehicles' 
            });
          });
        }
      }

      setSuggestions(suggestionsList.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(suggestionsList.length > 0);
    } catch (err) {
      // Silently fail for suggestions
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
      fetchSuggestions(searchTerm);
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
      'Inspection': '/inspections',
      'Accident': '/accidents',
      'Financing': '/financing',
      'Recall': '/recalls',
      'Fuel Record': '/fuel-records',
      'Document': '/documents',
      'Appraisal': '/appraisals'
    };
    const route = routes[result.type];
    if (route) {
      // Navigate to the page and pass the item ID via state
      navigate(route, { state: { selectedId: result.id } });
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
            <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search vehicles, owners, VINs, manufacturers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
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
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: 'rgba(20, 27, 45, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        const text = suggestion.text.split(' - ')[0];
                        setSearchTerm(text);
                        setShowSuggestions(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                        transition: 'background 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        {suggestion.type}
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{suggestion.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ minWidth: '150px' }}>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="detail-select"
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
              <div>
                <div style={{ marginBottom: '16px', fontSize: '14px', opacity: 0.7 }}>
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
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
