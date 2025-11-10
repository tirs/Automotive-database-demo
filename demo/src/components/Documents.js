import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DocumentDetail from './DocumentDetail';
import './Components.css';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      const { data, error } = await supabase
        .from('vehicle_document')
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
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpdate = () => {
    fetchDocuments();
    setSelectedDocument(null);
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

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading documents...</div>
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
        <h1>Vehicle Documents</h1>
        <p>Manage digital copies of vehicle documents</p>
      </div>

      <div className="glass-container">
        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">
              No documents found. Please run the sample_data_enhancements.sql script to populate the database.
            </div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Document Type</th>
                  <th>Document Name</th>
                  <th>Issue Date</th>
                  <th>Expiration Date</th>
                  <th>File Size</th>
                  <th>Uploaded</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr 
                    key={doc.id} 
                    onClick={() => setSelectedDocument(doc)}
                    className="clickable-row"
                  >
                    <td>
                      <strong>{doc.vehicle?.vin}</strong>
                      <br />
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {doc.vehicle?.vehicle_model?.manufacturer?.name} {doc.vehicle?.vehicle_model?.name} {doc.vehicle?.year}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-maintenance">
                        {doc.document_type?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td>
                      {doc.file_url ? (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {doc.document_name}
                        </a>
                      ) : (
                        doc.document_name
                      )}
                    </td>
                    <td>{doc.issue_date ? new Date(doc.issue_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {doc.expiration_date ? new Date(doc.expiration_date).toLocaleDateString() : 'N/A'}
                      {isExpiringSoon(doc.expiration_date) && (
                        <span style={{ color: 'rgba(255, 165, 0, 0.9)', marginLeft: '8px' }}>⚠ Expiring Soon</span>
                      )}
                      {isExpired(doc.expiration_date) && (
                        <span style={{ color: 'rgba(255, 68, 68, 0.9)', marginLeft: '8px' }}>✗ Expired</span>
                      )}
                    </td>
                    <td>{formatFileSize(doc.file_size)}</td>
                    <td>{doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {doc.expiration_date && isExpired(doc.expiration_date) ? (
                        <span className="badge badge-sold">Expired</span>
                      ) : doc.expiration_date && isExpiringSoon(doc.expiration_date) ? (
                        <span className="badge badge-repair">Expiring Soon</span>
                      ) : (
                        <span className="badge badge-active">Valid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDocument && (
        <DocumentDetail 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)}
          onUpdate={handleDocumentUpdate}
        />
      )}
    </>
  );
}

export default Documents;

