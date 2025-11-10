import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Warranties() {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('warranty')
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
        .order('end_date', { ascending: true });

      if (error) throw error;
      setWarranties(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWarrantyTypeBadge = (type) => {
    const badges = {
      factory: 'badge-active',
      extended: 'badge-maintenance',
      third_party: 'badge-repair'
    };
    return badges[type] || 'badge';
  };

  const isExpiringSoon = (endDate) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const isExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading warranties...</div>
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
        <h1>Warranties</h1>
        <p>Manage and track vehicle warranties</p>
      </div>

      <div className="glass-container">
        {warranties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No warranties found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Warranty Type</th>
                  <th>Provider</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Mileage Limit</th>
                  <th>Claims</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {warranties.map((warranty) => (
                  <tr key={warranty.id} className="clickable-row">
                    <td>
                      <strong>{warranty.vehicle?.vin}</strong>
                      <br />
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {warranty.vehicle?.vehicle_model?.manufacturer?.name} {warranty.vehicle?.vehicle_model?.name} {warranty.vehicle?.year}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getWarrantyTypeBadge(warranty.warranty_type)}`}>
                        {warranty.warranty_type}
                      </span>
                    </td>
                    <td>{warranty.provider_name || 'N/A'}</td>
                    <td>{warranty.start_date ? new Date(warranty.start_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {warranty.end_date ? new Date(warranty.end_date).toLocaleDateString() : 'N/A'}
                      {isExpiringSoon(warranty.end_date) && (
                        <span style={{ color: '#ffa500', marginLeft: '8px' }}>⚠ Expiring Soon</span>
                      )}
                      {isExpired(warranty.end_date) && (
                        <span style={{ color: '#ff4444', marginLeft: '8px' }}>✗ Expired</span>
                      )}
                    </td>
                    <td>{warranty.mileage_limit ? warranty.mileage_limit.toLocaleString() + ' miles' : 'N/A'}</td>
                    <td>{warranty.claim_count || 0}</td>
                    <td>
                      {isExpired(warranty.end_date) ? (
                        <span className="badge badge-sold">Expired</span>
                      ) : isExpiringSoon(warranty.end_date) ? (
                        <span className="badge badge-repair">Expiring Soon</span>
                      ) : (
                        <span className="badge badge-active">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Warranties;

