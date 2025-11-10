import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Financing() {
  const [financings, setFinancings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancings();
  }, []);

  const fetchFinancings = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('financing')
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
        .order('start_date', { ascending: false });

      if (error) throw error;
      setFinancings(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (remaining, total) => {
    if (!total || total === 0) return 0;
    return ((total - remaining) / total) * 100;
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading financing records...</div>
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
        <h1>Financing & Loans</h1>
        <p>Track vehicle financing, loans, and lease agreements</p>
      </div>

      <div className="glass-container">
        {financings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No financing records found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Financing Type</th>
                  <th>Lender</th>
                  <th>Loan Amount</th>
                  <th>Interest Rate</th>
                  <th>Monthly Payment</th>
                  <th>Remaining Balance</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {financings.map((financing) => {
                  const progress = calculateProgress(
                    parseFloat(financing.remaining_balance || 0),
                    parseFloat(financing.loan_amount || 0)
                  );
                  return (
                    <tr key={financing.id} className="clickable-row">
                      <td>
                        <strong>{financing.vehicle?.vin}</strong>
                        <br />
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>
                          {financing.vehicle?.vehicle_model?.manufacturer?.name} {financing.vehicle?.vehicle_model?.name} {financing.vehicle?.year}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-maintenance">
                          {financing.financing_type?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td>{financing.lender_name || 'N/A'}</td>
                      <td>${financing.loan_amount ? parseFloat(financing.loan_amount).toFixed(2) : '0.00'}</td>
                      <td>{financing.interest_rate ? financing.interest_rate + '%' : 'N/A'}</td>
                      <td>${financing.monthly_payment ? parseFloat(financing.monthly_payment).toFixed(2) : '0.00'}</td>
                      <td>${financing.remaining_balance ? parseFloat(financing.remaining_balance).toFixed(2) : '0.00'}</td>
                      <td>{financing.start_date ? new Date(financing.start_date).toLocaleDateString() : 'N/A'}</td>
                      <td>{financing.end_date ? new Date(financing.end_date).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div style={{ width: '100px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', height: '8px', position: 'relative' }}>
                          <div style={{ 
                            width: `${progress}%`, 
                            background: 'rgba(255, 255, 255, 0.3)', 
                            height: '100%', 
                            borderRadius: '4px' 
                          }}></div>
                        </div>
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>{progress.toFixed(1)}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Financing;

