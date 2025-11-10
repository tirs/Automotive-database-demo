import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initGA } from './analytics';

// Initialize Google Analytics if measurement ID is provided
try {
  if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
    initGA(process.env.REACT_APP_GA_MEASUREMENT_ID);
  }
} catch (error) {
  console.warn('Failed to initialize Google Analytics:', error);
}

// Error boundary for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  root.render(
    <div style={{ padding: '20px', color: '#fff', background: '#0a0e27', minHeight: '100vh' }}>
      <h1>Application Error</h1>
      <p>There was an error loading the application.</p>
      <p>Please check the browser console for details.</p>
      <pre style={{ background: '#141b2d', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
        {error.toString()}
      </pre>
    </div>
  );
}

