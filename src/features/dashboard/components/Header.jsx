// src/features/dashboard/components/Header.jsx
import React, { useState } from 'react';
import { Group, Title, Text, Button } from '@mantine/core';
import WorkflowBuilderModal from './WorkflowBuilderModal'; // Import component Modal mới

function Header() {
    const [modalOpened, setModalOpened] = useState(false);

    return (
        <>
            <WorkflowBuilderModal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
            />

            <Group justify="space-between">
                <div>
                    <Title order={1}>The Scanner 📡</Title>
                    <Text c="dimmed">Dashboard giám sát và điều khiển</Text>
                </div>
                <Button onClick={() => setModalOpened(true)} size="sm">
                    + Tạo Luồng Quét Mới
                </Button>
            </Group>
        </>
    );
}

export default Header;