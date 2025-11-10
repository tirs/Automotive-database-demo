import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Recalls() {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecalls();
  }, []);

  const fetchRecalls = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('recall')
        .select(`
          *,
          vehicle_model:vehicle_model_id (
            name,
            manufacturer:manufacturer_id (
              name
            )
          ),
          manufacturer:manufacturer_id (
            name
          )
        `)
        .order('recall_date', { ascending: false });

      if (error) throw error;
      setRecalls(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: 'badge-maintenance',
      medium: 'badge-repair',
      high: 'badge-sold',
      critical: 'badge-totaled'
    };
    return badges[severity] || 'badge';
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge-repair',
      resolved: 'badge-maintenance',
      closed: 'badge-sold'
    };
    return badges[status] || 'badge';
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading recalls...</div>
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
        <h1>Recalls & Safety Notices</h1>
        <p>Track manufacturer recalls and safety notices</p>
      </div>

      <div className="glass-container">
        {recalls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No recalls found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Recall Number</th>
                  <th>Manufacturer</th>
                  <th>Model</th>
                  <th>Title</th>
                  <th>Recall Date</th>
                  <th>Affected Years</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recalls.map((recall) => (
                  <tr key={recall.id} className="clickable-row">
                    <td><strong>{recall.recall_number}</strong></td>
                    <td>{recall.manufacturer?.name || recall.vehicle_model?.manufacturer?.name || 'N/A'}</td>
                    <td>{recall.vehicle_model?.name || 'All Models'}</td>
                    <td>{recall.title}</td>
                    <td>{recall.recall_date ? new Date(recall.recall_date).toLocaleDateString() : 'N/A'}</td>
                    <td>{recall.affected_year_range || 'N/A'}</td>
                    <td>
                      <span className={`badge ${getSeverityBadge(recall.severity)}`}>
                        {recall.severity || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(recall.status)}`}>
                        {recall.status || 'N/A'}
                      </span>
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

export default Recalls;

