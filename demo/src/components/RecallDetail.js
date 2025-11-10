import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function RecallDetail({ recall, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    recall_number: '',
    recall_date: '',
    title: '',
    description: '',
    affected_year_range: '',
    severity: 'medium',
    remedy_description: '',
    status: 'open'
  });

  useEffect(() => {
    if (recall) {
      setFormData({
        recall_number: recall.recall_number || '',
        recall_date: recall.recall_date ? recall.recall_date.split('T')[0] : '',
        title: recall.title || '',
        description: recall.description || '',
        affected_year_range: recall.affected_year_range || '',
        severity: recall.severity || 'medium',
        remedy_description: recall.remedy_description || '',
        status: recall.status || 'open'
      });
    }
  }, [recall]);

  if (!recall) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        .from('recall')
        .update({
          recall_number: formData.recall_number || null,
          recall_date: formData.recall_date || null,
          title: formData.title || null,
          description: formData.description || null,
          affected_year_range: formData.affected_year_range || null,
          severity: formData.severity,
          remedy_description: formData.remedy_description || null,
          status: formData.status
        })
        .eq('id', recall.id);

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
    if (recall) {
      setFormData({
        recall_number: recall.recall_number || '',
        recall_date: recall.recall_date ? recall.recall_date.split('T')[0] : '',
        title: recall.title || '',
        description: recall.description || '',
        affected_year_range: recall.affected_year_range || '',
        severity: recall.severity || 'medium',
        remedy_description: recall.remedy_description || '',
        status: recall.status || 'open'
      });
    }
    setIsEditing(false);
    setError(null);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Recall Details</h2>
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
            <h3>Vehicle Model Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Manufacturer</span>
                <span className="detail-value">
                  {recall.manufacturer?.name || recall.vehicle_model?.manufacturer?.name || 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Model</span>
                <span className="detail-value">{recall.vehicle_model?.name || 'All Models'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Recall Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Recall Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="recall_number"
                    value={formData.recall_number}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Recall number"
                  />
                ) : (
                  <span className="detail-value"><strong>{recall.recall_number || 'N/A'}</strong></span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Recall Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="recall_date"
                    value={formData.recall_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {recall.recall_date ? new Date(recall.recall_date).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Title</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Recall title"
                  />
                ) : (
                  <span className="detail-value"><strong>{recall.title || 'N/A'}</strong></span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Affected Year Range</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="affected_year_range"
                    value={formData.affected_year_range}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="e.g., 2020-2022"
                  />
                ) : (
                  <span className="detail-value">{recall.affected_year_range || 'N/A'}</span>
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
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className={`badge ${getSeverityBadge(recall.severity)}`}>
                      {recall.severity || 'N/A'}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="open">Open</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className={`badge ${getStatusBadge(recall.status)}`}>
                      {recall.status || 'N/A'}
                    </span>
                  </span>
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
                    placeholder="Recall description"
                  />
                ) : (
                  <span className="detail-value">{recall.description || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Remedy Description</span>
                {isEditing ? (
                  <textarea
                    name="remedy_description"
                    value={formData.remedy_description}
                    onChange={handleInputChange}
                    className="detail-textarea"
                    placeholder="Remedy description"
                  />
                ) : (
                  <span className="detail-value">{recall.remedy_description || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecallDetail;

