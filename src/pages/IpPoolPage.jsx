// src/pages/IpPoolPage.jsx
// src/pages/IpPoolPage.jsx
import React, { useState } from 'react';
import { Title, Text, Button, Card, Table, Group, TextInput, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useIpPoolStore } from '../stores/ipPoolStore'; // 1. Import store

// Dữ liệu giả ban đầu
const initialIps = [
    { id: 1, target: '1.1.1.1' },
    { id: 2, target: 'example.com' },
    { id: 3, target: 'scanme.nmap.org' },
];

function IpPoolPage() {
    // 2. Lấy state và actions từ store
    const { ips, addIp, deleteIp } = useIpPoolStore();

    const [newIp, setNewIp] = useState('');

    const handleAddIp = () => {
        addIp(newIp); // Dùng action từ store
        setNewIp('');
    };

    const rows = ips.map((ip) => (
        <Table.Tr key={ip.id}>
            <Table.Td>{ip.target}</Table.Td>
            <Table.Td>
                <Group justify="flex-end">
                    <Button
                        color="red"
                        variant="light"
                        size="compact-sm"
                        onClick={() => deleteIp(ip.id)} // Dùng action từ store
                    >
                        Xóa
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack>
            <Group justify="space-between">
                <Title order={1}>Quản lý IP Pool</Title>
                <Button component={Link} to="/" variant="light">
                    Quay lại Dashboard
                </Button>
            </Group>

            <Text c="dimmed">Đây là nơi bạn quản lý (xem, thêm, xóa) các mục tiêu cần quét.</Text>

            {/* Khu vực thêm mục tiêu mới */}
            <Card withBorder p="md" radius="md">
                <Group>
                    <TextInput
                        placeholder="Nhập mục tiêu mới..."
                        value={newIp}
                        onChange={(event) => setNewIp(event.currentTarget.value)}
                        style={{ flex: 1 }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleAddIp();
                            }
                        }}
                    />
                    <Button onClick={handleAddIp}>Thêm</Button>
                </Group>
            </Card>
            <Card withBorder p={0} radius="md">
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Mục tiêu</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Card>
        </Stack>
    );
}

export default IpPoolPage;