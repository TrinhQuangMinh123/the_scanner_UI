// src/features/jobs/results/NucleiResultsTable.jsx
import React from 'react';
import { Table, Badge, Text, Anchor, Group } from '@mantine/core';

// Bảng màu cho mức độ nghiêm trọng
const severityColors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'blue',
    info: 'gray',
};

// Hàm helper để định dạng lại timestamp
const formatTimestamp = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        return new Date(isoString).toLocaleString('vi-VN');
    } catch (e) {
        return 'Invalid Date';
    }
};

function NucleiResultsTable({ data }) {
    // Xử lý trường hợp không có dữ liệu
    if (!data || data.length === 0) {
        return (
            <Table>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td colSpan={5} align="center">
                            <Text c="dimmed">Không tìm thấy lỗ hổng nào.</Text>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        );
    }

    const rows = data.map((item, index) => (
        <Table.Tr key={`${item.template_id}-${index}`}>
            <Table.Td>
                <Text fw={500}>{item.name}</Text>
                <Text size="xs" c="dimmed">{item.template_id}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={severityColors[item.severity] || 'gray'} variant="light">
                    {item.severity}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Anchor href={item.matched_at} target="_blank" size="sm" lineClamp={1}>
                    {item.matched_at}
                </Anchor>
            </Table.Td>
            <Table.Td>
                {/* Hiển thị các tags dưới dạng các Badge nhỏ */}
                {item.tags && (
                    <Group gap="xs">
                        {item.tags.map(tag => <Badge key={tag} variant="outline" color="gray" size="sm">{tag}</Badge>)}
                    </Group>
                )}
            </Table.Td>
            <Table.Td>
                <Text size="sm" c="dimmed">{formatTimestamp(item.timestamp)}</Text>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Phát hiện</Table.Th>
                    <Table.Th>Mức độ</Table.Th>
                    <Table.Th>Mục tiêu</Table.Th>
                    <Table.Th>Tags</Table.Th>
                    <Table.Th>Thời gian</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}

export default NucleiResultsTable;