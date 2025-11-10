import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function VehicleDetail({ vehicle, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    color: '',
    mileage: 0,
    license_plate: '',
    registration_state: '',
    status: 'active',
    current_value: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        color: vehicle.color || '',
        mileage: vehicle.mileage || 0,
        license_plate: vehicle.license_plate || '',
        registration_state: vehicle.registration_state || '',
        status: vehicle.status || 'active',
        current_value: vehicle.current_value || ''
      });
    }
  }, [vehicle]);

  if (!vehicle) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mileage' || name === 'current_value' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('vehicle')
        .update({
          color: formData.color || null,
          mileage: formData.mileage,
          license_plate: formData.license_plate || null,
          registration_state: formData.registration_state || null,
          status: formData.status,
          current_value: formData.current_value || null
        })
        .eq('id', vehicle.id);

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
      color: vehicle?.color || '',
      mileage: vehicle?.mileage || 0,
      license_plate: vehicle?.license_plate || '',
      registration_state: vehicle?.registration_state || '',
      status: vehicle?.status || 'active',
      current_value: vehicle?.current_value || ''
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vehicle Details</h2>
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
            <h3>Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">VIN</span>
                <span className="detail-value">{vehicle.vin}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Year</span>
                <span className="detail-value">{vehicle.year}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Color</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Color"
                  />
                ) : (
                  <span className="detail-value">{vehicle.color || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Mileage</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Mileage"
                  />
                ) : (
                  <span className="detail-value">{vehicle.mileage?.toLocaleString() || 0} miles</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">License Plate</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="license_plate"
                    value={formData.license_plate}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="License Plate"
                  />
                ) : (
                  <span className="detail-value">{vehicle.license_plate || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Registration State</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="registration_state"
                    value={formData.registration_state}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="State"
                  />
                ) : (
                  <span className="detail-value">{vehicle.registration_state || 'N/A'}</span>
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
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="totaled">Totaled</option>
                    <option value="stolen">Stolen</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className={'badge badge-' + (vehicle.status === 'active' ? 'active' : vehicle.status === 'sold' ? 'sold' : 'totaled')}>
                      {vehicle.status}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Vehicle Model</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Manufacturer</span>
                <span className="detail-value">{vehicle.vehicle_model?.manufacturer?.name || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Model</span>
                <span className="detail-value">{vehicle.vehicle_model?.name || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Type</span>
                <span className="detail-value">{vehicle.vehicle_model?.vehicle_type || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Owner Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Owner Name</span>
                <span className="detail-value">
                  {vehicle.owner?.first_name} {vehicle.owner?.last_name}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Owner Type</span>
                <span className="detail-value">{vehicle.owner?.owner_type || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{vehicle.owner?.email || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{vehicle.owner?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {vehicle.purchase_date && (
            <div className="detail-section">
              <h3>Purchase Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Purchase Date</span>
                  <span className="detail-value">{new Date(vehicle.purchase_date).toLocaleDateString()}</span>
                </div>
                {vehicle.purchase_price && (
                  <div className="detail-item">
                    <span className="detail-label">Purchase Price</span>
                    <span className="detail-value">${parseFloat(vehicle.purchase_price).toLocaleString()}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Current Value</span>
                  {isEditing ? (
                    <input
                      type="number"
                      name="current_value"
                      value={formData.current_value}
                      onChange={handleInputChange}
                      className="detail-input"
                      placeholder="Current Value"
                      step="0.01"
                    />
                  ) : (
                    <span className="detail-value">
                      {vehicle.current_value ? `$${parseFloat(vehicle.current_value).toLocaleString()}` : 'N/A'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VehicleDetail;

