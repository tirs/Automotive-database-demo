import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Accidents() {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccidents();
  }, []);

  const fetchAccidents = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('accident')
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
        .order('accident_date', { ascending: false });

      if (error) throw error;
      setAccidents(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      minor: 'badge-maintenance',
      moderate: 'badge-repair',
      severe: 'badge-sold',
      total_loss: 'badge-totaled'
    };
    return badges[severity] || 'badge';
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading accidents...</div>
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
        <h1>Accidents & Damage</h1>
        <p>Track vehicle accidents and damage history</p>
      </div>

      <div className="glass-container">
        {accidents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No accidents found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Accident Date</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Other Party</th>
                  <th>Damage Estimate</th>
                  <th>Police Report</th>
                </tr>
              </thead>
              <tbody>
                {accidents.map((accident) => (
                  <tr key={accident.id} className="clickable-row">
                    <td>
                      <strong>{accident.vehicle?.vin}</strong>
                      <br />
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {accident.vehicle?.vehicle_model?.manufacturer?.name} {accident.vehicle?.vehicle_model?.name} {accident.vehicle?.year}
                      </span>
                    </td>
                    <td>
                      {accident.accident_date ? new Date(accident.accident_date).toLocaleDateString() : 'N/A'}
                      <br />
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {accident.accident_date ? new Date(accident.accident_date).toLocaleTimeString() : ''}
                      </span>
                    </td>
                    <td>{accident.location || 'N/A'}</td>
                    <td>
                      <span className="badge badge-repair">
                        {accident.accident_type?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getSeverityBadge(accident.severity)}`}>
                        {accident.severity || 'N/A'}
                      </span>
                    </td>
                    <td>
                      {accident.other_party_name || 'N/A'}
                      {accident.other_party_vehicle_vin && (
                        <br />
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>
                          VIN: {accident.other_party_vehicle_vin}
                        </span>
                      )}
                    </td>
                    <td>
                      ${accident.damage_estimate ? parseFloat(accident.damage_estimate).toFixed(2) : '0.00'}
                    </td>
                    <td>{accident.police_report_number || 'N/A'}</td>
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

export default Accidents;

