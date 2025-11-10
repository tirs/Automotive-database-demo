import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Components.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalOwners: 0,
    totalServices: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check environment variables.');
      }
      
      const [vehiclesResult, ownersResult, servicesResult] = await Promise.all([
        supabase.from('vehicle').select('id', { count: 'exact', head: true }),
        supabase.from('owner').select('id', { count: 'exact', head: true }),
        supabase.from('service_record').select('id, total_cost', { count: 'exact' })
      ]);

      if (vehiclesResult.error) throw vehiclesResult.error;
      if (ownersResult.error) throw ownersResult.error;
      if (servicesResult.error) throw servicesResult.error;

      const totalRevenue = servicesResult.data?.reduce((sum, record) => 
        sum + (parseFloat(record.total_cost) || 0), 0) || 0;

      setStats({
        totalVehicles: vehiclesResult.count || 0,
        totalOwners: ownersResult.count || 0,
        totalServices: servicesResult.count || 0,
        totalRevenue: totalRevenue.toFixed(2)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  // Detect deployment platform
  const isGitHubPages = window.location.pathname.startsWith('/Automotive-database-demo');
  const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.com');

  if (error) {
    return (
      <div className="glass-container">
        <div className="error">
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          {error.includes('environment variables') && (
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <p><strong>Missing Environment Variables</strong></p>
              <p>Please set the following environment variables:</p>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <li>REACT_APP_SUPABASE_URL</li>
                <li>REACT_APP_SUPABASE_ANON_KEY</li>
              </ul>
              {isGitHubPages && (
                <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>For GitHub Pages:</p>
                  <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                    <li>Go to your GitHub repository</li>
                    <li>Click <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong></li>
                    <li>Add the following secrets:
                      <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                        <li><code>REACT_APP_SUPABASE_URL</code></li>
                        <li><code>REACT_APP_SUPABASE_ANON_KEY</code></li>
                      </ul>
                    </li>
                    <li>Push a new commit to trigger a rebuild</li>
                  </ol>
                </div>
              )}
              {isNetlify && (
                <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>For Netlify:</p>
                  <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.8' }}>
                    Go to: <strong>Netlify Dashboard</strong> → <strong>Site Settings</strong> → <strong>Environment Variables</strong>
                  </p>
                </div>
              )}
              {!isGitHubPages && !isNetlify && (
                <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.8' }}>
                    Set these as environment variables in your deployment platform's settings.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles
    },
    {
      title: 'Total Owners',
      value: stats.totalOwners
    },
    {
      title: 'Service Records',
      value: stats.totalServices
    },
    {
      title: 'Total Revenue',
      value: '$' + stats.totalRevenue
    }
  ];

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your automotive database</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card glass-container">
            <div className="stat-card-content">
              <div className="stat-info">
                <h3 className="stat-title">{card.title}</h3>
                <div className="stat-value">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-container">
        <h2 className="section-title">Quick Overview</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Database Status</span>
            <span className="info-value status-active">Active</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Updated</span>
            <span className="info-value">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">System Health</span>
            <span className="info-value status-active">Healthy</span>
          </div>
        </div>
        <p className="info-text">
          This dashboard provides a comprehensive overview of your automotive database.
          Navigate through the sidebar to explore vehicles, owners, and service records in detail.
        </p>
      </div>
    </>
  );
}

export default Dashboard;

