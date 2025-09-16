// src/pages/JobDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Title, Text, Card, Stack, Group, Button, Progress, Table, Badge, Tabs,
    Alert, Loader, Center, Grid, Code, Tooltip, SegmentedControl
} from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

import ResultViewer from '../features/jobs/results/ResultViewer';
import TargetSummaryCard from '../features/jobs/summary/TargetSummaryCard';

const POLLING_INTERVAL = 5000; // 5 giây

// --- Các hàm Helper (Không thay đổi) ---
const getStatusColor = (status) => {
    switch (status) {
        case 'completed': return 'green';
        case 'running': return 'blue';
        case 'failed': return 'red';
        case 'cancelled': return 'grape';
        case 'submitted': return 'gray';
        default: return 'gray';
    }
};

const OptionsDisplay = ({ options }) => {
    if (!options || Object.keys(options).length === 0) {
        return <Text size="xs" c="dimmed">Mặc định</Text>;
    }
    const params = Object.entries(options).map(([key, value]) => `${key}: ${String(value)}`).join(', ');
    return (
        <Tooltip label={params} position="top-start" withArrow multiline w={250}>
            <Text size="xs" c="dimmed" truncate="end" style={{ maxWidth: 150 }}>{params}</Text>
        </Tooltip>
    );
};

// --- Component Chính (Đã được cập nhật) ---
function JobDetailPage() {
    // --- STATE MANAGEMENT ---
    const { jobId: workflowId } = useParams();
    const [viewMode, setViewMode] = useState('summary');
    const [statusData, setStatusData] = useState(null);
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    // --- THÊM MỚI: State để quản lý việc mở rộng hàng ---
    const [expandedGroup, setExpandedGroup] = useState(null);

    // --- LOGIC FETCH DỮ LIỆU (Không thay đổi) ---
    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch(`/api/workflows/${workflowId}/status`);
            if (!response.ok) throw new Error('Không thể tải trạng thái workflow.');
            const data = await response.json();
            setStatusData(data);
        } catch (e) {
            setError(e.message);
        }
    }, [workflowId]);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`/api/workflows/${workflowId}/summary`);
            if (!response.ok) throw new Error('Không thể tải dữ liệu tóm tắt.');
            const data = await response.json();
            setSummaryData(data);
        } catch (e) {
            setError(e.message);
        }
    }, [workflowId]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([fetchStatus(), fetchSummary()]);
            setLoading(false);
        };
        void fetchInitialData();
    }, [fetchStatus, fetchSummary]);

    useEffect(() => {
        const isJobRunning = statusData && !['completed', 'failed', 'cancelled'].includes(statusData.workflow.status);
        if (!isJobRunning) {
            return;
        }
        const intervalId = setInterval(() => {
            void fetchStatus();
        }, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, [statusData, fetchStatus]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        setError(null);
        await Promise.all([fetchStatus(), fetchSummary()]);
        setIsRefreshing(false);
    }, [fetchStatus, fetchSummary]);

    // --- RENDER LOGIC ---
    if (loading) return <Center><Loader size="lg" /></Center>;
    if (error && !statusData) return <Alert color="red" title="Lỗi nghiêm trọng">{error}</Alert>;
    if (!statusData) return <Text>Không có dữ liệu cho workflow này.</Text>;

    const { workflow, sub_jobs, progress } = statusData;

    // --- CẬP NHẬT: Logic gom nhóm sub-job ---
    const aggregatedJobs = sub_jobs.reduce((acc, job) => {
        if (!acc[job.tool]) {
            acc[job.tool] = {
                tool: job.tool,
                options: job.options,
                count: 0,
                completed: 0,
                failed: 0,
                running: 0,
                firstStep: job.step_order,
                subJobsInGroup: [] // Giữ lại danh sách các job con
            };
        }
        const group = acc[job.tool];
        group.count += 1;
        group.subJobsInGroup.push(job); // Thêm job con vào danh sách của nhóm
        if (job.status === 'completed') group.completed += 1;
        if (job.status === 'failed') group.failed += 1;
        if (job.status === 'running') group.running += 1;
        return acc;
    }, {});

    const groupedJobsForTable = Object.values(aggregatedJobs).sort((a, b) => a.firstStep - b.firstStep);

    // Logic cho Tabs (không đổi)
    const representativeJobs = [];
    const seenTools = new Set();
    sub_jobs.filter(job => job.status === 'completed').forEach(job => {
        if (!seenTools.has(job.tool)) {
            seenTools.add(job.tool);
            representativeJobs.push(job);
        }
    });

    return (
        <Stack gap="xl">
            {/* Header và các nút điều khiển */}
            <Group justify="space-between">
                <Title order={1}>Chi tiết Luồng quét</Title>
                <Group>
                    <Button
                        leftSection={<IconRefresh size={16} />}
                        onClick={handleRefresh}
                        loading={isRefreshing}
                        variant="default"
                    >
                        Làm mới
                    </Button>
                    <Button component={Link} to="/" variant="light">
                        Quay lại Dashboard
                    </Button>
                </Group>
            </Group>

            {error && <Alert color="orange" title="Cảnh báo" icon={<IconAlertCircle />}>Không thể cập nhật dữ liệu mới nhất. Lỗi: {error}</Alert>}

            {/* Card tổng quan */}
            <Card withBorder p="md" radius="md">
                <Title order={3} mb="sm">Tổng quan</Title>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text><b>ID:</b> <Code>{workflow.workflow_id}</Code></Text>
                        <Text mt="xs"><b>Mục tiêu:</b> {workflow?.targets?.join(', ') || 'Đang tải...'}</Text>
                        <Group gap="xs" mt="xs">
                            <Text component="span"><b>Trạng thái:</b></Text>
                            <Badge color={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text><b>VPN:</b> {workflow.vpn_assignment?.country?.toUpperCase() || 'N/A'} ({workflow.vpn_assignment?.hostname || 'N/A'})</Text>
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

            {viewMode === 'summary' && (
                <Stack>
                    {summaryData ? (
                        summaryData.summary.map(summary => (
                            <TargetSummaryCard key={summary.target} summary={summary} />
                        ))
                    ) : (
                        <Center><Loader /></Center>
                    )}
                </Stack>
            )}

            {viewMode === 'tool' && (
                <Stack gap="md">
                    {/* --- CẬP NHẬT: Bảng trạng thái các bước thực thi có thể mở rộng --- */}
                    <Card withBorder p="md" radius="md">
                        <Title order={4} mb="md">Các bước thực thi</Title>
                        <Table.ScrollContainer minWidth={500}>
                            <Table verticalSpacing="sm">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Công cụ</Table.Th>
                                        <Table.Th>Cấu hình</Table.Th>
                                        <Table.Th>Tiến trình</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {groupedJobsForTable.map(group => {
                                        const isExpanded = expandedGroup === group.tool;
                                        const progressPercent = group.count > 0 ? (group.completed / group.count) * 100 : 0;
                                        let overallStatus = 'completed';
                                        let statusColor = 'green';
                                        if (group.failed > 0) { overallStatus = 'failed'; statusColor = 'red'; }
                                        else if (group.running > 0 || group.completed < group.count) { overallStatus = 'running'; statusColor = 'blue'; }

                                        return (
                                            <React.Fragment key={group.tool}>
                                                {/* Hàng chính, có thể nhấp vào */}
                                                <Table.Tr
                                                    onClick={() => setExpandedGroup(isExpanded ? null : group.tool)}
                                                    style={{ cursor: 'pointer', backgroundColor: isExpanded ? 'var(--mantine-color-gray-0)' : 'transparent' }}
                                                >
                                                    <Table.Td>
                                                        <Text fw={500}>{group.tool}</Text>
                                                        <Text size="xs" c="dimmed">{group.count} tiến trình con</Text>
                                                    </Table.Td>
                                                    <Table.Td><OptionsDisplay options={group.options} /></Table.Td>
                                                    <Table.Td>
                                                        <Group>
                                                            <Progress value={progressPercent} style={{ flexGrow: 1 }} size="lg" radius="sm" />
                                                            <Tooltip label={`${group.completed} / ${group.count} hoàn thành`}>
                                                                <Badge color={statusColor} variant="light">{overallStatus}</Badge>
                                                            </Tooltip>
                                                        </Group>
                                                    </Table.Td>
                                                </Table.Tr>

                                                {/* Hàng chi tiết, chỉ hiển thị khi được mở rộng */}
                                                {isExpanded && (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={3} p="xs" pl="lg" bg="var(--mantine-color-gray-0)">
                                                            <Stack gap="xs">
                                                                {group.subJobsInGroup.map(subJob => (
                                                                    <Group key={subJob.job_id} justify="space-between" wrap="nowrap">
                                                                        <Text size="xs" c="dimmed" ff="monospace" truncate="end">
                                                                            ID: ...{subJob.job_id.slice(-6)}
                                                                        </Text>
                                                                        <Badge variant="filled" size="sm" color={getStatusColor(subJob.status)}>
                                                                            {subJob.status}
                                                                        </Badge>
                                                                    </Group>
                                                                ))}
                                                            </Stack>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Card>

                    {/* Các Tab kết quả chi tiết (Không thay đổi) */}
                    <Card withBorder p="md" radius="md">
                        <Title order={4} mb="md">Kết quả chi tiết</Title>
                        {representativeJobs.length > 0 ? (
                            <Tabs defaultValue={representativeJobs[0].tool}>
                                <Tabs.List>
                                    {representativeJobs.map(job => (
                                        <Tabs.Tab key={job.job_id} value={job.tool}>{job.tool}</Tabs.Tab>
                                    ))}
                                </Tabs.List>
                                {representativeJobs.map(job => (
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