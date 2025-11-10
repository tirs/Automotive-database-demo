import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function AccidentDetail({ accident, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    accident_type: 'collision',
    severity: 'minor',
    description: '',
    other_party_name: '',
    other_party_vehicle_vin: '',
    police_report_number: '',
    damage_estimate: ''
  });

  useEffect(() => {
    if (accident) {
      setFormData({
        location: accident.location || '',
        accident_type: accident.accident_type || 'collision',
        severity: accident.severity || 'minor',
        description: accident.description || '',
        other_party_name: accident.other_party_name || '',
        other_party_vehicle_vin: accident.other_party_vehicle_vin || '',
        police_report_number: accident.police_report_number || '',
        damage_estimate: accident.damage_estimate || ''
      });
    }
  }, [accident]);

  if (!accident) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'damage_estimate' ? (value === '' ? '' : parseFloat(value) || 0) : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }

      const { error: updateError } = await supabase
        .from('accident')
        .update({
          location: formData.location || null,
          accident_type: formData.accident_type,
          severity: formData.severity,
          description: formData.description || null,
          other_party_name: formData.other_party_name || null,
          other_party_vehicle_vin: formData.other_party_vehicle_vin || null,
          police_report_number: formData.police_report_number || null,
          damage_estimate: formData.damage_estimate ? parseFloat(formData.damage_estimate) : null
        })
        .eq('id', accident.id);

      if (updateError) throw updateError;

      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (accident) {
      setFormData({
        location: accident.location || '',
        accident_type: accident.accident_type || 'collision',
        severity: accident.severity || 'minor',
        description: accident.description || '',
        other_party_name: accident.other_party_name || '',
        other_party_vehicle_vin: accident.other_party_vehicle_vin || '',
        police_report_number: accident.police_report_number || '',
        damage_estimate: accident.damage_estimate || ''
      });
    }
    setIsEditing(false);
    setError(null);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Accident Details</h2>
          <div className="modal-header-actions">
            {!isEditing ? (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
            ) : (
              <div className="edit-actions">
                <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
                <button className="btn-save" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <div className="modal-body">
          <div className="detail-section">
            <h3>Vehicle Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">VIN</span>
                <span className="detail-value"><strong>{accident.vehicle?.vin || 'N/A'}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {accident.vehicle?.vehicle_model?.manufacturer?.name} {accident.vehicle?.vehicle_model?.name} {accident.vehicle?.year}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Accident Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Accident Date</span>
                <span className="detail-value">
                  {accident.accident_date ? new Date(accident.accident_date).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Location"
                  />
                ) : (
                  <span className="detail-value">{accident.location || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Accident Type</span>
                {isEditing ? (
                  <select
                    name="accident_type"
                    value={formData.accident_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="collision">Collision</option>
                    <option value="vandalism">Vandalism</option>
                    <option value="theft">Theft</option>
                    <option value="weather">Weather</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className="badge badge-repair">
                      {accident.accident_type?.replace('_', ' ') || 'N/A'}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Severity</span>
                {isEditing ? (
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="total_loss">Total Loss</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className={`badge ${getSeverityBadge(accident.severity)}`}>
                      {accident.severity || 'N/A'}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Damage Estimate</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="damage_estimate"
                    value={formData.damage_estimate}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Damage estimate"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    ${accident.damage_estimate ? parseFloat(accident.damage_estimate).toFixed(2) : '0.00'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Police Report Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="police_report_number"
                    value={formData.police_report_number}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Police report number"
                  />
                ) : (
                  <span className="detail-value">{accident.police_report_number || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Description</span>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="detail-textarea"
                    placeholder="Accident description"
                  />
                ) : (
                  <span className="detail-value">{accident.description || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>

          {accident.other_party_name && (
            <div className="detail-section">
              <h3>Other Party Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Other Party Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="other_party_name"
                      value={formData.other_party_name}
                      onChange={handleInputChange}
                      className="detail-input"
                      placeholder="Other party name"
                    />
                  ) : (
                    <span className="detail-value">{accident.other_party_name}</span>
                  )}
                </div>
                <div className="detail-item">
                  <span className="detail-label">Other Party Vehicle VIN</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="other_party_vehicle_vin"
                      value={formData.other_party_vehicle_vin}
                      onChange={handleInputChange}
                      className="detail-input"
                      placeholder="VIN"
                    />
                  ) : (
                    <span className="detail-value">{accident.other_party_vehicle_vin || 'N/A'}</span>
                  )}
                </div>
                <div className="detail-item">
                  <span className="detail-label">Other Party Insurance</span>
                  <span className="detail-value">{accident.other_party_insurance || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Other Party Phone</span>
                  <span className="detail-value">{accident.other_party_phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccidentDetail;

