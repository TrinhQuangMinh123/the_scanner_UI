// src/pages/IpPoolPage.jsx
import React, { useState } from 'react';
import { Title, Text, Button, Card, Table, Group, TextInput, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';

// Dữ liệu giả ban đầu
const initialIps = [
    { id: 1, target: '1.1.1.1' },
    { id: 2, target: 'example.com' },
    { id: 3, target: 'scanme.nmap.org' },
];

function IpPoolPage() {
    // State để lưu danh sách các mục tiêu
    const [ips, setIps] = useState(initialIps);
    // State để lưu giá trị của ô nhập liệu
    const [newIp, setNewIp] = useState('');

    // Hàm xử lý việc thêm mục tiêu mới
    const handleAddIp = () => {
        // Chỉ thêm nếu ô nhập liệu không rỗng
        if (newIp.trim() !== '') {
            const newItem = {
                id: Date.now(), // Dùng timestamp để tạo ID duy nhất
                target: newIp.trim(),
            };
            setIps([...ips, newItem]); // Thêm mục tiêu mới vào danh sách
            setNewIp(''); // Xóa trắng ô nhập liệu
        }
    };

    // Hàm xử lý việc xóa một mục tiêu
    const handleDeleteIp = (idToDelete) => {
        // Lọc ra các mục tiêu không có ID trùng với ID cần xóa
        const updatedIps = ips.filter(ip => ip.id !== idToDelete);
        setIps(updatedIps);
    };

    // Tạo các hàng cho bảng từ danh sách IPs
    const rows = ips.map((ip) => (
        <Table.Tr key={ip.id}>
            <Table.Td>{ip.target}</Table.Td>
            <Table.Td>
                <Group justify="flex-end">
                    <Button
                        color="red"
                        variant="light"
                        size="compact-sm"
                        onClick={() => handleDeleteIp(ip.id)}
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
                        // Cho phép nhấn Enter để thêm
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleAddIp();
                            }
                        }}
                    />
                    <Button onClick={handleAddIp}>Thêm</Button>
                </Group>
            </Card>

            {/* Bảng hiển thị danh sách mục tiêu */}
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