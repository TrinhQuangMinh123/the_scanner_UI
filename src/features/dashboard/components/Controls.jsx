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
                {/* ... phần Slider giữ nguyên ... */}
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={500}>Quản lý IP Pool 🎯</Text>
                <Text size="sm" c="dimmed" mt="xs">
                    Xem, thêm hoặc xóa các mục tiêu cần quét.
                </Text>
                <Button onClick={handleNavigate} fullWidth mt="md" variant="light">
                    Đi đến trang quản lý
                </Button>
            </Card>
        </Stack>
    );
}

export default Controls;