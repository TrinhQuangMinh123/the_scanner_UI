// src/features/dashboard/components/ResultsAnalysis.jsx
import React, { useState } from 'react'; // 1. Import useState
import { Card, Title, Table, Stack, Text, Badge, Group, Pagination } from '@mantine/core';
import FilterBar from './FilterBar';

const mockResults = [ // Giả sử chúng ta có nhiều dữ liệu hơn
    { ip: '1.1.1.1', port: 443, service: 'https', banner: 'Nginx 1.20.1', time: '2025-07-25 05:10' },
    { ip: '8.8.8.8', port: 53, service: 'domain', banner: 'dns.google', time: '2025-07-25 04:15' },
    // ... Thêm nhiều dữ liệu giả ở đây để đủ 97 dòng ...
    // Ví dụ, lặp lại 24 lần
    ...Array.from({ length: 95 }, (_, i) => ({ ip: `192.168.1.${i+1}`, port: 80, service: 'http', banner: 'Test Server', time: '2025-07-25 01:00' })),
];

const ITEMS_PER_PAGE = 10;

function ResultsAnalysis() {
    const [activePage, setPage] = useState(1); // 2. Tạo state cho trang hiện tại

    // 3. Tính toán dữ liệu cho trang hiện tại
    const totalPages = Math.ceil(mockResults.length / ITEMS_PER_PAGE);
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const itemsForCurrentPage = mockResults.slice(start, end);

    const rows = itemsForCurrentPage.map((result) => (
        <Table.Tr key={`${result.ip}-${result.port}`}>
            <Table.Td><Text fw={500}>{result.ip}</Text></Table.Td>
            <Table.Td><Badge color="red">{result.port}</Badge></Table.Td>
            <Table.Td>{result.service}</Table.Td>
            <Table.Td><Text truncate="end">{result.banner}</Text></Table.Td>
            <Table.Td>{result.time}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
                <Group justify="space-between">
                    <Title order={4}>Kết quả Scan</Title>
                    <FilterBar />
                </Group>
                <Table.ScrollContainer minWidth={600}>
                    <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>IP Address</Table.Th>
                                <Table.Th>Port</Table.Th>
                                <Table.Th>Service</Table.Th>
                                <Table.Th>Banner</Table.Th>
                                <Table.Th>Time</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>

                {/* 4. Sử dụng component Pagination của Mantine */}
                <Group justify="space-between">
                    <Text size="sm">
                        Hiển thị <Text component="span" fw={700}>{start + 1}</Text> đến <Text component="span" fw={700}>{Math.min(end, mockResults.length)}</Text> của <Text component="span" fw={700}>{mockResults.length}</Text> kết quả
                    </Text>
                    <Pagination total={totalPages} value={activePage} onChange={setPage} />
                </Group>
            </Stack>
        </Card>
    );
}

export default ResultsAnalysis;