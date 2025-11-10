import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Vehicles from './components/Vehicles';
import Owners from './components/Owners';
import ServiceRecords from './components/ServiceRecords';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  // Use basename for GitHub Pages deployment
  const basename = process.env.PUBLIC_URL || '';
  
  return (
    <Router basename={basename}>
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

