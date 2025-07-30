// src/features/dashboard/components/Header.jsx
import React from 'react';
import { Group, Title, Text, Button } from '@mantine/core';

function Header() {
    const handleNewScanClick = () => {
        console.log('Open new scan modal...');
    };

    return (
        <Group justify="space-between">
            <div>
                <Title order={1}>The Scanner 📡</Title>
                <Text c="dimmed">Dashboard giám sát và điều khiển</Text>
            </div>
            <Button onClick={handleNewScanClick} size="sm">
                + Tạo Tác Vụ Mới
            </Button>
        </Group>
    );
}

export default Header;