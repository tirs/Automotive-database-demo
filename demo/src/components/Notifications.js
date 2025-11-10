import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }

      const alerts = [];

      // Check expiring warranties
      const { data: warranties } = await supabase
        .from('warranty')
        .select(`
          *,
          vehicle:vehicle_id (vin)
        `)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .lte('end_date', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (warranties) {
        warranties.forEach(w => {
          const daysUntilExpiry = Math.ceil((new Date(w.end_date) - new Date()) / (1000 * 60 * 60 * 24));
          alerts.push({
            id: `warranty-${w.id}`,
            type: 'warning',
            title: 'Warranty Expiring Soon',
            message: `Warranty for vehicle ${w.vehicle?.vin || 'N/A'} expires in ${daysUntilExpiry} days`,
            date: w.end_date,
            priority: daysUntilExpiry <= 30 ? 'high' : 'medium'
          });
        });
      }

      // Check expiring insurance
      const { data: insurance } = await supabase
        .from('insurance_policy')
        .select(`
          *,
          vehicle:vehicle_id (vin)
        `)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .lte('end_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (insurance) {
        insurance.forEach(p => {
          const daysUntilExpiry = Math.ceil((new Date(p.end_date) - new Date()) / (1000 * 60 * 60 * 24));
          alerts.push({
            id: `insurance-${p.id}`,
            type: 'warning',
            title: 'Insurance Expiring Soon',
            message: `Insurance policy for vehicle ${p.vehicle?.vin || 'N/A'} expires in ${daysUntilExpiry} days`,
            date: p.end_date,
            priority: daysUntilExpiry <= 7 ? 'high' : 'medium'
          });
        });
      }

      // Check expiring inspections
      const { data: inspections } = await supabase
        .from('inspection')
        .select(`
          *,
          vehicle:vehicle_id (vin)
        `)
        .gte('expiration_date', new Date().toISOString().split('T')[0])
        .lte('expiration_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (inspections) {
        inspections.forEach(i => {
          const daysUntilExpiry = Math.ceil((new Date(i.expiration_date) - new Date()) / (1000 * 60 * 60 * 24));
          alerts.push({
            id: `inspection-${i.id}`,
            type: 'info',
            title: 'Inspection Expiring Soon',
            message: `${i.inspection_type} inspection for vehicle ${i.vehicle?.vin || 'N/A'} expires in ${daysUntilExpiry} days`,
            date: i.expiration_date,
            priority: daysUntilExpiry <= 7 ? 'high' : 'medium'
          });
        });
      }

      // Check open recalls
      const { data: recalls } = await supabase
        .from('recall')
        .select('*')
        .eq('status', 'open');

      if (recalls) {
        recalls.forEach(r => {
          alerts.push({
            id: `recall-${r.id}`,
            type: 'error',
            title: 'Open Recall',
            message: `Recall ${r.recall_number}: ${r.title}`,
            date: r.recall_date,
            priority: r.severity === 'critical' || r.severity === 'high' ? 'high' : 'medium'
          });
        });
      }

      // Check expired documents
      const { data: documents } = await supabase
        .from('vehicle_document')
        .select(`
          *,
          vehicle:vehicle_id (vin)
        `)
        .not('expiration_date', 'is', null)
        .lte('expiration_date', new Date().toISOString().split('T')[0]);

      if (documents) {
        documents.forEach(d => {
          alerts.push({
            id: `document-${d.id}`,
            type: 'warning',
            title: 'Document Expired',
            message: `${d.document_type} for vehicle ${d.vehicle?.vin || 'N/A'} has expired`,
            date: d.expiration_date,
            priority: 'medium'
          });
        });
      }

      // Sort by priority and date
      alerts.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.date) - new Date(b.date);
      });

      setNotifications(alerts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error': return '⚠';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '•';
    }
  };

  const getNotificationStyle = (type, priority) => {
    const baseStyle = {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid',
      marginBottom: '12px'
    };

    if (priority === 'high') {
      return {
        ...baseStyle,
        background: type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 165, 0, 0.1)',
        borderColor: type === 'error' ? 'rgba(255, 68, 68, 0.3)' : 'rgba(255, 165, 0, 0.3)'
      };
    }
    return {
      ...baseStyle,
      background: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(255, 255, 255, 0.1)'
    };
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading notifications...</div>
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
        <h1>Notifications & Alerts</h1>
        <p>Important alerts and reminders</p>
      </div>

      <div className="glass-container">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">No notifications at this time</div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <strong>Total Alerts: {notifications.length}</strong>
              <span style={{ marginLeft: '16px', opacity: 0.7 }}>
                High Priority: {notifications.filter(n => n.priority === 'high').length}
              </span>
            </div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={getNotificationStyle(notification.type, notification.priority)}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{getNotificationIcon(notification.type)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <strong>{notification.title}</strong>
                      {notification.priority === 'high' && (
                        <span className="badge badge-sold" style={{ fontSize: '10px' }}>HIGH PRIORITY</span>
                      )}
                    </div>
                    <div style={{ opacity: 0.8, marginBottom: '8px' }}>{notification.message}</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>
                      {notification.date ? new Date(notification.date).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Notifications;

