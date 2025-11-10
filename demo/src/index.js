import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Google Analytics is initialized via script tag in index.html

// Debug logging
console.log('App initializing...');
console.log('Environment check:', {
  hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
  hasSupabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
  publicUrl: process.env.PUBLIC_URL
});

// Error boundary for rendering
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: #fff; background: #0a0e27; min-height: 100vh; font-family: system-ui;"><h1>Application Error</h1><p>Root element not found in DOM.</p><p>Check if index.html has &lt;div id="root"&gt;&lt;/div&gt;</p></div>';
} else {
  const root = ReactDOM.createRoot(rootElement);

  try {
    console.log('Rendering app...');
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to render app:', error);
    root.render(
      <div style={{ padding: '20px', color: '#fff', background: '#0a0e27', minHeight: '100vh', fontFamily: 'system-ui' }}>
        <h1>Application Error</h1>
        <p>There was an error loading the application.</p>
        <p>Please check the browser console for details.</p>
        <pre style={{ background: '#141b2d', padding: '10px', borderRadius: '5px', overflow: 'auto', marginTop: '20px' }}>
          {error.toString()}
          {error.stack && '\n\n' + error.stack}
        </pre>
      </div>
    );
  }
}

