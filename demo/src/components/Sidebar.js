import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/smart-search',
      label: 'Smart Search',
      isNew: true
    },
    {
      path: '/notifications',
      label: 'Notifications'
    },
    {
      path: '/calendar',
      label: 'Calendar'
    },
    // AI & Automation Section
    {
      section: 'AI & Automation'
    },
    {
      path: '/predictive-maintenance',
      label: 'Predictive Maintenance',
      isNew: true
    },
    {
      path: '/vin-decoder',
      label: 'VIN Decoder',
      isNew: true
    },
    {
      path: '/workflows',
      label: 'Workflow Automation',
      isNew: true
    },
    {
      path: '/ai-insights',
      label: 'AI Insights',
      isNew: true
    },
    // Data Management Section
    {
      section: 'Data Management'
    },
    {
      path: '/vehicles',
      label: 'Vehicles'
    },
    {
      path: '/owners',
      label: 'Owners'
    },
    {
      path: '/service-records',
      label: 'Service Records'
    },
    {
      path: '/warranties',
      label: 'Warranties'
    },
    {
      path: '/insurance',
      label: 'Insurance'
    },
    {
      path: '/inspections',
      label: 'Inspections'
    },
    {
      path: '/accidents',
      label: 'Accidents'
    },
    {
      path: '/financing',
      label: 'Financing'
    },
    {
      path: '/recalls',
      label: 'Recalls'
    },
    {
      path: '/fuel-records',
      label: 'Fuel Records'
    },
    {
      path: '/documents',
      label: 'Documents'
    },
    {
      path: '/appraisals',
      label: 'Appraisals'
    },
    // Tools Section
    {
      section: 'Tools'
    },
    {
      path: '/bulk-operations',
      label: 'Bulk Operations'
    },
    {
      path: '/reports',
      label: 'Reports'
    },
    {
      path: '/search',
      label: 'Basic Search'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo">
          <div className="logo-text">
            <h1>AutoDB</h1>
            <p>Management System</p>
          </div>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item, index) => {
            if (item.section) {
              return (
                <li key={`section-${index}`} className="nav-section">
                  <span className="nav-section-label">{item.section}</span>
                </li>
              );
            }
            return (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                >
                  <span className="nav-label">{item.label}</span>
                  {item.isNew && <span className="nav-badge-new">AI</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/#demo" className="footer-cta">
          Request Demo
        </Link>
        <div className="footer-info">
          <p className="footer-text">Automotive Database</p>
          <p className="footer-version">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

