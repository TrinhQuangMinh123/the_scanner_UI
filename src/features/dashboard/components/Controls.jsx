// src/features/dashboard/components/Controls.jsx
import React, { useState } from 'react';
import { Card, Text, Slider, Button, Stack, Title, Divider, Group, Badge } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
// Import các icon mới từ thư viện @tabler/icons-react
import { IconScale, IconTargetArrow, IconShieldLock } from '@tabler/icons-react';

function Controls() {
    const [scannerCount, setScannerCount] = useState(50);
    const navigate = useNavigate();

    return (
        // 1. Cấu trúc Card thống nhất, tăng khoảng cách bên trong
        <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack gap="xl"> {/* Tăng khoảng cách giữa các mục */}
                <Title order={4}>Bảng điều khiển</Title>

                {/* 2. Cải thiện Mục "Điều Chỉnh Tài Nguyên" */}
                <Stack gap="xs">
                    <Group gap="sm">
                        <IconScale size={20} stroke={1.5} />
                        <Text fw={500}>Điều Chỉnh Tài Nguyên</Text>
                    </Group>
                    {/* Căn chỉnh label và giá trị bằng component Group */}
                    <Group justify="space-between" mt="xs">
                        <Text size="sm" c="dimmed">Số Scanner đồng thời:</Text>
                        <Badge size="lg">{scannerCount}</Badge>
                    </Group>
                    <Slider
                        value={scannerCount}
                        onChange={setScannerCount}
                        min={1}
                        max={200}
                        mt="xs"
                    />
                </Stack>

                <Divider />

                {/* 3. Cải thiện Mục "Quản lý" & Nút bấm nổi bật */}
                <Stack gap="xs">
                    <Group gap="sm">
                        <IconTargetArrow size={20} stroke={1.5} />
                        <Text fw={500}>Quản lý IP Pool</Text>
                    </Group>
                    {/* Đổi variant thành "light" để nút có màu nền nổi bật hơn */}
                    <Button onClick={() => navigate('/pool')} fullWidth mt="sm" variant="light">
                        Đi đến trang IP Pool
                    </Button>
                </Stack>

                <Divider />

                <Stack gap="xs">
                    <Group gap="sm">
                        <IconShieldLock size={20} stroke={1.5} />
                        <Text fw={500}>Quản lý VPN</Text>
                    </Group>
                    <Button onClick={() => navigate('/vpns')} fullWidth mt="sm" variant="light">
                        Đi đến trang VPN
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
}

export default Controls;