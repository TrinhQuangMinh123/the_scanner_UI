// src/features/jobs/results/NucleiResultsTable.jsx
import React, { useState } from 'react';
import { Table, Badge, Text, Anchor, Group, Stack, Code } from '@mantine/core';

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
    // 1. State để theo dõi xem hàng nào đang được mở rộng
    const [expandedRow, setExpandedRow] = useState(null);

    // Hàm xử lý sự kiện khi người dùng nhấp vào một hàng
    const handleRowClick = (index) => {
        // Nếu nhấp vào hàng đang mở, thì đóng nó lại (set về null).
        // Nếu không, mở hàng mới bằng cách set index của nó.
        setExpandedRow(current => (current === index ? null : index));
    };

    // Xử lý trường hợp không có dữ liệu
    if (!data || data.length === 0) {
        return (
            <Table>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td colSpan={4} align="center">
                            <Text c="dimmed">Không tìm thấy lỗ hổng nào.</Text>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        );
    }

    const rows = data.map((item, index) => {
        const isExpanded = expandedRow === index; // Kiểm tra xem hàng hiện tại có đang được mở rộng không

        return (
            // 2. Dùng React.Fragment để nhóm 2 hàng (hàng chính và hàng chi tiết) lại với nhau
            <React.Fragment key={`${item['template-id']}-${index}`}>
                {/* Hàng chính chứa thông tin tóm tắt, có thể nhấp vào */}
                <Table.Tr
                    onClick={() => handleRowClick(index)}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: isExpanded ? 'var(--mantine-color-blue-light-hover)' : 'transparent'
                    }}
                >
                    <Table.Td>
                        <Text fw={500}>{item.name}</Text>
                        <Text size="xs" c="dimmed">{item['template-id']}</Text>
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
                        <Text size="sm" c="dimmed">{formatTimestamp(item.timestamp)}</Text>
                    </Table.Td>
                </Table.Tr>

                {/* 3. Hàng chi tiết, chỉ hiển thị khi `isExpanded` là true */}
                {isExpanded && (
                    <Table.Tr>
                        {/* Dùng colSpan để ô này chiếm toàn bộ chiều rộng của bảng */}
                        <Table.Td colSpan={4} p="md" bg="gray.0">
                            <Stack gap="xs">
                                <Text size="sm"><b>Mô tả:</b> {item.extra_fields.description}</Text>
                                <Text size="sm"><b>Tác giả:</b> {(item.extra_fields.author || []).join(', ')}</Text>
                                {item.extra_fields.reference && (
                                    <Text size="sm">
                                        <b>Tham khảo:</b> <Anchor href={item.extra_fields.reference[0]} target="_blank">{item.extra_fields.reference[0]}</Anchor>
                                    </Text>
                                )}
                                {item.extra_fields.classification?.['cwe-id'] && (
                                    <Text size="sm">
                                        <b>CWE:</b> <Code>{item.extra_fields.classification['cwe-id'].join(', ')}</Code>
                                    </Text>
                                )}
                                {item.tags && (
                                    <Group gap="xs" mt="xs">
                                        <b>Tags:</b>
                                        {item.tags.map(tag => <Badge key={tag} variant="outline" color="gray" size="sm">{tag}</Badge>)}
                                    </Group>
                                )}
                            </Stack>
                        </Table.Td>
                    </Table.Tr>
                )}
            </React.Fragment>
        );
    });

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Phát hiện</Table.Th>
                    <Table.Th>Mức độ</Table.Th>
                    <Table.Th>Mục tiêu</Table.Th>
                    <Table.Th>Thời gian</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}

export default NucleiResultsTable;