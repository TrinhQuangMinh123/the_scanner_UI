// src/features/dashboard/components/LiveJobs.jsx
import React from 'react';
import { Card, Title, Table } from '@mantine/core';
import JobRow from './JobRow';

const mockJobs = [
    { id: 'job-1a2b', target: '1.1.1.0/24', progress: 75, type: 'Nmap -sV' },
    { id: 'job-4f8e', target: 'example.com', progress: 40, type: 'Masscan' },
    { id: 'job-9c1d', target: '192.168.1.0/24', progress: 100, type: 'Zmap' },
    { id: 'job-b3d5', target: 'scanme.nmap.org', progress: 15, type: 'Nmap -A' },
];

function LiveJobs() {
    const rows = mockJobs.map(job => <JobRow key={job.id} job={job} />);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Tác Vụ Đang Chạy</Title>
            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Mục tiêu</Table.Th>
                        <Table.Th>Trạng thái</Table.Th>
                        <Table.Th>Loại Scan</Table.Th>
                        <Table.Th />
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Card>
    );
}

export default LiveJobs;