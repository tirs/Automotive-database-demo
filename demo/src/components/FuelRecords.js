import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import FuelRecordDetail from './FuelRecordDetail';
import './Components.css';

function FuelRecords() {
  const [fuelRecords, setFuelRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchFuelRecords();
  }, []);

  const fetchFuelRecords = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('fuel_record')
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
          )
        `)
        .order('fuel_date', { ascending: false });

      if (error) throw error;
      setFuelRecords(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordUpdate = () => {
    fetchFuelRecords();
    setSelectedRecord(null);
  };

  const calculateMPG = (currentRecord, previousRecord) => {
    if (!previousRecord || !currentRecord.odometer_reading || !previousRecord.odometer_reading) return null;
    const miles = currentRecord.odometer_reading - previousRecord.odometer_reading;
    if (miles <= 0 || !currentRecord.gallons || currentRecord.gallons <= 0) return null;
    return (miles / currentRecord.gallons).toFixed(2);
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading fuel records...</div>
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
        <h1>Fuel Records</h1>
        <p>Track fuel purchases and calculate fuel efficiency</p>
      </div>

      <div className="glass-container">
        {fuelRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No fuel records found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Fuel Date</th>
                  <th>Fuel Type</th>
                  <th>Gallons</th>
                  <th>Cost/Gallon</th>
                  <th>Total Cost</th>
                  <th>Odometer</th>
                  <th>Gas Station</th>
                  <th>MPG</th>
                </tr>
              </thead>
              <tbody>
                {fuelRecords.map((record, index) => {
                  const previousRecord = index < fuelRecords.length - 1 ? fuelRecords[index + 1] : null;
                  const mpg = calculateMPG(record, previousRecord);
                  return (
                    <tr 
                      key={record.id} 
                      onClick={() => setSelectedRecord(record)}
                      className="clickable-row"
                    >
                      <td>
                        <strong>{record.vehicle?.vin}</strong>
                        <br />
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>
                          {record.vehicle?.vehicle_model?.manufacturer?.name} {record.vehicle?.vehicle_model?.name} {record.vehicle?.year}
                        </span>
                      </td>
                      <td>{record.fuel_date ? new Date(record.fuel_date).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className="badge badge-maintenance">
                          {record.fuel_type || 'N/A'}
                        </span>
                      </td>
                      <td>{record.gallons ? parseFloat(record.gallons).toFixed(2) : 'N/A'}</td>
                      <td>${record.cost_per_gallon ? parseFloat(record.cost_per_gallon).toFixed(2) : '0.00'}</td>
                      <td><strong>${record.total_cost ? parseFloat(record.total_cost).toFixed(2) : '0.00'}</strong></td>
                      <td>{record.odometer_reading ? record.odometer_reading.toLocaleString() : 'N/A'}</td>
                      <td>{record.gas_station || 'N/A'}</td>
                      <td>
                        {mpg ? (
                          <span className="badge badge-active">{mpg} MPG</span>
                        ) : (
                          <span style={{ opacity: 0.5 }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRecord && (
        <FuelRecordDetail 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)}
          onUpdate={handleRecordUpdate}
        />
      )}
    </>
  );
}

export default FuelRecords;

