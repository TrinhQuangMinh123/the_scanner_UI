// src/pages/JobDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Text, Card, Stack, Group, Button, Progress, Table, Badge, Tabs, Alert, Loader, Center, Code, Tooltip, Grid } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import ResultViewer from '../features/jobs/results/ResultViewer';

const POLLING_INTERVAL = 5000; // 5 giây

const getStatusColor = (status) => { /* ... hàm lấy màu ... */ };

// Component mới để hiển thị chi tiết cấu hình
const OptionsDisplay = ({ options }) => {
    if (!options || Object.keys(options).length === 0) {
        return <Text size="xs" c="dimmed">Mặc định</Text>;
    }
    const params = Object.entries(options).map(([key, value]) => `${key}: ${value}`).join(', ');
    return (
        <Tooltip label={params} position="top-start" withArrow>
            <Text size="xs" c="dimmed" truncate="end" style={{ maxWidth: 150 }}>{params}</Text>
        </Tooltip>
    );
};

function JobDetailPage() {
    const { jobId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/workflows/${jobId}`);
                if (!response.ok) throw new Error(`Không tìm thấy workflow hoặc có lỗi xảy ra.`);
                const data = await response.json();
                setJobDetails(data);
                const finalStatus = ['completed', 'failed', 'cancelled'];
                if (finalStatus.includes(data.workflow.status)) {
                    clearInterval(intervalRef.current);
                }
            } catch (e) {
                setError(e.message);
                clearInterval(intervalRef.current);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
        intervalRef.current = setInterval(fetchData, POLLING_INTERVAL);
        return () => clearInterval(intervalRef.current);
    }, [jobId]);

    if (loading) return <Center><Loader size="lg" /></Center>;
    if (error) return <Alert color="red" title="Lỗi">{error}</Alert>;
    if (!jobDetails) return <Text>Không có dữ liệu cho job này.</Text>;

    const { workflow, sub_jobs, progress } = jobDetails;
    const completedSubJobs = sub_jobs.filter(job => job.status === 'completed');

    return (
        <Stack gap="xl">
            <Group justify="space-between">
                <Title order={1}>Chi tiết Luồng quét</Title>
                <Button component={Link} to="/" variant="light">Quay lại Dashboard</Button>
            </Group>

            {/* Cập nhật Thẻ thông tin tổng quan */}
            <Card withBorder p="md" radius="md">
                <Title order={3} mb="sm">Tổng quan</Title>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text><b>ID:</b> <Code>{workflow.workflow_id}</Code></Text>
                        <Text mt="xs"><b>Mục tiêu:</b> {workflow.targets.join(', ')}</Text>
                        <Text mt="xs"><b>Chiến lược:</b> {workflow.strategy}</Text>
                        <Text mt="xs"><b>Trạng thái:</b> <Badge color={getStatusColor(workflow.status)}>{workflow.status}</Badge></Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text><b>VPN:</b> {workflow.vpn_assignment?.country || 'N/A'} ({workflow.vpn_assignment?.hostname})</Text>
                        <Text mt="xs"><b>Thời gian tạo:</b> {new Date(workflow.created_at).toLocaleString('vi-VN')}</Text>
                        <Text mt="xs"><b>Cập nhật lần cuối:</b> {new Date(workflow.updated_at).toLocaleString('vi-VN')}</Text>
                    </Grid.Col>
                </Grid>
                <Text mt="lg"><b>Tiến trình tổng ({progress.completed + progress.failed}/{progress.total}):</b></Text>
                <Progress.Root size="xl" mt="sm">
                    <Progress.Section value={progress.percentage} animated>
                        <Progress.Label>{progress.percentage.toFixed(1)}%</Progress.Label>
                    </Progress.Section>
                </Progress.Root>
            </Card>

            {/* Cập nhật Bảng trạng thái các bước con */}
            <Card withBorder p="md" radius="md">
                <Title order={4} mb="md">Các bước thực thi</Title>
                <Table>
                    <Table.Thead><Table.Tr><Table.Th>Bước</Table.Th><Table.Th>Công cụ</Table.Th><Table.Th>Cấu hình</Table.Th><Table.Th>Trạng thái</Table.Th></Table.Tr></Table.Thead>
                    <Table.Tbody>
                        {sub_jobs.map(job => (
                            <Table.Tr key={job.job_id}>
                                <Table.Td>{job.step_order}</Table.Td>
                                <Table.Td>{job.tool}</Table.Td>
                                <Table.Td><OptionsDisplay options={job.options} /></Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Badge color={getStatusColor(job.status)}>{job.status}</Badge>
                                        {job.error_message &&
                                            <Tooltip label={job.error_message} withArrow multiline w={300}>
                                                <IconAlertCircle size={16} color="red" />
                                            </Tooltip>
                                        }
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Card>

            {/* Phần Tab kết quả không thay đổi logic */}
            <Card withBorder p="md" radius="md">
                <Title order={4} mb="md">Kết quả chi tiết</Title>
                {completedSubJobs.length > 0 ? (
                    <Tabs defaultValue={completedSubJobs[0].tool}>
                        <Tabs.List>
                            {completedSubJobs.map(job => (
                                <Tabs.Tab key={job.job_id} value={job.tool}>{job.tool}</Tabs.Tab>
                            ))}
                        </Tabs.List>
                        {completedSubJobs.map(job => (
                            <Tabs.Panel key={job.job_id} value={job.tool} pt="md">
                                <ResultViewer subJob={job} />
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