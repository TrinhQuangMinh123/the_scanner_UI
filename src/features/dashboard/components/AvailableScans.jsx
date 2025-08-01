// src/features/dashboard/components/AvailableScans.jsx
import React from 'react';
import { Stack, Button, Text } from '@mantine/core';
import { scanTemplates } from '../../../scanTemplates';

function AvailableScans({ onAddScan }) {
    return (
        <Stack>
            <Text fw={500}>Các loại scan có sẵn</Text>
            {scanTemplates.map(template => (
                <Button
                    key={template.id}
                    variant="outline"
                    onClick={() => onAddScan(template.id)}
                >
                    {template.name}
                </Button>
            ))}
        </Stack>
    );
}

export default AvailableScans;