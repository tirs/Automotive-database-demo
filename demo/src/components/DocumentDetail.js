import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DetailModal.css';

function DocumentDetail({ document, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    document_type: 'title',
    document_name: '',
    file_url: '',
    issue_date: '',
    expiration_date: '',
    notes: ''
  });

  useEffect(() => {
    if (document) {
      setFormData({
        document_type: document.document_type || 'title',
        document_name: document.document_name || '',
        file_url: document.file_url || '',
        issue_date: document.issue_date ? document.issue_date.split('T')[0] : '',
        expiration_date: document.expiration_date ? document.expiration_date.split('T')[0] : '',
        notes: document.notes || ''
      });
    }
  }, [document]);

  if (!document) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        .from('vehicle_document')
        .update({
          document_type: formData.document_type,
          document_name: formData.document_name || null,
          file_url: formData.file_url || null,
          issue_date: formData.issue_date || null,
          expiration_date: formData.expiration_date || null,
          notes: formData.notes || null
        })
        .eq('id', document.id);

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
    if (document) {
      setFormData({
        document_type: document.document_type || 'title',
        document_name: document.document_name || '',
        file_url: document.file_url || '',
        issue_date: document.issue_date ? document.issue_date.split('T')[0] : '',
        expiration_date: document.expiration_date ? document.expiration_date.split('T')[0] : '',
        notes: document.notes || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
          <h2>Document Details</h2>
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
                <span className="detail-value"><strong>{document.vehicle?.vin || 'N/A'}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {document.vehicle?.vehicle_model?.manufacturer?.name} {document.vehicle?.vehicle_model?.name} {document.vehicle?.year}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Document Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Document Type</span>
                {isEditing ? (
                  <select
                    name="document_type"
                    value={formData.document_type}
                    onChange={handleInputChange}
                    className="detail-select"
                  >
                    <option value="title">Title</option>
                    <option value="registration">Registration</option>
                    <option value="bill_of_sale">Bill of Sale</option>
                    <option value="insurance_card">Insurance Card</option>
                    <option value="inspection_certificate">Inspection Certificate</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span className="detail-value">
                    <span className="badge badge-maintenance">
                      {document.document_type?.replace('_', ' ') || 'N/A'}
                    </span>
                  </span>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Document Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="document_name"
                    value={formData.document_name}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Document name"
                  />
                ) : (
                  <span className="detail-value">
                    {document.file_url ? (
                      <a href={document.file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {document.document_name}
                      </a>
                    ) : (
                      document.document_name
                    )}
                  </span>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">File URL</span>
                {isEditing ? (
                  <input
                    type="url"
                    name="file_url"
                    value={formData.file_url}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="File URL"
                  />
                ) : (
                  <span className="detail-value">
                    {document.file_url ? (
                      <a href={document.file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {document.file_url}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">File Size</span>
                <span className="detail-value">{formatFileSize(document.file_size)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">MIME Type</span>
                <span className="detail-value">{document.mime_type || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Issue Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <span className="detail-value">
                    {document.issue_date ? new Date(document.issue_date).toLocaleDateString() : 'N/A'}
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
                    {document.expiration_date ? new Date(document.expiration_date).toLocaleDateString() : 'N/A'}
                    {isExpiringSoon(document.expiration_date) && (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 165, 0, 0.9)' }}>⚠ Expiring Soon</span>
                    )}
                    {isExpired(document.expiration_date) && (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 68, 68, 0.9)' }}>✗ Expired</span>
                    )}
                  </span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Uploaded By</span>
                <span className="detail-value">{document.uploaded_by || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Uploaded At</span>
                <span className="detail-value">
                  {document.uploaded_at ? new Date(document.uploaded_at).toLocaleString() : 'N/A'}
                </span>
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
                  <span className="detail-value">{document.notes || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentDetail;

