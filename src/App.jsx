// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mantine/core';
import Dashboard from './features/dashboard/Dashboard';
import IpPoolPage from './pages/IpPoolPage';
import VpnManagementPage from './pages/VpnManagementPage';
import SystemStatusPage from './pages/SystemStatusPage';
import JobDetailPage from './pages/JobDetailPage'; // Thêm dòng import



function App() {
    return (
        <Container size="xl" py="xl">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pool" element={<IpPoolPage />} />
                <Route path="/vpns" element={<VpnManagementPage />} />
                <Route path="/status" element={<SystemStatusPage />} />
                <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            </Routes>
        </Container>
    );
}

export default App;


