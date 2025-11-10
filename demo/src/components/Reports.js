import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Reports() {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reportTypes = [
    { value: 'service_history', label: 'Service History Report' },
    { value: 'cost_analysis', label: 'Cost Analysis Report' },
    { value: 'vehicle_lifecycle', label: 'Vehicle Lifecycle Report' },
    { value: 'owner_activity', label: 'Owner Activity Report' },
    { value: 'warranty_summary', label: 'Warranty Summary Report' },
    { value: 'insurance_summary', label: 'Insurance Summary Report' }
  ];

  const generateReport = async () => {
    if (!reportType) {
      setError('Please select a report type');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setReportData(null);

      if (!supabase) {
        throw new Error('Supabase client not initialized.');
      }

      let data = null;

      switch (reportType) {
        case 'service_history':
          const { data: services } = await supabase
            .from('service_record')
            .select(`
              *,
              vehicle:vehicle_id (vin, year),
              service_center:service_center_id (name),
              technician:technician_id (first_name, last_name)
            `)
            .order('service_date', { ascending: false })
            .limit(100);

          data = {
            title: 'Service History Report',
            generated: new Date().toLocaleString(),
            records: services || [],
            summary: {
              totalServices: services?.length || 0,
              totalCost: services?.reduce((sum, s) => sum + (parseFloat(s.total_cost) || 0), 0) || 0
            }
          };
          break;

        case 'cost_analysis':
          const { data: allServices } = await supabase
            .from('service_record')
            .select('total_cost, service_type, service_date');

          const { data: fuel } = await supabase
            .from('fuel_record')
            .select('total_cost, fuel_date');

          data = {
            title: 'Cost Analysis Report',
            generated: new Date().toLocaleString(),
            serviceCosts: allServices?.reduce((sum, s) => sum + (parseFloat(s.total_cost) || 0), 0) || 0,
            fuelCosts: fuel?.reduce((sum, f) => sum + (parseFloat(f.total_cost) || 0), 0) || 0,
            totalCost: (allServices?.reduce((sum, s) => sum + (parseFloat(s.total_cost) || 0), 0) || 0) +
                       (fuel?.reduce((sum, f) => sum + (parseFloat(f.total_cost) || 0), 0) || 0)
          };
          break;

        case 'vehicle_lifecycle':
          const { data: vehicles } = await supabase
            .from('vehicle')
            .select(`
              *,
              vehicle_model:vehicle_model_id (name),
              owner:owner_id (first_name, last_name)
            `);

          data = {
            title: 'Vehicle Lifecycle Report',
            generated: new Date().toLocaleString(),
            vehicles: vehicles || [],
            summary: {
              total: vehicles?.length || 0,
              active: vehicles?.filter(v => v.status === 'active').length || 0,
              sold: vehicles?.filter(v => v.status === 'sold').length || 0
            }
          };
          break;

        case 'warranty_summary':
          const { data: warranties } = await supabase
            .from('warranty')
            .select(`
              *,
              vehicle:vehicle_id (vin)
            `);

          data = {
            title: 'Warranty Summary Report',
            generated: new Date().toLocaleString(),
            warranties: warranties || [],
            summary: {
              total: warranties?.length || 0,
              expiringSoon: warranties?.filter(w => {
                if (!w.end_date) return false;
                const daysUntilExpiry = Math.ceil((new Date(w.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
              }).length || 0
            }
          };
          break;

        default:
          throw new Error('Report type not implemented');
      }

      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!reportData) return;
    
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>${reportData.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${reportData.title}</h1>
          <p>Generated: ${reportData.generated}</p>
          ${reportData.summary ? `
            <h2>Summary</h2>
            <ul>
              ${Object.entries(reportData.summary).map(([key, value]) => 
                `<li><strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}</li>`
              ).join('')}
            </ul>
          ` : ''}
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="page-header">
        <h1>Report Generation</h1>
        <p>Generate comprehensive reports from your database</p>
      </div>

      <div className="glass-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="detail-select"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            >
              <option value="">Select report type...</option>
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="detail-input"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="detail-input"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <button
            onClick={generateReport}
            disabled={loading || !reportType}
            style={{
              padding: '12px 24px',
              background: loading || !reportType ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading || !reportType ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {error && (
          <div className="error" style={{ marginBottom: '24px' }}>
            Error: {error}
          </div>
        )}

        {reportData && (
          <div className="glass-container" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0 }}>{reportData.title}</h2>
                <p style={{ margin: '8px 0 0 0', opacity: 0.7, fontSize: '14px' }}>
                  Generated: {reportData.generated}
                </p>
              </div>
              <button
                onClick={exportToPDF}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Export to PDF
              </button>
            </div>

            {reportData.summary && (
              <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>Summary</h3>
                <div className="info-grid">
                  {Object.entries(reportData.summary).map(([key, value]) => (
                    <div key={key} className="info-item">
                      <span className="info-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="info-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportData.records && reportData.records.length > 0 && (
              <div className="modern-table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      {Object.keys(reportData.records[0]).slice(0, 6).map(key => (
                        <th key={key}>{key.replace(/_/g, ' ')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.records.slice(0, 20).map((record, index) => (
                      <tr key={index}>
                        {Object.values(record).slice(0, 6).map((value, i) => (
                          <td key={i}>
                            {typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reportData.records.length > 20 && (
                  <div style={{ padding: '12px', textAlign: 'center', opacity: 0.7 }}>
                    Showing first 20 of {reportData.records.length} records
                  </div>
                )}
              </div>
            )}

            {reportData.serviceCosts !== undefined && (
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>Cost Breakdown</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Service Costs</span>
                    <span className="info-value">${parseFloat(reportData.serviceCosts).toFixed(2)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fuel Costs</span>
                    <span className="info-value">${parseFloat(reportData.fuelCosts).toFixed(2)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Costs</span>
                    <span className="info-value">${parseFloat(reportData.totalCost).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Reports;

