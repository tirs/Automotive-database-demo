import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Insurance() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('insurance_policy')
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
      setPolicies(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isExpiringSoon = (endDate) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading insurance policies...</div>
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
        <h1>Insurance Policies</h1>
        <p>Manage and track vehicle insurance coverage</p>
      </div>

      <div className="glass-container">
        {policies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No insurance policies found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Insurance Company</th>
                  <th>Policy Number</th>
                  <th>Policy Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Premium</th>
                  <th>Deductible</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id} className="clickable-row">
                    <td>
                      <strong>{policy.vehicle?.vin}</strong>
                      <br />
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {policy.vehicle?.vehicle_model?.manufacturer?.name} {policy.vehicle?.vehicle_model?.name} {policy.vehicle?.year}
                      </span>
                    </td>
                    <td>{policy.insurance_company}</td>
                    <td>{policy.policy_number}</td>
                    <td>
                      <span className="badge badge-maintenance">
                        {policy.policy_type?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td>{policy.start_date ? new Date(policy.start_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {policy.end_date ? new Date(policy.end_date).toLocaleDateString() : 'N/A'}
                      {isExpiringSoon(policy.end_date) && (
                        <span style={{ color: '#ffa500', marginLeft: '8px' }}>⚠ Expiring Soon</span>
                      )}
                      {isExpired(policy.end_date) && (
                        <span style={{ color: '#ff4444', marginLeft: '8px' }}>✗ Expired</span>
                      )}
                    </td>
                    <td>${policy.premium_amount ? parseFloat(policy.premium_amount).toFixed(2) : '0.00'}</td>
                    <td>${policy.deductible ? parseFloat(policy.deductible).toFixed(2) : '0.00'}</td>
                    <td>
                      {isExpired(policy.end_date) ? (
                        <span className="badge badge-sold">Expired</span>
                      ) : isExpiringSoon(policy.end_date) ? (
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

export default Insurance;

