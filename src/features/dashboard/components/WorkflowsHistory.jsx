// src/features/dashboard/components/WorkflowsHistory.jsx
import React, { useState, useEffect } from 'react';
import { Card, Title, Table, Loader, Alert, Center, Pagination, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import WorkflowRow from './WorkflowRow'; // Sẽ tạo ở bước 2

function WorkflowsHistory() {
    const [workflows, setWorkflows] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [activePage, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkflows = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. THAY ĐỔI API ENDPOINT
                const response = await fetch(`/api/workflows?page=${activePage}&page_size=10`);
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP: ${response.status}`);
                }
                const data = await response.json();
                // Giả sử response có key là "workflows" hoặc "results"
                setWorkflows(data.workflows || data.results || []);
                setPagination(data.pagination || null);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        void fetchWorkflows();
    }, [activePage]);

    //Định nghĩa hàm xử lý việc hủy workflow ở đây
    const handleCancelWorkflow = async (workflowId) => {
        // Hỏi xác nhận trước khi xóa
        if (!window.confirm(`Bạn có chắc muốn hủy Workflow ID: ${workflowId}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/workflows/${workflowId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Hủy workflow thất bại.');
            }
            notifications.show({ color: 'green', title: 'Thành công', message: 'Đã hủy workflow.' });

            // Cập nhật lại state để xóa workflow khỏi danh sách trên UI
            setWorkflows(current => current.filter(w => w.workflow_id !== workflowId));

        } catch (error) {
            notifications.show({ color: 'red', title: 'Lỗi', message: error.message });
        }
    };

    // Hàm để cập nhật UI sau khi xóa một workflow
    const handleWorkflowDeleted = (workflowId) => {
        setWorkflows(current => current.filter(w => w.workflow_id !== workflowId));
    };

    const rows = workflows.map(workflow => (
        <WorkflowRow
            key={workflow.workflow_id}
            workflow={workflow}
            onCancel={handleCancelWorkflow} // <--- THÊM PROP NÀY
        />
    ));

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Lịch sử Luồng Quét</Title>

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