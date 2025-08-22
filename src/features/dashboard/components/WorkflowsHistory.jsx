// src/features/dashboard/components/WorkflowsHistory.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Title, Table, Loader, Alert, Center, Pagination, Group, ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import WorkflowRow from './WorkflowRow';

function WorkflowsHistory() {
    const [workflows, setWorkflows] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [activePage, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Gộp logic fetch vào một hàm có thể tái sử dụng, bọc trong useCallback để tối ưu
    const fetchWorkflows = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/workflows?page=${page}&page_size=10`);
            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }
            const data = await response.json();
            setWorkflows(data.workflows || data.results || []);
            setPagination(data.pagination || null);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []); // Mảng rỗng đảm bảo hàm này không bị tạo lại mỗi lần render

    // useEffect giờ chỉ gọi hàm fetch khi trang thay đổi
    useEffect(() => {
        void fetchWorkflows(activePage);
    }, [activePage, fetchWorkflows]);

    // Hàm xử lý việc làm mới dữ liệu
    const handleRefresh = () => {
        // Gọi lại API với đúng trang hiện tại
        void fetchWorkflows(activePage);
    };

    // Hàm xử lý việc hủy workflow
    const handleCancelWorkflow = async (workflowId) => {
        if (!window.confirm(`Bạn có chắc muốn hủy Workflow ID: ${workflowId}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/workflows/${workflowId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Hủy workflow thất bại.');
            }
            notifications.show({ color: 'green', title: 'Thành công', message: 'Đã hủy workflow.' });
            setWorkflows(current => current.filter(w => w.workflow_id !== workflowId));

        } catch (error) {
            notifications.show({ color: 'red', title: 'Lỗi', message: error.message });
        }
    };

    const rows = workflows.map(workflow => (
        <WorkflowRow
            key={workflow.workflow_id}
            workflow={workflow}
            onCancel={handleCancelWorkflow}
        />
    ));

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            {/* 2. Thêm nút Refresh vào tiêu đề */}
            <Group justify="space-between" mb="md">
                <Title order={4}>Lịch sử Luồng Quét</Title>
                <ActionIcon variant="default" onClick={handleRefresh} disabled={loading} aria-label="Làm mới danh sách">
                    <IconRefresh size={16} />
                </ActionIcon>
            </Group>

            {loading && <Center><Loader /></Center>}

            {error && (
                <Alert color="red" title="Lỗi" icon={<IconAlertCircle />}>
                    Không thể tải lịch sử. Lỗi: {error}
                </Alert>
            )}

            {!loading && !error && (
                <>
                    <Table.ScrollContainer minWidth={600}>
                        <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>ID</Table.Th>
                                    <Table.Th>Workflow ID</Table.Th>
                                    <Table.Th>Mục tiêu</Table.Th>
                                    <Table.Th>Tiến trình</Table.Th>
                                    <Table.Th>Trạng thái</Table.Th>
                                    <Table.Th>Thời gian tạo</Table.Th>
                                    <Table.Th />
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>

                    {pagination && pagination.total_pages > 1 && (
                        <Group justify="center" mt="md">
                            <Pagination total={pagination.total_pages} value={activePage} onChange={setPage} />
                        </Group>
                    )}
                </>
            )}
        </Card>
    );
}

export default WorkflowsHistory;