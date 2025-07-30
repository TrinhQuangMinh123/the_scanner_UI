// src/features/dashboard/components/Controls.jsx
import React, { useState } from 'react';
import { Card, Text, Slider, Button, Stack } from '@mantine/core';

function Controls() {
    const [scannerCount, setScannerCount] = useState(50);

    return (
        <Stack>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={500}>Điều Chỉnh Tài Nguyên ⚖️</Text>
                <Text size="sm" c="dimmed" mt="xs">
                    Số Scanner đồng thời: <Text component="span" fw={700}>{scannerCount}</Text>
                </Text>
                <Slider
                    value={scannerCount}
                    onChange={setScannerCount}
                    min={1}
                    max={200}
                    mt="md"
                />
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={500}>Quản lý IP Pool 🎯</Text>
                <Text size="sm" c="dimmed" mt="xs">
                    Xem, thêm hoặc xóa các mục tiêu cần quét.
                </Text>
                <Button fullWidth mt="md" variant="light">
                    Đi đến trang quản lý
                </Button>
            </Card>
        </Stack>
    );
}

export default Controls;