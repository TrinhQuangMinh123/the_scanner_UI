// src/features/jobs/results/HttpxResultsTable.jsx
import React from 'react';
import { Table, Badge, Text, Anchor, Group } from '@mantine/core';

// Hàm helper để chọn màu cho status code
const getStatusCodeColor = (statusCode) => {
    if (statusCode >= 500) return 'red';
    if (statusCode >= 400) return 'orange';
    if (statusCode >= 300) return 'blue';
    if (statusCode >= 200) return 'green';
    return 'gray';
};

function HttpxResultsTable({ data }) {
    const rows = data.map((item, index) => (
        <Table.Tr key={item.url || index}>
            <Table.Td>
                <Anchor href={item.url} target="_blank" size="sm">{item.url}</Anchor>
            </Table.Td>
            <Table.Td>
                <Badge color={getStatusCodeColor(item.status_code)}>
                    {item.status_code}
                </Badge>
            </Table.Td>
            <Table.Td>{item.title}</Table.Td>
            <Table.Td>
                {/* Hiển thị danh sách công nghệ dưới dạng các Badge */}
                {item.tech && item.tech.length > 0 && (
                    <Group gap="xs">
                        {item.tech.map(t => <Badge key={t} variant="light">{t}</Badge>)}
                    </Group>
                )}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>URL</Table.Th>
                    <Table.Th>Status Code</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Technologies</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}

export default HttpxResultsTable;