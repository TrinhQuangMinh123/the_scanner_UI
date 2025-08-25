// src/features/dashboard/components/Header.jsx
import React, { useState } from 'react';
import { Group, Title, Text, Button, Paper, Image, ActionIcon } from '@mantine/core';
import WorkflowBuilderModal from './WorkflowBuilderModal';

function Header() {
    const [modalOpened, setModalOpened] = useState(false);

    return (
        <>
            <WorkflowBuilderModal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
            />

            {/* 1. Vỏ bọc Header với nền sáng và bóng mờ */}
            <Paper shadow="xs" p="md" radius="md" withBorder style={{ backgroundColor: '#F8F9FA' }}>
                <Group justify="space-between">

                    {/* Khu vực bên trái (Thương hiệu) */}
                    <Group>
                        <Image
                            src="/logo_insectlab.jpg" // Trỏ đến file trong thư mục public
                            h={40}
                            w="auto"
                        />
                        <div>
                            {/* Tiêu đề được làm lớn và đậm hơn */}
                            <Title order={3}>The Scanner</Title>
                            <Text size="sm" c="dimmed">Dashboard giám sát và điều khiển</Text>
                        </div>
                    </Group>

                    {/* Khu vực bên phải (Hành động) */}
                    <Group>
                        <Button onClick={() => setModalOpened(true)}>
                            + Tạo Luồng Quét Mới
                        </Button>
                    </Group>

                </Group>
            </Paper>
        </>
    );
}

export default Header;