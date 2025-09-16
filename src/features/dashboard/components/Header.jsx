// src/features/dashboard/components/Header.jsx
import React from 'react';
import { Group, Title, Text, Button, Paper, Image } from '@mantine/core';
import { useUiStore } from '../../../stores/uiStore'; // Import store

function Header() {
    const openWorkflowModal = useUiStore((state) => state.openWorkflowModal);

    return (
        <Paper shadow="xs" p="md" radius="md" withBorder style={{ backgroundColor: '#F8F9FA' }}>
            <Group justify="space-between">
                <Group>
                    <Image src="/logo_insectlab.jpg" h={40} w="auto" />
                    <div>
                        <Title order={3}>The Scanner</Title>
                        <Text size="sm" c="dimmed">Dashboard giám sát và điều khiển</Text>
                    </div>
                </Group>
                <Group>
                    <Button onClick={() => openWorkflowModal()}>
                        + Tạo Luồng Quét Mới
                    </Button>
                </Group>
            </Group>
        </Paper>
    );
}

export default Header;