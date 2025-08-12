import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Text, Card, Stack, Group, Button, Progress, Table, Badge, Tabs, Alert } from '@mantine/core';
import { mockJobDetails } from '../mockData'; // Import dữ liệu giả

// Import các component con
import PortScanResultsTable from '../features/jobs/results/PortScanResultsTable';
import DnsResultsList from '../features/jobs/results/DnsResultsList';

// Hàm render kết quả chuyên biệt
const renderResults = (subJob) => {
    if (!subJob.results || subJob.results.length === 0) {
        return <Text c="dimmed">Không có kết quả nào được tìm thấy.</Text>;
    }
    switch (subJob.tool) {
        case 'port-scan':
            return <PortScanResultsTable data={subJob.results} />;
        case 'dns-lookup':
            return <DnsResultsList data={subJob.results} />;
        // Thêm các case khác cho nuclei-scan, httpx-scan ở đây
        default:
            return <pre>{JSON.stringify(subJob.results, null, 2)}</pre>;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'completed': return 'green';
        case 'running': return 'blue';
        case 'failed': return 'red';
        case 'submitted': return 'gray';
        default: return 'gray';
    }
};

function JobDetailPage() {
    const { jobId } = useParams(); // Trong demo, chúng ta không dùng ID này để fetch
    const jobDetails = mockJobDetails; // Sử dụng dữ liệu giả

    const completedSubJobs = jobDetails.sub_jobs.filter(job => job.status === 'completed');

    return (
        <Stack gap="xl">
            <Group justify="space-between">
                <Title order={1}>Chi tiết Luồng quét</Title>
                <Button component={Link} to="/" variant="light">Quay lại Dashboard</Button>
            </Group>

            {/* Thẻ thông tin tổng quan */}
            <Card withBorder p="md" radius="md">
                <Text><b>ID:</b> <Text span ff="monospace">{jobDetails.workflow.workflow_id}</Text></Text>
                <Text mt="xs"><b>Mục tiêu:</b> {jobDetails.workflow.targets.join(', ')}</Text>
                <Text mt="xs"><b>Trạng thái tổng:</b> <Badge color={getStatusColor(jobDetails.workflow.status)}>{jobDetails.workflow.status}</Badge></Text>
                <Text mt="lg"><b>Tiến trình tổng:</b></Text>
                <Progress.Root size="xl">
                    <Progress.Section value={jobDetails.progress.percentage} animated>
                        <Progress.Label>{jobDetails.progress.percentage}%</Progress.Label>
                    </Progress.Section>
                </Progress.Root>
            </Card>

            {/* Bảng trạng thái các bước con */}
            <Card withBorder p="md" radius="md">
                <Title order={4} mb="md">Các bước thực thi</Title>
                <Table>
                    <Table.Thead><Table.Tr><Table.Th>Bước</Table.Th><Table.Th>Công cụ</Table.Th><Table.Th>Trạng thái</Table.Th></Table.Tr></Table.Thead>
                    <Table.Tbody>
                        {jobDetails.sub_jobs.map(job => (
                            <Table.Tr key={job.job_id}>
                                <Table.Td>{job.step_order}</Table.Td>
                                <Table.Td>{job.tool}</Table.Td>
                                <Table.Td><Badge color={getStatusColor(job.status)}>{job.status}</Badge></Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Card>

            {/* Các Tab hiển thị kết quả chi tiết */}
            <Card withBorder p="md" radius="md">
                <Title order={4} mb="md">Kết quả chi tiết</Title>
                {completedSubJobs.length > 0 ? (
                    <Tabs defaultValue={completedSubJobs[0].tool}>
                        <Tabs.List>
                            {completedSubJobs.map(job => (
                                <Tabs.Tab key={job.job_id} value={job.tool}>
                                    {job.tool} ({job.results.length})
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                        {completedSubJobs.map(job => (
                            <Tabs.Panel key={job.job_id} value={job.tool} pt="md">
                                {renderResults(job)}
                            </Tabs.Panel>
                        ))}
                    </Tabs>
                ) : (
                    <Text c="dimmed">Chưa có bước nào hoàn thành để hiển thị kết quả.</Text>
                )}
            </Card>
        </Stack>
    );
}

export default JobDetailPage;