import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ServiceRecordDetail from './ServiceRecordDetail';
import './Components.css';

function ServiceRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchServiceRecords();
  }, []);

  const fetchServiceRecords = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('service_record')
        .select(`
          *,
          vehicle:vehicle_id (
            vin,
            year,
            vehicle_model:vehicle_model_id (
              name,
              manufacturer:manufacturer_id (
                name
              )
            )
          ),
          service_center:service_center_id (
            name
          ),
          technician:technician_id (
            first_name,
            last_name
          )
        `)
        .order('service_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordUpdate = () => {
    fetchServiceRecords();
    setSelectedRecord(null);
  };

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

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading service records</div>
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
        <h1>Service Records</h1>
        <p>View maintenance and repair history</p>
      </div>

      <div className="glass-container">
        {records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No service records found. Please run the sample_data.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Mileage</th>
                  <th>Service Center</th>
                  <th>Technician</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr 
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className="clickable-row"
                  >
                    <td>{new Date(record.service_date).toLocaleDateString()}</td>
                    <td>
                      <strong>{record.vehicle?.vin}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {record.vehicle?.vehicle_model?.manufacturer?.name} {record.vehicle?.vehicle_model?.name} ({record.vehicle?.year})
                      </div>
                    </td>
                    <td>
                      <span className={'badge ' + getServiceTypeBadge(record.service_type)}>
                        {record.service_type}
                      </span>
                    </td>
                    <td>{record.description || 'N/A'}</td>
                    <td>{record.mileage_at_service?.toLocaleString() || 'N/A'} mi</td>
                    <td>{record.service_center?.name || 'N/A'}</td>
                    <td>
                      {record.technician 
                        ? record.technician.first_name + ' ' + record.technician.last_name
                        : 'N/A'}
                    </td>
                    <td><strong>${parseFloat(record.total_cost || 0).toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRecord && (
        <ServiceRecordDetail 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)}
          onUpdate={handleRecordUpdate}
        />
      )}
    </>
  );
}

export default ServiceRecords;

