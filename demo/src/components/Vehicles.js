import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import VehicleDetail from './VehicleDetail';
import './Components.css';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicle')
        .select(`
          *,
          vehicle_model:vehicle_model_id (
            name,
            manufacturer:manufacturer_id (
              name
            )
          ),
          owner:owner_id (
            first_name,
            last_name,
            owner_type
          )
        `)
        .order('year', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleUpdate = () => {
    fetchVehicles();
    setSelectedVehicle(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-active',
      sold: 'badge-sold',
      totaled: 'badge-totaled',
      stolen: 'badge-totaled'
    };
    return badges[status] || 'badge';
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading vehicles</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Vehicles</h1>
        <p>Manage and view all vehicles in the database</p>
      </div>

      <div className="glass-container">
        {vehicles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No vehicles found. Please run the sample_data.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>VIN</th>
                  <th>Year</th>
                  <th>Manufacturer</th>
                  <th>Model</th>
                  <th>Color</th>
                  <th>Mileage</th>
                  <th>Owner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr 
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="clickable-row"
                  >
                    <td><strong>{vehicle.vin}</strong></td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.vehicle_model?.manufacturer?.name || 'N/A'}</td>
                    <td>{vehicle.vehicle_model?.name || 'N/A'}</td>
                    <td>{vehicle.color || 'N/A'}</td>
                    <td>{vehicle.mileage?.toLocaleString() || 0} mi</td>
                    <td>
                      {vehicle.owner?.first_name} {vehicle.owner?.last_name}
                      {vehicle.owner?.owner_type !== 'individual' && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}> ({vehicle.owner?.owner_type})</span>
                      )}
                    </td>
                    <td>
                      <span className={'badge ' + getStatusBadge(vehicle.status)}>
                        {vehicle.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedVehicle && (
        <VehicleDetail 
          vehicle={selectedVehicle} 
          onClose={() => setSelectedVehicle(null)}
          onUpdate={handleVehicleUpdate}
        />
      )}
    </>
  );
}

export default Vehicles;

