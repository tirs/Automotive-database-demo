import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function InsuranceDetail({ policy, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    insurance_company: '',
    policy_number: '',
    policy_type: 'full_coverage',
    start_date: '',
    end_date: '',
    premium_amount: '',
    deductible: ''
  });

  useEffect(() => {
    if (policy) {
      setFormData({
        insurance_company: policy.insurance_company || '',
        policy_number: policy.policy_number || '',
        policy_type: policy.policy_type || 'full_coverage',
        start_date: policy.start_date ? policy.start_date.split('T')[0] : '',
        end_date: policy.end_date ? policy.end_date.split('T')[0] : '',
        premium_amount: policy.premium_amount || '',
        deductible: policy.deductible || ''
      });
    }
  }, [policy]);

  if (!policy) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'premium_amount' || name === 'deductible' ? (value === '' ? '' : parseFloat(value) || 0) : value
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
        .from('insurance_policy')
        .update({
          insurance_company: formData.insurance_company,
          policy_number: formData.policy_number,
          policy_type: formData.policy_type,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          premium_amount: formData.premium_amount ? parseFloat(formData.premium_amount) : null,
          deductible: formData.deductible ? parseFloat(formData.deductible) : null
        })
        .eq('id', policy.id);

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
    if (policy) {
      setFormData({
        insurance_company: policy.insurance_company || '',
        policy_number: policy.policy_number || '',
        policy_type: policy.policy_type || 'full_coverage',
        start_date: policy.start_date ? policy.start_date.split('T')[0] : '',
        end_date: policy.end_date ? policy.end_date.split('T')[0] : '',
        premium_amount: policy.premium_amount || '',
        deductible: policy.deductible || ''
      });
    }
    setIsEditing(false);
    setError(null);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Insurance Policy Details</h2>
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
                <span className="detail-value"><strong>{policy.vehicle?.vin || 'N/A'}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {policy.vehicle?.vehicle_model?.manufacturer?.name} {policy.vehicle?.vehicle_model?.name} {policy.vehicle?.year}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Policy Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Insurance Company</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="insurance_company"
                    value={formData.insurance_company}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Insurance company"
                  />
                ) : (
                  <span className="detail-value">{policy.insurance_company || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Policy Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="policy_number"
                    value={formData.policy_number}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Policy number"
                  />
                ) : (
                  <span className="detail-value">{policy.policy_number || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Policy Type</span>
                {isEditing ? (
                  <select
                    name="policy_type"
                    value={formData.policy_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="full_coverage">Full Coverage</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="liability">Liability</option>
                    <option value="collision">Collision</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className="badge badge-maintenance">
                      {policy.policy_type?.replace('_', ' ') || 'N/A'}
                    </span>
                  </span>
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
                    {policy.start_date ? new Date(policy.start_date).toLocaleDateString() : 'N/A'}
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
                    {policy.end_date ? new Date(policy.end_date).toLocaleDateString() : 'N/A'}
                    {isExpiringSoon(policy.end_date) && (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 165, 0, 0.9)' }}>⚠ Expiring Soon</span>
                    )}
                    {isExpired(policy.end_date) && (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 68, 68, 0.9)' }}>✗ Expired</span>
                    )}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Premium Amount</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="premium_amount"
                    value={formData.premium_amount}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Premium amount"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    ${policy.premium_amount ? parseFloat(policy.premium_amount).toFixed(2) : '0.00'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Deductible</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="deductible"
                    value={formData.deductible}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Deductible"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    ${policy.deductible ? parseFloat(policy.deductible).toFixed(2) : '0.00'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {policy.agent_name && (
            <div className="detail-section">
              <h3>Agent Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Agent Name</span>
                  <span className="detail-value">{policy.agent_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Agent Phone</span>
                  <span className="detail-value">{policy.agent_phone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Agent Email</span>
                  <span className="detail-value">{policy.agent_email || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsuranceDetail;

