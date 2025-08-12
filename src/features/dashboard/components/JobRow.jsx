// src/features/dashboard/components/JobRow.jsx
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

function JobRow({ job, onJobDeleted }) {
    const navigate = useNavigate();

    // 1. Hàm điều hướng đến trang chi tiết
    const handleNavigate = () => {
        navigate(`/jobs/${job.job_id}`);
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
    const formattedDate = new Date(job.created_at).toLocaleString('vi-VN');

    return (
        // 3. Thêm onClick để cả hàng đều có thể bấm vào
        <Table.Tr onClick={handleNavigate} style={{ cursor: 'pointer' }}>
            <Table.Td>
                <Text component="span" ff="monospace" c="dimmed" size="xs">{job.job_id.split('-').pop()}</Text>
            </Table.Td>
            <Table.Td>
                <Text fw={500} truncate="end">{job.targets.join(', ')}</Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm">{job.tool}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={getStatusColor(job.status)}>{job.status}</Badge>
            </Table.Td>
            <Table.Td>
                {/* 4. Hiển thị thông tin VPN chi tiết */}
                <Text size="sm">{job.vpn_assignment?.country || 'N/A'}</Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm" c="dimmed">{formattedDate}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap="xs" justify="flex-end">
                    {/* Nút tạm dừng có thể được thêm logic sau */}
                    <Button variant="light" color="blue" size="compact-sm" onClick={(e) => e.stopPropagation()}>Tạm dừng</Button>
                    <Button variant="light" color="red" size="compact-sm" onClick={handleCancelJob}>Hủy</Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    );
}

export default JobRow;