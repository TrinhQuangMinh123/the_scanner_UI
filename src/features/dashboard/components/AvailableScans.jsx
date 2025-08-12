// src/features/dashboard/components/AvailableScans.jsx
import React from 'react';
import { Stack, Button, Text } from '@mantine/core';
// Bỏ import tĩnh: import { scanTemplates } from '../../../scanTemplates';

// Component giờ nhận `scanTemplates` từ props
function AvailableScans({ onAddScan, scanTemplates = [] }) {
    return (
        <Stack>
            <Text fw={500}>Các loại scan có sẵn</Text>
            {scanTemplates.length > 0 ? (
                scanTemplates.map(template => (
                    <Button
                        key={template.id}
                        variant="outline"
                        onClick={() => onAddScan(template.id)}
                    >
                        {template.name}
                    </Button>
                ))
            ) : (
                <Text c="dimmed" size="sm">Đang tải cấu hình...</Text>
            )}
        </Stack>
    );
}

export default AvailableScans;