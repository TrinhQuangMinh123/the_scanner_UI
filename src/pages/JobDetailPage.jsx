// src/pages/JobDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Text, Card, Stack, Group, Button, Progress, Table, Badge, Tabs, Alert, Loader, Center, Grid, Code, Tooltip, SegmentedControl } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

// Giả định các component con này đã được tạo và import
import ResultViewer from '../features/jobs/results/ResultViewer';
import TargetSummaryCard from '../features/jobs/summary/TargetSummaryCard';

const POLLING_INTERVAL = 5000; // 5 giây

// --- Helper Functions ---

const getStatusColor = (status) => {
    switch (status) {
        case 'completed': return 'green';
        case 'running': return 'blue';
        case 'failed': return 'red';
        case 'submitted': return 'gray';
        default: return 'gray';
    }
};

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


// --- Main Component ---

function JobDetailPage() {
    // === 1. STATE MANAGEMENT ===
    const { jobId: workflowId } = useParams();
    const [viewMode, setViewMode] = useState('summary'); // 'summary' hoặc 'tool'

    const [statusData, setStatusData] = useState(null);
    const [summaryData, setSummaryData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    // === 2. DATA FETCHING & POLLING ===
    useEffect(() => {
        const fetchStatusData = async () => {
            try {
                const response = await fetch(`/api/workflows/${workflowId}/status`);
                if (!response.ok) throw new Error('Không thể tải trạng thái workflow.');
                const data = await response.json();
                setStatusData(data);

                const finalStatus = ['completed', 'failed', 'cancelled'];
                if (finalStatus.includes(data.workflow.status)) {
                    clearInterval(intervalRef.current);
                }
            } catch (e) {
                setError(e.message);
                clearInterval(intervalRef.current);
            }
        };

        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Gọi cả status và summary lần đầu
                await Promise.all([
                    fetchStatusData(),
                    (async () => {
                        const summaryRes = await fetch(`/api/workflows/${workflowId}/summary`);
                        if (!summaryRes.ok) throw new Error('Không thể tải dữ liệu tóm tắt.');
                        const summary = await summaryRes.json();
                        setSummaryData(summary);
                    })()
                ]);
            } catch(e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        void fetchInitialData(); // Gọi lần đầu để lấy tất cả
        intervalRef.current = setInterval(fetchStatusData, POLLING_INTERVAL); // Sau đó chỉ polling status
        return () => clearInterval(intervalRef.current);
    }, [workflowId]);

    // === 3. RENDER LOGIC ===
    if (loading) return <Center><Loader size="lg" /></Center>;
    if (error) return <Alert color="red" title="Lỗi">{error}</Alert>;
    if (!statusData) return <Text>Không có dữ liệu cho workflow này.</Text>;

    // Dữ liệu chính cho UI sẽ lấy từ statusData
    const { workflow, sub_jobs, progress } = statusData;
    const completedSubJobs = sub_jobs.filter(job => job.status === 'completed');

    return (
        <Stack gap="xl">
            <Group justify="space-between">
                <Title order={1}>Chi tiết Luồng quét</Title>
                <Button component={Link} to="/" variant="light">Quay lại Dashboard</Button>
            </Group>

            {/* Thẻ thông tin tổng quan (dữ liệu từ statusData) */}
            <Card withBorder p="md" radius="md">
                <Title order={3} mb="sm">Tổng quan</Title>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text><b>ID:</b> <Code>{workflow.workflow_id}</Code></Text>
                        <Text mt="xs"><b>Mục tiêu:</b> {workflow?.targets?.join(', ') || 'Đang tải...'}</Text>
                        <Text mt="xs"><b>Chiến lược:</b> {workflow.strategy}</Text>
                        <Group gap="xs" mt="xs">
                            <Text component="span"><b>Trạng thái:</b></Text>
                            <Badge color={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                        </Group>
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

            {/* Nút chuyển đổi chế độ xem */}
            <SegmentedControl
                fullWidth
                value={viewMode}
                onChange={setViewMode}
                data={[
                    { label: 'Xem Tổng hợp theo Mục tiêu', value: 'summary' },
                    { label: 'Xem Chi tiết theo Công cụ', value: 'tool' },
                ]}
            />

            {/* Hiển thị có điều kiện dựa trên viewMode */}
            {viewMode === 'summary' && (
                <Stack>
                    {summaryData ? (
                        summaryData.summary.map(summary => ( // <-- Sửa lại thành .summary
                            <TargetSummaryCard key={summary.target} summary={summary} />
                        ))
                    ) : (
                        <Center><Loader /></Center>
                    )}
                </Stack>
            )}

            {viewMode === 'tool' && (
                <Stack gap="md">
                    {/* Bảng trạng thái các bước con */}
                    <Card withBorder p="md" radius="md">
                        <Title order={4} mb="md">Các bước thực thi</Title>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Bước</Table.Th>
                                    <Table.Th>Công cụ</Table.Th>
                                    <Table.Th>Cấu hình</Table.Th>
                                    <Table.Th>Trạng thái</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
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

                    {/* Các Tab kết quả chi tiết */}
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
            )}
        </Stack>
    );
}

export default JobDetailPage;