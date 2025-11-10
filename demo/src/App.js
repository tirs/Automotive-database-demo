import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Vehicles from './components/Vehicles';
import Owners from './components/Owners';
import ServiceRecords from './components/ServiceRecords';
import Dashboard from './components/Dashboard';
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
  // Use basename for GitHub Pages deployment
  // Only use basename if PUBLIC_URL is set (GitHub Pages), not for Netlify
  const basename = process.env.PUBLIC_URL && process.env.PUBLIC_URL.startsWith('/') 
    ? process.env.PUBLIC_URL 
    : '';
  
  return (
    <Router basename={basename}>
      <PageViewTracker />
      <div className="App">
        <Sidebar />
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/service-records" element={<ServiceRecords />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

