// src/App.jsx
import React from 'react';
import { Container } from '@mantine/core'; // <--- Dòng này bị thiếu
import Dashboard from './features/dashboard/Dashboard';

function App() {
    return (
        <Container size="xl" py="xl">
            <Dashboard />
        </Container>
    );
}

export default App;