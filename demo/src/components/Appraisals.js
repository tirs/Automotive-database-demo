import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Appraisals() {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const fetchAppraisals = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('vehicle_appraisal')
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
        .order('appraisal_date', { ascending: false });

      if (error) throw error;
      setAppraisals(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getConditionBadge = (condition) => {
    const badges = {
      excellent: 'badge-active',
      good: 'badge-maintenance',
      fair: 'badge-repair',
      poor: 'badge-sold'
    };
    return badges[condition] || 'badge';
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading appraisals...</div>
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
        <h1>Vehicle Appraisals</h1>
        <p>Track vehicle appraisals and valuations over time</p>
      </div>

      <div className="glass-container">
        {appraisals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No appraisals found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Appraisal Date</th>
                  <th>Appraised Value</th>
                  <th>Appraisal Type</th>
                  <th>Appraiser</th>
                  <th>Company</th>
                  <th>Condition</th>
                  <th>Mileage</th>
                </tr>
              </thead>
              <tbody>
                {appraisals.map((appraisal) => (
                  <tr key={appraisal.id} className="clickable-row">
                    <td>
                      <strong>{appraisal.vehicle?.vin}</strong>
                      <br />
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {appraisal.vehicle?.vehicle_model?.manufacturer?.name} {appraisal.vehicle?.vehicle_model?.name} {appraisal.vehicle?.year}
                      </span>
                    </td>
                    <td>{appraisal.appraisal_date ? new Date(appraisal.appraisal_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <strong style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 1)' }}>
                        ${appraisal.appraised_value ? parseFloat(appraisal.appraised_value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-maintenance">
                        {appraisal.appraisal_type?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td>{appraisal.appraiser_name || 'N/A'}</td>
                    <td>{appraisal.appraiser_company || 'N/A'}</td>
                    <td>
                      <span className={`badge ${getConditionBadge(appraisal.condition_rating)}`}>
                        {appraisal.condition_rating || 'N/A'}
                      </span>
                    </td>
                    <td>{appraisal.mileage_at_appraisal ? appraisal.mileage_at_appraisal.toLocaleString() : 'N/A'}</td>
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

export default Appraisals;

