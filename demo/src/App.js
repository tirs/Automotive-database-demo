import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Vehicles from './components/Vehicles';
import Owners from './components/Owners';
import ServiceRecords from './components/ServiceRecords';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import { trackPageView } from './analytics';
import './App.css';

// Component to track page views on route changes
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    try {
      trackPageView(location.pathname + location.search);
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  }, [location]);

  return null;
}

function App() {
  try {
    // Use basename for GitHub Pages deployment only
    // GitHub Pages uses subdirectory: /Automotive-database-demo
    // Netlify serves from root, so basename should be empty
    const getBasename = () => {
      // Check if we're on GitHub Pages (has subdirectory in pathname)
      if (window.location.pathname.startsWith('/Automotive-database-demo')) {
        return '/Automotive-database-demo';
      }
      // For Netlify or other root deployments, use empty basename
      return '';
    };
    
    const basename = getBasename();
    
    console.log('App component rendering with basename:', basename);
    
    return (
      <Router basename={basename}>
        <PageViewTracker />
        <div className="App">
          <Sidebar />
          <main className="App-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/service-records" element={<ServiceRecords />} />
          </Routes>
          </main>
        </div>
      </Router>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ 
        padding: '40px', 
        color: '#fff', 
        background: '#0a0e27', 
        minHeight: '100vh',
        fontFamily: 'system-ui'
      }}>
        <div style={{
          background: 'rgba(20, 27, 45, 0.6)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1 style={{ marginTop: 0 }}>Application Error</h1>
          <p>An error occurred while loading the application.</p>
          <pre style={{ 
            background: '#141b2d', 
            padding: '15px', 
            borderRadius: '8px', 
            overflow: 'auto',
            fontSize: '12px',
            marginTop: '20px'
          }}>
            {error.toString()}
            {error.stack && '\n\n' + error.stack}
          </pre>
        </div>
      </div>
    );
  }
}

export default App;

