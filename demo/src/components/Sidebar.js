import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      exact: true
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
        <div className="logo">
          <div className="logo-text">
            <h1>AutoDB</h1>
            <p>Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-info">
          <p className="footer-text">Automotive Database</p>
          <p className="footer-version">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

