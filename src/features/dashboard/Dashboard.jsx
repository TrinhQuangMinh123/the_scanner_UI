// src/features/dashboard/Dashboard.jsx
import React from 'react';
import { Stack, Grid } from '@mantine/core';
import Header from './components/Header.jsx';
import VitalSigns from './components/VitalSigns.jsx';
import WorkflowsHistory from './components/WorkflowsHistory'; // Đổi tên import
import Controls from './components/Controls';

function Dashboard() {
    return (
        <Stack gap="xl">
            <Header />
            <VitalSigns />

            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <WorkflowsHistory /> {/* Đổi tên component */}
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Controls />
                </Grid.Col>
            </Grid>

        </Stack>
    );
}

export default Dashboard;