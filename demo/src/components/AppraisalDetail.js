import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function AppraisalDetail({ appraisal, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    appraisal_date: '',
    appraised_value: '',
    appraisal_type: 'trade_in',
    appraiser_name: '',
    appraiser_company: '',
    condition_rating: 'good',
    mileage_at_appraisal: '',
    notes: ''
  });

  useEffect(() => {
    if (appraisal) {
      setFormData({
        appraisal_date: appraisal.appraisal_date ? appraisal.appraisal_date.split('T')[0] : '',
        appraised_value: appraisal.appraised_value || '',
        appraisal_type: appraisal.appraisal_type || 'trade_in',
        appraiser_name: appraisal.appraiser_name || '',
        appraiser_company: appraisal.appraiser_company || '',
        condition_rating: appraisal.condition_rating || 'good',
        mileage_at_appraisal: appraisal.mileage_at_appraisal || '',
        notes: appraisal.notes || ''
      });
    }
  }, [appraisal]);

  if (!appraisal) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'appraised_value' || name === 'mileage_at_appraisal'
        ? (value === '' ? '' : (name === 'appraised_value' ? parseFloat(value) || 0 : parseInt(value) || 0))
        : value
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
        .from('vehicle_appraisal')
        .update({
          appraisal_date: formData.appraisal_date || null,
          appraised_value: formData.appraised_value ? parseFloat(formData.appraised_value) : null,
          appraisal_type: formData.appraisal_type || null,
          appraiser_name: formData.appraiser_name || null,
          appraiser_company: formData.appraiser_company || null,
          condition_rating: formData.condition_rating || null,
          mileage_at_appraisal: formData.mileage_at_appraisal ? parseInt(formData.mileage_at_appraisal) : null,
          notes: formData.notes || null
        })
        .eq('id', appraisal.id);

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
    if (appraisal) {
      setFormData({
        appraisal_date: appraisal.appraisal_date ? appraisal.appraisal_date.split('T')[0] : '',
        appraised_value: appraisal.appraised_value || '',
        appraisal_type: appraisal.appraisal_type || 'trade_in',
        appraiser_name: appraisal.appraiser_name || '',
        appraiser_company: appraisal.appraiser_company || '',
        condition_rating: appraisal.condition_rating || 'good',
        mileage_at_appraisal: appraisal.mileage_at_appraisal || '',
        notes: appraisal.notes || ''
      });
    }
    setIsEditing(false);
    setError(null);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Appraisal Details</h2>
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
                <span className="detail-value"><strong>{appraisal.vehicle?.vin || 'N/A'}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {appraisal.vehicle?.vehicle_model?.manufacturer?.name} {appraisal.vehicle?.vehicle_model?.name} {appraisal.vehicle?.year}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Appraisal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Appraisal Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="appraisal_date"
                    value={formData.appraisal_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {appraisal.appraisal_date ? new Date(appraisal.appraisal_date).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Appraised Value</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="appraised_value"
                    value={formData.appraised_value}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Appraised value"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    <strong style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 1)' }}>
                      ${appraisal.appraised_value ? parseFloat(appraisal.appraised_value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </strong>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Appraisal Type</span>
                {isEditing ? (
                  <select
                    name="appraisal_type"
                    value={formData.appraisal_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="trade_in">Trade-In</option>
                    <option value="private_sale">Private Sale</option>
                    <option value="insurance">Insurance</option>
                    <option value="tax">Tax</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className="badge badge-maintenance">
                      {appraisal.appraisal_type?.replace('_', ' ') || 'N/A'}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Condition Rating</span>
                {isEditing ? (
                  <select
                    name="condition_rating"
                    value={formData.condition_rating}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className={`badge ${getConditionBadge(appraisal.condition_rating)}`}>
                      {appraisal.condition_rating || 'N/A'}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Mileage at Appraisal</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="mileage_at_appraisal"
                    value={formData.mileage_at_appraisal}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Mileage"
                  />
                ) : (
                  <span className="detail-value">
                    {appraisal.mileage_at_appraisal ? appraisal.mileage_at_appraisal.toLocaleString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Appraiser Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="appraiser_name"
                    value={formData.appraiser_name}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Appraiser name"
                  />
                ) : (
                  <span className="detail-value">{appraisal.appraiser_name || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Appraiser Company</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="appraiser_company"
                    value={formData.appraiser_company}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Appraiser company"
                  />
                ) : (
                  <span className="detail-value">{appraisal.appraiser_company || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Notes</span>
                {isEditing ? (
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="detail-textarea"
                    placeholder="Notes"
                  />
                ) : (
                  <span className="detail-value">{appraisal.notes || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppraisalDetail;

