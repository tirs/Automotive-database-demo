import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initGA } from './analytics';

// Initialize Google Analytics if measurement ID is provided
if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
  initGA(process.env.REACT_APP_GA_MEASUREMENT_ID);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

