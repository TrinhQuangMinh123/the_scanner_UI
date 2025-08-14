// src/features/dashboard/components/AvailableScans.jsx
import React from 'react';
import { Stack, Button, Text, Skeleton } from '@mantine/core';

// Component giờ nhận `isLoading` từ props
function AvailableScans({ scanTemplates, isLoading, onAddScan }) {
    return (
        <Stack>
            <Text fw={500}>Các loại scan có sẵn</Text>

            {/* Hiển thị Skeleton trong khi tải */}
            {isLoading && (
                <>
                    <Skeleton height={36} radius="sm" />
                    <Skeleton height={36} radius="sm" />
                    <Skeleton height={36} radius="sm" />
                </>
            )}

            {/* Hiển thị các nút bấm khi đã tải xong */}
            {!isLoading && scanTemplates.map(template => (
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