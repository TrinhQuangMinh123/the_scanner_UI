// src/pages/JobDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Text, Card, Stack, Group, Button, Progress, Table, Badge, Tabs, Alert, Loader, Center } from '@mantine/core';
import ResultViewer from '../features/jobs/results/ResultViewer'; // 1. Import component mới

const POLLING_INTERVAL = 5000; // 5 giây

const getStatusColor = (status) => { /* ... hàm lấy màu ... */ };

function JobDetailPage() {
    const { jobId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dùng useRef để lưu ID của interval, giúp việc dọn dẹp hiệu quả hơn
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            // Không hiển thị loader cho các lần polling, chỉ cho lần tải đầu tiên
            // setLoading(true); // Bỏ dòng này
            try {
                const response = await fetch(`/api/workflows/${jobId}`);
                if (!response.ok) throw new Error(`Không tìm thấy job hoặc có lỗi xảy ra.`);
                const data = await response.json();
                setJobDetails(data);

                // 2. Dừng polling nếu luồng quét đã kết thúc
                const finalStatus = ['completed', 'failed', 'cancelled'];
                if (finalStatus.includes(data.workflow.status)) {
                    clearInterval(intervalRef.current);
                }
            } catch (e) {
                setError(e.message);
                clearInterval(intervalRef.current); // Dừng polling nếu có lỗi
            } finally {
                setLoading(false); // Chỉ tắt loader của lần tải đầu
            }
        };

        // 3. Polling: Gọi API lần đầu, và sau đó lặp lại
        void fetchData(); // Gọi ngay lần đầu
        intervalRef.current = setInterval(fetchData, POLLING_INTERVAL);

        // 4. Dọn dẹp interval khi component bị unmount
        return () => clearInterval(intervalRef.current);
    }, [jobId]);

    if (loading) return <Center><Loader size="lg" /></Center>;
    if (error) return <Alert color="red" title="Lỗi">{error}</Alert>;
    if (!jobDetails) return <Text>Không có dữ liệu cho job này.</Text>;

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
                                    {job.tool}
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                        {completedSubJobs.map(job => (
                            <Tabs.Panel key={job.job_id} value={job.tool} pt="md">
                                {/* 5. Sử dụng component mới ResultViewer */}
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