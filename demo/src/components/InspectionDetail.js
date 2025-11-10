import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function InspectionDetail({ inspection, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    inspection_type: 'state',
    inspection_date: '',
    expiration_date: '',
    mileage_at_inspection: '',
    inspector_name: '',
    inspection_station: '',
    passed: true,
    notes: '',
    certificate_number: ''
  });

  useEffect(() => {
    if (inspection) {
      setFormData({
        inspection_type: inspection.inspection_type || 'state',
        inspection_date: inspection.inspection_date ? inspection.inspection_date.split('T')[0] : '',
        expiration_date: inspection.expiration_date ? inspection.expiration_date.split('T')[0] : '',
        mileage_at_inspection: inspection.mileage_at_inspection || '',
        inspector_name: inspection.inspector_name || '',
        inspection_station: inspection.inspection_station || '',
        passed: inspection.passed !== undefined ? inspection.passed : true,
        notes: inspection.notes || '',
        certificate_number: inspection.certificate_number || ''
      });
    }
  }, [inspection]);

  if (!inspection) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'mileage_at_inspection' ? (value === '' ? '' : parseInt(value) || 0) : value)
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
        .from('inspection')
        .update({
          inspection_type: formData.inspection_type,
          inspection_date: formData.inspection_date || null,
          expiration_date: formData.expiration_date || null,
          mileage_at_inspection: formData.mileage_at_inspection ? parseInt(formData.mileage_at_inspection) : null,
          inspector_name: formData.inspector_name || null,
          inspection_station: formData.inspection_station || null,
          passed: formData.passed,
          notes: formData.notes || null,
          certificate_number: formData.certificate_number || null
        })
        .eq('id', inspection.id);

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
    if (inspection) {
      setFormData({
        inspection_type: inspection.inspection_type || 'state',
        inspection_date: inspection.inspection_date ? inspection.inspection_date.split('T')[0] : '',
        expiration_date: inspection.expiration_date ? inspection.expiration_date.split('T')[0] : '',
        mileage_at_inspection: inspection.mileage_at_inspection || '',
        inspector_name: inspection.inspector_name || '',
        inspection_station: inspection.inspection_station || '',
        passed: inspection.passed !== undefined ? inspection.passed : true,
        notes: inspection.notes || '',
        certificate_number: inspection.certificate_number || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const expiration = new Date(expirationDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiration - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Inspection Details</h2>
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
                <span className="detail-value"><strong>{inspection.vehicle?.vin || 'N/A'}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {inspection.vehicle?.vehicle_model?.manufacturer?.name} {inspection.vehicle?.vehicle_model?.name} {inspection.vehicle?.year}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Inspection Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Inspection Type</span>
                {isEditing ? (
                  <select
                    name="inspection_type"
                    value={formData.inspection_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="state">State</option>
                    <option value="emissions">Emissions</option>
                    <option value="safety">Safety</option>
                    <option value="pre_purchase">Pre-Purchase</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className="badge badge-inspection">
                      {inspection.inspection_type}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Inspection Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="inspection_date"
                    value={formData.inspection_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {inspection.inspection_date ? new Date(inspection.inspection_date).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Expiration Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {inspection.expiration_date ? new Date(inspection.expiration_date).toLocaleDateString() : 'N/A'}
                    {isExpiringSoon(inspection.expiration_date) && (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 165, 0, 0.9)' }}>⚠ Expiring Soon</span>
                    )}
                    {isExpired(inspection.expiration_date) && (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 68, 68, 0.9)' }}>✗ Expired</span>
                    )}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Mileage at Inspection</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="mileage_at_inspection"
                    value={formData.mileage_at_inspection}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Mileage"
                  />
                ) : (
                  <span className="detail-value">
                    {inspection.mileage_at_inspection ? inspection.mileage_at_inspection.toLocaleString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Inspector Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="inspector_name"
                    value={formData.inspector_name}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Inspector name"
                  />
                ) : (
                  <span className="detail-value">{inspection.inspector_name || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Inspection Station</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="inspection_station"
                    value={formData.inspection_station}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Inspection station"
                  />
                ) : (
                  <span className="detail-value">{inspection.inspection_station || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Passed</span>
                {isEditing ? (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="passed"
                      checked={formData.passed}
                      onChange={handleInputChange}
                      className="detail-checkbox"
                    />
                    <span>Passed</span>
                  </label>
                ) : (
                  <span className="detail-value">
                    {inspection.passed ? (
                      <span className="badge badge-active">Passed</span>
                    ) : (
                      <span className="badge badge-sold">Failed</span>
                    )}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Certificate Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="certificate_number"
                    value={formData.certificate_number}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Certificate number"
                  />
                ) : (
                  <span className="detail-value">{inspection.certificate_number || 'N/A'}</span>
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
                  <span className="detail-value">{inspection.notes || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InspectionDetail;

