// src/features/dashboard/components/Header.jsx
import React, { useState } from 'react';
// Thêm Menu vào import
import { Group, Title, Text, Button, Menu } from '@mantine/core';
import WorkflowBuilderModal from './WorkflowBuilderModal';

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

                <Group>
                    {/* Menu mới cho tài liệu API */}
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Button variant="default">Tài liệu API</Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Interactive Documentation</Menu.Label>
                            {/* Các link này giờ sẽ hoạt động nhờ có proxy */}
                            <Menu.Item component="a" href="/docs" target="_blank">
                                Swagger UI
                            </Menu.Item>
                            <Menu.Item component="a" href="/redoc" target="_blank">
                                ReDoc
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    <Button onClick={() => setModalOpened(true)} size="sm">
                        + Tạo Luồng Quét Mới
                    </Button>
                </Group>
            </Group>
        </>
    );
}

export default Header;