// src/features/dashboard/components/WorkflowRow.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Group, Button, Text, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';

// Hàm để lấy màu cho badge trạng thái
const getStatusColor = (status) => {
    switch (status) {
        case 'completed': return 'green';
        case 'running': return 'blue';
        case 'failed': return 'red';
        case 'submitted': return 'gray';
        default: return 'gray';
    }
};

function WorkflowRow({ workflow, onCancel }) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/jobs/${workflow.workflow_id}`);
    };

    // 2. Hàm xử lý hủy job
    const handleCancelJob = async (e) => {
        e.stopPropagation(); // Ngăn sự kiện click của hàng được kích hoạt

        const confirmed = window.confirm(`Bạn có chắc muốn hủy Job ID: ${job.job_id}?`);
        if (!confirmed) return;

        try {
            // API này cần được backend xác nhận
            const response = await fetch(`/api/scan_jobs/${job.job_id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Hủy job thất bại.');
            }
            notifications.show({ color: 'green', title: 'Thành công', message: 'Đã hủy job thành công.' });
            onJobDeleted(job.job_id); // Cập nhật lại UI ở component cha
        } catch (error) {
            notifications.show({ color: 'red', title: 'Lỗi', message: error.message });
        }
    };

    // Định dạng lại thời gian cho dễ đọc
    const formattedDate = new Date(workflow.created_at).toLocaleString('vi-VN');
    const progressText = `${workflow.completed_steps || 0}/${workflow.total_steps || 0}`;

    return (
        <Table.Tr onClick={handleNavigate} style={{ cursor: 'pointer' }}>
            <Table.Td>
                <Text ff="monospace" c="dimmed" size="xs">{workflow.workflow_id.split('-').pop()}</Text>
            </Table.Td>
            <Table.Td>
                <Text fw={500} truncate="end">{workflow.targets.join(', ')}</Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm">{workflow.strategy}</Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm" c="dimmed">{progressText}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={getStatusColor(workflow.status)}>{workflow.status}</Badge>
            </Table.Td>
            <Table.Td>
                <Text size="sm" c="dimmed">{formattedDate}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap="xs" justify="flex-end">
                    {/* 3. Gọi hàm `onCancel` từ prop khi nhấn nút */}
                    <Button
                        variant="light"
                        color="red"
                        size="compact-sm"
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn việc điều hướng trang
                            onCancel(workflow.workflow_id); // Gọi hàm của cha và truyền ID lên
                        }}
                    >
                        Hủy
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    );
}

export default WorkflowRow;