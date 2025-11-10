import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function FinancingDetail({ financing, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    financing_type: 'loan',
    lender_name: '',
    account_number: '',
    loan_amount: '',
    interest_rate: '',
    monthly_payment: '',
    start_date: '',
    end_date: '',
    remaining_balance: '',
    payment_frequency: 'monthly'
  });

  useEffect(() => {
    if (financing) {
      setFormData({
        financing_type: financing.financing_type || 'loan',
        lender_name: financing.lender_name || '',
        account_number: financing.account_number || '',
        loan_amount: financing.loan_amount || '',
        interest_rate: financing.interest_rate || '',
        monthly_payment: financing.monthly_payment || '',
        start_date: financing.start_date ? financing.start_date.split('T')[0] : '',
        end_date: financing.end_date ? financing.end_date.split('T')[0] : '',
        remaining_balance: financing.remaining_balance || '',
        payment_frequency: financing.payment_frequency || 'monthly'
      });
    }
  }, [financing]);

  if (!financing) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['loan_amount', 'interest_rate', 'monthly_payment', 'remaining_balance'].includes(name) 
        ? (value === '' ? '' : parseFloat(value) || 0) 
        : value
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
        .from('financing')
        .update({
          financing_type: formData.financing_type,
          lender_name: formData.lender_name || null,
          account_number: formData.account_number || null,
          loan_amount: formData.loan_amount ? parseFloat(formData.loan_amount) : null,
          interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : null,
          monthly_payment: formData.monthly_payment ? parseFloat(formData.monthly_payment) : null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          remaining_balance: formData.remaining_balance ? parseFloat(formData.remaining_balance) : null,
          payment_frequency: formData.payment_frequency || null
        })
        .eq('id', financing.id);

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
    if (financing) {
      setFormData({
        financing_type: financing.financing_type || 'loan',
        lender_name: financing.lender_name || '',
        account_number: financing.account_number || '',
        loan_amount: financing.loan_amount || '',
        interest_rate: financing.interest_rate || '',
        monthly_payment: financing.monthly_payment || '',
        start_date: financing.start_date ? financing.start_date.split('T')[0] : '',
        end_date: financing.end_date ? financing.end_date.split('T')[0] : '',
        remaining_balance: financing.remaining_balance || '',
        payment_frequency: financing.payment_frequency || 'monthly'
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const calculateProgress = (remaining, total) => {
    if (!total || total === 0) return 0;
    return ((total - remaining) / total) * 100;
  };

  const progress = calculateProgress(
    parseFloat(financing.remaining_balance || 0),
    parseFloat(financing.loan_amount || 0)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Financing Details</h2>
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
                <span className="detail-value"><strong>{financing.vehicle?.vin || 'N/A'}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {financing.vehicle?.vehicle_model?.manufacturer?.name} {financing.vehicle?.vehicle_model?.name} {financing.vehicle?.year}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Financing Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Financing Type</span>
                {isEditing ? (
                  <select
                    name="financing_type"
                    value={formData.financing_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="loan">Loan</option>
                    <option value="lease">Lease</option>
                    <option value="cash">Cash</option>
                    <option value="trade_in">Trade-In</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className="badge badge-maintenance">
                      {financing.financing_type?.replace('_', ' ') || 'N/A'}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Lender Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="lender_name"
                    value={formData.lender_name}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Lender name"
                  />
                ) : (
                  <span className="detail-value">{financing.lender_name || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Account number"
                  />
                ) : (
                  <span className="detail-value">{financing.account_number || 'N/A'}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Loan Amount</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="loan_amount"
                    value={formData.loan_amount}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Loan amount"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    ${financing.loan_amount ? parseFloat(financing.loan_amount).toFixed(2) : '0.00'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Interest Rate</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Interest rate"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    {financing.interest_rate ? financing.interest_rate + '%' : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Monthly Payment</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="monthly_payment"
                    value={formData.monthly_payment}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Monthly payment"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    ${financing.monthly_payment ? parseFloat(financing.monthly_payment).toFixed(2) : '0.00'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Remaining Balance</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="remaining_balance"
                    value={formData.remaining_balance}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Remaining balance"
                    step="0.01"
                  />
                ) : (
                  <span className="detail-value">
                    ${financing.remaining_balance ? parseFloat(financing.remaining_balance).toFixed(2) : '0.00'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Start Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {financing.start_date ? new Date(financing.start_date).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">End Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {financing.end_date ? new Date(financing.end_date).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Payment Frequency</span>
                {isEditing ? (
                  <select
                    name="payment_frequency"
                    value={formData.payment_frequency}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                ) : (
                  <span className="detail-value">{financing.payment_frequency || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>

          {financing.loan_amount && financing.remaining_balance !== null && (
            <div className="detail-section">
              <h3>Payment Progress</h3>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Progress</span>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', height: '12px', position: 'relative' }}>
                      <div style={{ 
                        width: `${progress}%`, 
                        background: 'rgba(255, 255, 255, 0.3)', 
                        height: '100%', 
                        borderRadius: '4px' 
                      }}></div>
                    </div>
                    <span style={{ fontSize: '14px', opacity: 0.7, marginTop: '4px', display: 'block' }}>
                      {progress.toFixed(1)}% paid ({((parseFloat(financing.loan_amount) - parseFloat(financing.remaining_balance || 0))).toFixed(2)} of ${parseFloat(financing.loan_amount).toFixed(2)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancingDetail;

