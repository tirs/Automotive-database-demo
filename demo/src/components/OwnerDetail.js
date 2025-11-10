import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function OwnerDetail({ owner, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });

  useEffect(() => {
    if (owner) {
      setFormData({
        first_name: owner.first_name || '',
        last_name: owner.last_name || '',
        email: owner.email || '',
        phone: owner.phone || '',
        address_line1: owner.address_line1 || '',
        address_line2: owner.address_line2 || '',
        city: owner.city || '',
        state: owner.state || '',
        postal_code: owner.postal_code || '',
        country: owner.country || ''
      });
    }
  }, [owner]);

  if (!owner) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }

      const { error: updateError } = await supabase
        .from('owner')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email || null,
          phone: formData.phone || null,
          address_line1: formData.address_line1 || null,
          address_line2: formData.address_line2 || null,
          city: formData.city || null,
          state: formData.state || null,
          postal_code: formData.postal_code || null,
          country: formData.country || null
        })
        .eq('id', owner.id);

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
      first_name: owner.first_name || '',
      last_name: owner.last_name || '',
      email: owner.email || '',
      phone: owner.phone || '',
      address_line1: owner.address_line1 || '',
      address_line2: owner.address_line2 || '',
      city: owner.city || '',
      state: owner.state || '',
      postal_code: owner.postal_code || '',
      country: owner.country || ''
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Owner Details</h2>
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
            <h3>Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">First Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="First Name"
                  />
                ) : (
                  <span className="detail-value">{owner.first_name}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Last Name"
                  />
                ) : (
                  <span className="detail-value">{owner.last_name}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Owner Type</span>
                <span className="detail-value">
                  <span className="badge badge-active">{owner.owner_type}</span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Email"
                  />
                ) : (
                  <span className="detail-value">{owner.email || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Phone"
                  />
                ) : (
                  <span className="detail-value">{owner.phone || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Address</h3>
            <div className="detail-grid">
              <div className="detail-item full-width">
                <span className="detail-label">Address Line 1</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Address Line 1"
                  />
                ) : (
                  <span className="detail-value">{owner.address_line1 || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Address Line 2</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Address Line 2"
                  />
                ) : (
                  <span className="detail-value">{owner.address_line2 || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">City</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="City"
                  />
                ) : (
                  <span className="detail-value">{owner.city || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">State</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="State"
                  />
                ) : (
                  <span className="detail-value">{owner.state || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Postal Code</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Postal Code"
                  />
                ) : (
                  <span className="detail-value">{owner.postal_code || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Country</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Country"
                  />
                ) : (
                  <span className="detail-value">{owner.country || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>

          {owner.vehicles && owner.vehicles.length > 0 && (
            <div className="detail-section">
              <h3>Vehicles ({owner.vehicles.length})</h3>
              <div className="vehicles-list">
                {owner.vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="vehicle-item">
                    <div className="vehicle-info">
                      <span className="vehicle-vin"><strong>{vehicle.vin}</strong></span>
                      <span className="vehicle-year">{vehicle.year}</span>
                      <span className={'badge badge-' + (vehicle.status === 'active' ? 'active' : vehicle.status === 'sold' ? 'sold' : 'totaled')}>
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDetail;

