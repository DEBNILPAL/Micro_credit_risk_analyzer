import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import BorrowerPortal from './components/BorrowerPortal';
import BlockchainDashboard from './components/BlockchainDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MainApp />} />
        <Route path="/borrower" element={<BorrowerPortal />} />
        <Route path="/blockchain" element={<BlockchainDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
