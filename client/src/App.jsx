import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DigitalTwin from './pages/DigitalTwin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route 1: The Main Dashboard (Admin/Doctor View) */}
        <Route path="/" element={<Dashboard readOnly={false} />} />
        
        {/* Route 2: The 3D Digital Twin Page */}
        <Route path="/digital-twin" element={<DigitalTwin />} />

        {/* Route 3: The "Shared Link" (Remote View) 
            We use :patientId to make it look realistic, 
            but it renders the same Dashboard in Read-Only mode.
        */}
        <Route path="/monitor/:patientId" element={<Dashboard readOnly={true} />} />
      </Routes>
    </Router>
  );
}

export default App;