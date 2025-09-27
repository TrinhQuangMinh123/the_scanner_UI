// src/features/dashboard/Dashboard.jsx
import React from 'react';
import { Stack, Grid } from '@mantine/core';
import Header from './components/Header.jsx';
import VitalSigns from './components/VitalSigns.jsx';
import WorkflowsHistory from './components/WorkflowsHistory';
import Controls from './components/Controls';
import AiControls from './components/AiControls'; // 1. Import component mới
import WorkflowBuilderModal from './components/WorkflowBuilderModal';
import { useUiStore } from '../../stores/uiStore';

function Dashboard() {
    const { isWorkflowModalOpen, closeWorkflowModal } = useUiStore();

    return (
        <>
            <WorkflowBuilderModal opened={isWorkflowModalOpen} onClose={closeWorkflowModal} />
            <Stack gap="xl">
                <Header />
                <VitalSigns />
                <Grid>
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <WorkflowsHistory />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack>
                            <Controls />
                            <AiControls /> {/* 2. Thêm component vào đây */}
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Stack>
        </>
    );
}

export default Dashboard;