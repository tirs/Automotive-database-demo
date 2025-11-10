import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function WarrantyDetail({ warranty, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    warranty_type: 'factory',
    provider_name: '',
    start_date: '',
    end_date: '',
    mileage_limit: '',
    coverage_description: '',
    claim_count: 0
  });

  useEffect(() => {
    if (warranty) {
      setFormData({
        warranty_type: warranty.warranty_type || 'factory',
        provider_name: warranty.provider_name || '',
        start_date: warranty.start_date ? warranty.start_date.split('T')[0] : '',
        end_date: warranty.end_date ? warranty.end_date.split('T')[0] : '',
        mileage_limit: warranty.mileage_limit || '',
        coverage_description: warranty.coverage_description || '',
        claim_count: warranty.claim_count || 0
      });
    }
  }, [warranty]);

  if (!warranty) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mileage_limit' || name === 'claim_count' ? (value === '' ? '' : parseFloat(value) || 0) : value
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
        .from('warranty')
        .update({
          warranty_type: formData.warranty_type,
          provider_name: formData.provider_name,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          mileage_limit: formData.mileage_limit ? parseFloat(formData.mileage_limit) : null,
          coverage_description: formData.coverage_description,
          claim_count: parseInt(formData.claim_count) || 0
        })
        .eq('id', warranty.id);

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
    if (warranty) {
      setFormData({
        warranty_type: warranty.warranty_type || 'factory',
        provider_name: warranty.provider_name || '',
        start_date: warranty.start_date ? warranty.start_date.split('T')[0] : '',
        end_date: warranty.end_date ? warranty.end_date.split('T')[0] : '',
        mileage_limit: warranty.mileage_limit || '',
        coverage_description: warranty.coverage_description || '',
        claim_count: warranty.claim_count || 0
      });
    }
    setIsEditing(false);
    setError(null);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Warranty Details</h2>
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
                <span className="detail-value"><strong>{warranty.vehicle?.vin || 'N/A'}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {warranty.vehicle?.vehicle_model?.manufacturer?.name} {warranty.vehicle?.vehicle_model?.name} {warranty.vehicle?.year}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Warranty Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Warranty Type</span>
                {isEditing ? (
                  <select
                    name="warranty_type"
                    value={formData.warranty_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="factory">Factory</option>
                    <option value="extended">Extended</option>
                    <option value="third_party">Third Party</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className={`badge ${getWarrantyTypeBadge(warranty.warranty_type)}`}>
                      {warranty.warranty_type}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Provider</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="provider_name"
                    value={formData.provider_name}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Provider name"
                  />
                ) : (
                  <span className="detail-value">{warranty.provider_name || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Start Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {warranty.start_date ? new Date(warranty.start_date).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">End Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {warranty.end_date ? new Date(warranty.end_date).toLocaleDateString() : 'N/A'}
                    {isExpiringSoon(warranty.end_date) && (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 165, 0, 0.9)' }}>⚠ Expiring Soon</span>
                    )}
                    {isExpired(warranty.end_date) && (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 68, 68, 0.9)' }}>✗ Expired</span>
                    )}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Mileage Limit</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="mileage_limit"
                    value={formData.mileage_limit}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Mileage limit"
                  />
                ) : (
                  <span className="detail-value">
                    {warranty.mileage_limit ? warranty.mileage_limit.toLocaleString() + ' miles' : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Claim Count</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="claim_count"
                    value={formData.claim_count}
                    onChange={handleInputChange}
                    className="detail-input"
                    min="0"
                  />
                ) : (
                  <span className="detail-value">{warranty.claim_count || 0}</span>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Coverage Description</span>
                {isEditing ? (
                  <textarea
                    name="coverage_description"
                    value={formData.coverage_description}
                    onChange={handleInputChange}
                    className="detail-textarea"
                    placeholder="Coverage description"
                  />
                ) : (
                  <span className="detail-value">{warranty.coverage_description || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarrantyDetail;

