// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // 1. Import Routes và Route
import { Container } from '@mantine/core';
import Dashboard from './features/dashboard/Dashboard';
import IpPoolPage from './pages/IpPoolPage'; // 2. Import trang mới

function App() {
    return (
        <Container size="xl" py="xl">
            <Routes> {/* 3. Định nghĩa các đường dẫn */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/pool" element={<IpPoolPage />} />
            </Routes>
        </Container>
    );
}

export default App;