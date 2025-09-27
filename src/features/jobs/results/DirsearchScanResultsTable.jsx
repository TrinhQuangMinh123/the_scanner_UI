// src/features/jobs/results/DirsearchScanResultsTable.jsx
import React from 'react';
import { Table, Badge, Text, Anchor } from '@mantine/core';

const getStatusCodeColor = (statusCode) => {
    if (!statusCode) return 'gray';
    if (statusCode >= 500) return 'red';
    if (statusCode >= 400) return 'orange';
    if (statusCode >= 300) return 'blue';
    if (statusCode >= 200) return 'green';
    return 'gray';
};

function DirsearchScanResultsTable({ data }) {
    // THAY ĐỔI: Trích xuất mảng kết quả thực tế từ dữ liệu lồng nhau
    const findings = data[0]?.scan_metadata?.dirsearch_results || [];

    const rows = findings.map((item, index) => (
        <Table.Tr key={item.url || index}>
            <Table.Td>
                <Anchor href={item.url} target="_blank" size="sm" lineClamp={1}>{item.url}</Anchor>
            </Table.Td>
            <Table.Td>
                <Badge color={getStatusCodeColor(item.status)} variant="light">
                    {item.status}
                </Badge>
            </Table.Td>
            <Table.Td>{item.size}</Table.Td>
            <Table.Td>
                {item.redirect_to ? (
                    <Anchor href={item.redirect_to} target="_blank" size="sm" c="dimmed" lineClamp={1}>
                        {item.redirect_to}
                    </Anchor>
                ) : (
                    <Text c="dimmed">-</Text>
                )}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Đường dẫn được phát hiện</Table.Th>
                    <Table.Th>Status Code</Table.Th>
                    <Table.Th>Kích thước</Table.Th>
                    <Table.Th>Chuyển hướng đến</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}

export default DirsearchScanResultsTable;