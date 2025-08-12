// src/features/dashboard/components/LiveJobs.jsx
import React, { useState, useEffect } from 'react';
import { Card, Title, Table, Loader, Alert, Center, Pagination, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import JobRow from './JobRow';

function LiveJobs() {
    // 1. State để lưu dữ liệu, thông tin phân trang, trạng thái tải và lỗi
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [activePage, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect sẽ chạy mỗi khi `activePage` thay đổi
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                // Sử dụng API phân trang mà backend đã cung cấp
                const response = await fetch(`/api/scan_jobs?page=${activePage}&page_size=10`);
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP: ${response.status}`);
                }
                const data = await response.json();
                setJobs(data.results || []);
                setPagination(data.pagination || null);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        void fetchJobs();
    }, [activePage]); // Phụ thuộc vào activePage

    // Hàm để xử lý sau khi hủy một job
    const handleJobDeleted = (jobId) => {
        setJobs(currentJobs => currentJobs.filter(job => job.job_id !== jobId));
    };

    const rows = jobs.map(job => (
        <JobRow
            key={job.job_id}
            job={job}
            onJobDeleted={handleJobDeleted}
        />
    ));

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Lịch sử Luồng Quét</Title>

            {loading && <Center><Loader /></Center>}

            {error && (
                <Alert color="red" title="Lỗi" icon={<IconAlertCircle />}>
                    Không thể tải lịch sử các jobs. Lỗi: {error}
                </Alert>
            )}

            {!loading && !error && (
                <>
                    <Table.ScrollContainer minWidth={600}>
                        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Job ID</Table.Th>
                                    <Table.Th>Mục tiêu</Table.Th>
                                    <Table.Th>Công cụ</Table.Th>
                                    <Table.Th>Trạng thái</Table.Th>
                                    <Table.Th>VPN</Table.Th>
                                    <Table.Th>Thời gian tạo</Table.Th>
                                    <Table.Th />
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>

                    {/* 3. Thêm thanh điều khiển phân trang */}
                    {pagination && pagination.total_pages > 1 && (
                        <Group justify="center" mt="md">
                            <Pagination
                                total={pagination.total_pages}
                                value={activePage}
                                onChange={setPage}
                            />
                        </Group>
                    )}
                </>
            )}
        </Card>
    );
}

export default LiveJobs;