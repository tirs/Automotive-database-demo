import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function FuelRecordDetail({ record, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fuel_date: '',
    fuel_type: 'gasoline',
    gallons: '',
    cost_per_gallon: '',
    total_cost: '',
    odometer_reading: '',
    gas_station: '',
    location: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        fuel_date: record.fuel_date ? record.fuel_date.split('T')[0] : '',
        fuel_type: record.fuel_type || 'gasoline',
        gallons: record.gallons || '',
        cost_per_gallon: record.cost_per_gallon || '',
        total_cost: record.total_cost || '',
        odometer_reading: record.odometer_reading || '',
        gas_station: record.gas_station || '',
        location: record.location || ''
      });
    }
  }, [record]);

  if (!record) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: ['gallons', 'cost_per_gallon', 'total_cost', 'odometer_reading'].includes(name)
          ? (value === '' ? '' : parseFloat(value) || 0)
          : value
      };
      
      // Auto-calculate total_cost if gallons and cost_per_gallon are provided
      if (name === 'gallons' || name === 'cost_per_gallon') {
        const gallons = name === 'gallons' ? parseFloat(value) || 0 : parseFloat(newData.gallons) || 0;
        const costPerGallon = name === 'cost_per_gallon' ? parseFloat(value) || 0 : parseFloat(newData.cost_per_gallon) || 0;
        if (gallons > 0 && costPerGallon > 0) {
          newData.total_cost = (gallons * costPerGallon).toFixed(2);
        }
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }

      const { error: updateError } = await supabase
        .from('fuel_record')
        .update({
          fuel_date: formData.fuel_date || null,
          fuel_type: formData.fuel_type,
          gallons: formData.gallons ? parseFloat(formData.gallons) : null,
          cost_per_gallon: formData.cost_per_gallon ? parseFloat(formData.cost_per_gallon) : null,
          total_cost: formData.total_cost ? parseFloat(formData.total_cost) : null,
          odometer_reading: formData.odometer_reading ? parseInt(formData.odometer_reading) : null,
          gas_station: formData.gas_station || null,
          location: formData.location || null
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
    if (record) {
      setFormData({
        fuel_date: record.fuel_date ? record.fuel_date.split('T')[0] : '',
        fuel_type: record.fuel_type || 'gasoline',
        gallons: record.gallons || '',
        cost_per_gallon: record.cost_per_gallon || '',
        total_cost: record.total_cost || '',
        odometer_reading: record.odometer_reading || '',
        gas_station: record.gas_station || '',
        location: record.location || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Fuel Record Details</h2>
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
                <span className="detail-value"><strong>{record.vehicle?.vin || 'N/A'}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {record.vehicle?.vehicle_model?.manufacturer?.name} {record.vehicle?.vehicle_model?.name} {record.vehicle?.year}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Fuel Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Fuel Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="fuel_date"
                    value={formData.fuel_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {record.fuel_date ? new Date(record.fuel_date).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Fuel Type</span>
                {isEditing ? (
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className="badge badge-maintenance">
                      {record.fuel_type || 'N/A'}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Gallons</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="gallons"
                    value={formData.gallons}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Gallons"
                    step="0.001"
                  />
                ) : (
                  <span className="detail-value">
                    {record.gallons ? parseFloat(record.gallons).toFixed(2) : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Cost per Gallon</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="cost_per_gallon"
                    value={formData.cost_per_gallon}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Cost per gallon"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    ${record.cost_per_gallon ? parseFloat(record.cost_per_gallon).toFixed(2) : '0.00'}
                  </span>
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
                    placeholder="Total cost"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    <strong>${record.total_cost ? parseFloat(record.total_cost).toFixed(2) : '0.00'}</strong>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Odometer Reading</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="odometer_reading"
                    value={formData.odometer_reading}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Odometer reading"
                  />
                ) : (
                  <span className="detail-value">
                    {record.odometer_reading ? record.odometer_reading.toLocaleString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Gas Station</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="gas_station"
                    value={formData.gas_station}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Gas station"
                  />
                ) : (
                  <span className="detail-value">{record.gas_station || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item full-width">
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
                  <span className="detail-value">{record.location || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FuelRecordDetail;

