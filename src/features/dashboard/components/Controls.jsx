// src/features/dashboard/components/Controls.jsx
import React, { useState } from 'react';
import { Card, Text, Slider, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

function Controls() {
    const [scannerCount, setScannerCount] = useState(50);
    const navigate = useNavigate(); // 2. Khởi tạo hook

    const handleNavigate = () => {
        navigate('/pool'); // 3. Điều hướng đến trang /pool
    };

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
                <Button onClick={() => navigate('/pool')} fullWidth mt="md" variant="light">
                    Đi đến trang IP Pool
                </Button>
            </Card>

            {/* Thêm Card mới cho quản lý VPN */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={500}>Quản lý VPN 🛡️</Text>
                <Button onClick={() => navigate('/vpns')} fullWidth mt="md" variant="light">
                    Đi đến trang VPN
                </Button>
            </Card>
        </Stack>
    );
}

export default Controls;