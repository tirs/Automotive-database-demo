import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import InspectionDetail from './InspectionDetail';
import './Components.css';

function Inspections() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('inspection')
        .select(`
          *,
          vehicle:vehicle_id (
            vin,
            year,
            vehicle_model:vehicle_model_id (
              name,
              manufacturer:manufacturer_id (
                name
              )
            )
          )
        `)
        .order('inspection_date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectionUpdate = () => {
    fetchInspections();
    setSelectedInspection(null);
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const expiration = new Date(expirationDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiration - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading inspections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Vehicle Inspections</h1>
        <p>Track state inspections, emissions tests, and safety inspections</p>
      </div>

      <div className="glass-container">
        {inspections.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No inspections found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Inspection Type</th>
                  <th>Inspection Date</th>
                  <th>Expiration Date</th>
                  <th>Mileage</th>
                  <th>Inspector</th>
                  <th>Station</th>
                  <th>Result</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((inspection) => (
                  <tr 
                    key={inspection.id} 
                    onClick={() => setSelectedInspection(inspection)}
                    className="clickable-row"
                  >
                    <td>
                      <strong>{inspection.vehicle?.vin}</strong>
                      <br />
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {inspection.vehicle?.vehicle_model?.manufacturer?.name} {inspection.vehicle?.vehicle_model?.name} {inspection.vehicle?.year}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-inspection">
                        {inspection.inspection_type}
                      </span>
                    </td>
                    <td>{inspection.inspection_date ? new Date(inspection.inspection_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {inspection.expiration_date ? new Date(inspection.expiration_date).toLocaleDateString() : 'N/A'}
                      {isExpiringSoon(inspection.expiration_date) && (
                        <span style={{ color: 'rgba(255, 165, 0, 0.9)', marginLeft: '8px' }}>⚠ Expiring Soon</span>
                      )}
                      {isExpired(inspection.expiration_date) && (
                        <span style={{ color: 'rgba(255, 68, 68, 0.9)', marginLeft: '8px' }}>✗ Expired</span>
                      )}
                    </td>
                    <td>{inspection.mileage_at_inspection ? inspection.mileage_at_inspection.toLocaleString() : 'N/A'}</td>
                    <td>{inspection.inspector_name || 'N/A'}</td>
                    <td>{inspection.inspection_station || 'N/A'}</td>
                    <td>
                      {inspection.passed ? (
                        <span className="badge badge-active">Passed</span>
                      ) : (
                        <span className="badge badge-sold">Failed</span>
                      )}
                    </td>
                    <td>
                      {isExpired(inspection.expiration_date) ? (
                        <span className="badge badge-sold">Expired</span>
                      ) : isExpiringSoon(inspection.expiration_date) ? (
                        <span className="badge badge-repair">Expiring Soon</span>
                      ) : (
                        <span className="badge badge-active">Valid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedInspection && (
        <InspectionDetail 
          inspection={selectedInspection} 
          onClose={() => setSelectedInspection(null)}
          onUpdate={handleInspectionUpdate}
        />
      )}
    </>
  );
}

export default Inspections;

