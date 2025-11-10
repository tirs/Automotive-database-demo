import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function ServiceRecordDetail({ record, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    mileage_at_service: 0,
    labor_cost: 0,
    total_cost: 0,
    warranty_covered: false,
    service_type: 'maintenance',
    next_service_due_date: '',
    next_service_due_mileage: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        description: record.description || '',
        mileage_at_service: record.mileage_at_service || 0,
        labor_cost: record.labor_cost || 0,
        total_cost: record.total_cost || 0,
        warranty_covered: record.warranty_covered || false,
        service_type: record.service_type || 'maintenance',
        next_service_due_date: record.next_service_due_date || '',
        next_service_due_mileage: record.next_service_due_mileage || ''
      });
    }
  }, [record]);

  if (!record) return null;

  const getServiceTypeBadge = (type) => {
    const badges = {
      maintenance: 'badge-maintenance',
      repair: 'badge-repair',
      inspection: 'badge-inspection',
      recall: 'badge-recall',
      warranty: 'badge-warranty'
    };
    return badges[type] || 'badge';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('service_record')
        .update({
          description: formData.description || null,
          mileage_at_service: formData.mileage_at_service,
          labor_cost: formData.labor_cost,
          total_cost: formData.total_cost,
          warranty_covered: formData.warranty_covered,
          service_type: formData.service_type,
          next_service_due_date: formData.next_service_due_date || null,
          next_service_due_mileage: formData.next_service_due_mileage || null
        })
        .eq('id', record.id);

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
    setFormData({
      description: record.description || '',
      mileage_at_service: record.mileage_at_service || 0,
      labor_cost: record.labor_cost || 0,
      total_cost: record.total_cost || 0,
      warranty_covered: record.warranty_covered || false,
      service_type: record.service_type || 'maintenance',
      next_service_due_date: record.next_service_due_date || '',
      next_service_due_mileage: record.next_service_due_mileage || ''
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Service Record Details</h2>
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
            <h3>Service Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Service Date</span>
                <span className="detail-value">{new Date(record.service_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Service Type</span>
                {isEditing ? (
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="inspection">Inspection</option>
                    <option value="recall">Recall</option>
                    <option value="warranty">Warranty</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className={'badge ' + getServiceTypeBadge(record.service_type)}>
                      {record.service_type}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Mileage at Service</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="mileage_at_service"
                    value={formData.mileage_at_service}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Mileage"
                  />
                ) : (
                  <span className="detail-value">{record.mileage_at_service?.toLocaleString() || 'N/A'} miles</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Warranty Covered</span>
                {isEditing ? (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="warranty_covered"
                      checked={formData.warranty_covered}
                      onChange={handleInputChange}
                      className="detail-checkbox"
                    />
                    <span>Warranty Covered</span>
                  </label>
                ) : (
                  <span className="detail-value">{record.warranty_covered ? 'Yes' : 'No'}</span>
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
                    placeholder="Service description"
                    rows="3"
                  />
                ) : (
                  <span className="detail-value">{record.description || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Vehicle Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">VIN</span>
                <span className="detail-value">{record.vehicle?.vin || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Year</span>
                <span className="detail-value">{record.vehicle?.year || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Manufacturer</span>
                <span className="detail-value">{record.vehicle?.vehicle_model?.manufacturer?.name || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Model</span>
                <span className="detail-value">{record.vehicle?.vehicle_model?.name || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Service Provider</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Service Center</span>
                <span className="detail-value">{record.service_center?.name || 'N/A'}</span>
              </div>
              {record.technician && (
                <div className="detail-item">
                  <span className="detail-label">Technician</span>
                  <span className="detail-value">
                    {record.technician.first_name} {record.technician.last_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Cost Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Labor Cost</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="labor_cost"
                    value={formData.labor_cost}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Labor Cost"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">${parseFloat(record.labor_cost || 0).toFixed(2)}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Cost</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="total_cost"
                    value={formData.total_cost}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Total Cost"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value"><strong>${parseFloat(record.total_cost || 0).toFixed(2)}</strong></span>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Next Service</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Due Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="next_service_due_date"
                    value={formData.next_service_due_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {record.next_service_due_date ? new Date(record.next_service_due_date).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Due Mileage</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="next_service_due_mileage"
                    value={formData.next_service_due_mileage}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Due Mileage"
                  />
                ) : (
                  <span className="detail-value">
                    {record.next_service_due_mileage ? record.next_service_due_mileage.toLocaleString() + ' miles' : 'N/A'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceRecordDetail;

