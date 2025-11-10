import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import OwnerDetail from './OwnerDetail';
import './Components.css';

function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('owner')
        .select(`
          *,
          vehicles:vehicle (
            id,
            vin,
            year,
            status
          )
        `)
        .order('last_name', { ascending: true });

      if (error) throw error;
      setOwners(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerUpdate = () => {
    fetchOwners();
    setSelectedOwner(null);
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading owners</div>
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
        <h1>Owners</h1>
        <p>View and manage all vehicle owners</p>
      </div>

      <div className="glass-container">
        {owners.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No owners found. Please run the sample_data.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Vehicles</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner) => (
                  <tr 
                    key={owner.id}
                    onClick={() => setSelectedOwner(owner)}
                    className="clickable-row"
                  >
                    <td><strong>{owner.first_name} {owner.last_name}</strong></td>
                    <td>
                      <span className="badge badge-active">
                        {owner.owner_type}
                      </span>
                    </td>
                    <td>{owner.email || 'N/A'}</td>
                    <td>{owner.phone || 'N/A'}</td>
                    <td>
                      {owner.city && owner.state 
                        ? owner.city + ', ' + owner.state
                        : 'N/A'}
                    </td>
                    <td>
                      <strong>{owner.vehicles?.length || 0}</strong> vehicle(s)
                      {owner.vehicles && owner.vehicles.length > 0 && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {owner.vehicles.filter(v => v.status === 'active').length} active
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOwner && (
        <OwnerDetail 
          owner={selectedOwner} 
          onClose={() => setSelectedOwner(null)}
          onUpdate={handleOwnerUpdate}
        />
      )}
    </>
  );
}

export default Owners;

