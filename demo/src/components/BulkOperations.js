import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function BulkOperations() {
  const [operation, setOperation] = useState('');
  const [entityType, setEntityType] = useState('vehicle');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const operations = [
    { value: 'export', label: 'Export to CSV' },
    { value: 'update_status', label: 'Bulk Update Status' },
    { value: 'delete', label: 'Bulk Delete' }
  ];

  const entityTypes = [
    { value: 'vehicle', label: 'Vehicles' },
    { value: 'owner', label: 'Owners' },
    { value: 'service_record', label: 'Service Records' }
  ];

  const handleBulkOperation = async () => {
    if (!operation) {
      setError('Please select an operation');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      if (!supabase) {
        throw new Error('Supabase client not initialized.');
      }

      let query = supabase.from(entityType).select('*');

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      if (operation === 'export') {
        // Convert to CSV
        if (data && data.length > 0) {
          const headers = Object.keys(data[0]);
          const csvRows = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
              const value = row[header];
              return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(','))
          ];
          const csvContent = csvRows.join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${entityType}_export_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          setResult(`Exported ${data.length} records to CSV`);
        } else {
          setResult('No records found to export');
        }
      } else if (operation === 'update_status' && filters.newStatus) {
        const ids = data.map(item => item.id);
        const { error: updateError } = await supabase
          .from(entityType)
          .update({ status: filters.newStatus })
          .in('id', ids);

        if (updateError) throw updateError;
        setResult(`Updated status for ${ids.length} records`);
      } else if (operation === 'delete') {
        const ids = data.map(item => item.id);
        const { error: deleteError } = await supabase
          .from(entityType)
          .delete()
          .in('id', ids);

        if (deleteError) throw deleteError;
        setResult(`Deleted ${ids.length} records`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Bulk Operations</h1>
        <p>Perform batch operations on multiple records</p>
      </div>

      <div className="glass-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Entity Type</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px'
              }}
            >
              {entityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Operation</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px'
              }}
            >
              <option value="">Select operation...</option>
              {operations.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>

          {operation === 'update_status' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>New Status</label>
              <select
                value={filters.newStatus || ''}
                onChange={(e) => setFilters({ ...filters, newStatus: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px'
                }}
              >
                <option value="">Select status...</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="totaled">Totaled</option>
                <option value="stolen">Stolen</option>
              </select>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Filter by Status (Optional)</label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px'
              }}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="totaled">Totaled</option>
              <option value="stolen">Stolen</option>
            </select>
          </div>

          <button
            onClick={handleBulkOperation}
            disabled={loading || !operation}
            style={{
              padding: '12px 24px',
              background: loading || !operation ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading || !operation ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Processing...' : 'Execute Operation'}
          </button>

          {error && (
            <div className="error" style={{ marginTop: '16px' }}>
              Error: {error}
            </div>
          )}

          {result && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              {result}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BulkOperations;

