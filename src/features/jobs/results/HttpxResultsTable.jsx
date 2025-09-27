// src/features/jobs/results/HttpxResultsTable.jsx
import React from 'react';
import { Table, Badge, Anchor, Group } from '@mantine/core';

const getStatusCodeColor = (statusCode) => {
    if (statusCode >= 500) return 'red';
    if (statusCode >= 400) return 'orange';
    if (statusCode >= 300) return 'blue';
    if (statusCode >= 200) return 'green';
    return 'gray';
};

function HttpxResultsTable({ data }) {
    // THAY ĐỔI: Gom tất cả các kết quả từ các target khác nhau vào một mảng duy nhất
    const allHttpxFindings = data.flatMap(
        (targetResult) => targetResult.scan_metadata?.httpx_results || []
    );

    // Render bảng từ mảng đã được làm phẳng
    const rows = allHttpxFindings.map((item, index) => (
        <Table.Tr key={item.url || index}>
            <Table.Td>
                <Anchor href={item.url} target="_blank" size="sm" lineClamp={1}>{item.url}</Anchor>
            </Table.Td>
            <Table.Td>
                <Badge color={getStatusCodeColor(item.status_code)}>
                    {item.status_code}
                </Badge>
            </Table.Td>
            <Table.Td>{item.title}</Table.Td>
            <Table.Td>
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