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

// --- Component Chính (Đã được tái cấu trúc) ---
function JobDetailPage() {
    // --- STATE MANAGEMENT ---
    const { jobId: workflowId } = useParams();
    const [viewMode, setViewMode] = useState('summary');
    const [statusData, setStatusData] = useState(null);
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // --- LOGIC FETCH DỮ LIỆU ---

    // Hàm fetch status, dùng cho cả polling và refresh
    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch(`/api/workflows/${workflowId}/status`);
            if (!response.ok) throw new Error('Không thể tải trạng thái workflow.');
            const data = await response.json();
            setStatusData(data);
        } catch (e) {
            setError(e.message);
            // Không set statusData về null để tránh giao diện bị mất đột ngột
        }
    }, [workflowId]);

    // Hàm fetch summary, dùng cho lần đầu và refresh
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

    // === HOOK 1: LẤY DỮ LIỆU BAN ĐẦU ===
    // Chỉ chạy một lần khi component được mount
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([fetchStatus(), fetchSummary()]);
            setLoading(false);
        };
        void fetchInitialData();
    }, [fetchStatus, fetchSummary]); // Phụ thuộc vào các hàm đã được useCallback

    // === HOOK 2: QUẢN LÝ POLLING TỰ ĐỘNG ===
    // Hook này sẽ chạy mỗi khi statusData thay đổi
    useEffect(() => {
        // Điều kiện để dừng polling
        const isJobRunning = statusData && !['completed', 'failed', 'cancelled'].includes(statusData.workflow.status);

        if (!isJobRunning) {
            return; // Dừng lại, không tạo interval mới
        }

        // Nếu job đang chạy, tạo một interval mới
        const intervalId = setInterval(() => {
            void fetchStatus();
        }, POLLING_INTERVAL);

        // Hàm cleanup: sẽ được gọi khi statusData thay đổi hoặc component unmount
        // Nó sẽ xóa interval cũ trước khi tạo cái mới (nếu cần)
        return () => clearInterval(intervalId);

    }, [statusData, fetchStatus]); // Phụ thuộc vào statusData và hàm fetchStatus

    // Hàm xử lý cho nút Refresh
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        setError(null);
        // Gọi lại cả hai API để có dữ liệu mới nhất
        await Promise.all([fetchStatus(), fetchSummary()]);
        setIsRefreshing(false);
    }, [fetchStatus, fetchSummary]);


    // --- RENDER LOGIC ---
    if (loading) return <Center><Loader size="lg" /></Center>;
    if (error && !statusData) return <Alert color="red" title="Lỗi nghiêm trọng">{error}</Alert>;
    if (!statusData) return <Text>Không có dữ liệu cho workflow này.</Text>;

    const { workflow, sub_jobs, progress } = statusData;
    const completedSubJobs = sub_jobs.filter(job => job.status === 'completed');

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

            {/* Thông báo lỗi không nghiêm trọng (khi fetch thất bại nhưng vẫn có dữ liệu cũ) */}
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

            {/* Hiển thị có điều kiện dựa trên viewMode */}
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
                    {/* Bảng trạng thái các bước con */}
                    <Card withBorder p="md" radius="md">
                        <Title order={4} mb="md">Các bước thực thi</Title>
                        <Table.ScrollContainer minWidth={500}>
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
                                                <Group gap="xs" wrap="nowrap">
                                                    <Badge color={getStatusColor(job.status)}>{job.status}</Badge>
                                                    {job.error_message &&
                                                        <Tooltip label={job.error_message} withArrow multiline w={300}>
                                                            <IconAlertCircle size={16} color="var(--mantine-color-red-6)" />
                                                        </Tooltip>
                                                    }
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
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