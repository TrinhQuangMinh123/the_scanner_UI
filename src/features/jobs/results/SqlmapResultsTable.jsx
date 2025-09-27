// src/features/jobs/results/SqlmapResultsTable.jsx
import React from 'react';
import { Table, Text, Card, Title, Badge, Stack } from '@mantine/core';

function SqlmapResultsTable({ data }) {
    // Lấy thông tin từ kết quả đầu tiên (vì sqlmap thường có 1 kết quả tổng hợp)
    const summaryData = data[0]?.scan_metadata;

    if (!summaryData) {
        return <Text c="dimmed">Không có dữ liệu kết quả SQLMap.</Text>;
    }

    const vulnerabilities = summaryData.sqlmap_results || [];

    const rows = vulnerabilities.map((vuln, index) => (
        <Table.Tr key={index}>
            <Table.Td>{vuln.place}</Table.Td>
            <Table.Td>{vuln.parameter}</Table.Td>
            <Table.Td>
                <Badge color="red">{vuln.type}</Badge>
            </Table.Td>
            <Table.Td>
                <Text size="sm" ff="monospace">{vuln.title}</Text>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack>
            <Card withBorder p="sm" radius="md">
                <Group>
                    <Text>Số lỗ hổng phát hiện:</Text>
                    <Badge size="lg">{summaryData.total_vulnerabilities || 0}</Badge>
                    <Text ml="md">Số database tìm thấy:</Text>
                    <Badge size="lg">{summaryData.databases_found || 0}</Badge>
                </Group>
            </Card>

            <Title order={5} mt="md">Chi tiết Lỗ hổng SQL Injection</Title>

            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Vị trí (Place)</Table.Th>
                        <Table.Th>Tham số (Parameter)</Table.Th>
                        <Table.Th>Loại (Type)</Table.Th>
                        <Table.Th>Tiêu đề</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.length > 0 ? rows : (
                        <Table.Tr>
                            <Table.Td colSpan={4} ta="center">
                                <Text c="dimmed">Không tìm thấy lỗ hổng SQL Injection nào.</Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </Stack>
    );
}

export default SqlmapResultsTable;