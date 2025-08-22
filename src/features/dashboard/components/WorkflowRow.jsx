// src/features/dashboard/components/WorkflowRow.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Group, Button, Text, Badge, Tooltip, Progress } from '@mantine/core';

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

    // Rút gọn Mục tiêu và thêm Tooltip
    const targetsDisplay = workflow.targets.length > 1
        ? `${workflow.targets[0]} và ${workflow.targets.length - 1} mục tiêu khác`
        : workflow.targets[0];

    const fullTargetsList = workflow.targets.join('\n');

    // Thay thế Tiến trình bằng Progress Bar
    const completed = workflow.completed_steps || 0;
    const total = workflow.total_steps || 0;
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    const progressText = `${completed}/${total}`;

    const formattedDate = new Date(workflow.created_at).toLocaleString('vi-VN');

    return (
        <Table.Tr onClick={handleNavigate} style={{ cursor: 'pointer' }}>
            {/* THÊM CỘT MỚI ĐỂ HIỂN THỊ ID SỐ */}
            <Table.Td>
                <Text ff="monospace" c="dimmed" size="sm">
                    #{workflow.id}
                </Text>
            </Table.Td>

            {/* Cột Workflow ID (UUID rút gọn) */}
            <Table.Td>
                <Text ff="monospace" c="dimmed" size="xs">{workflow.workflow_id.split('-').pop()}</Text>
            </Table.Td>

            {/* Cột Mục tiêu */}
            <Table.Td>
                <Tooltip label={<Text style={{ whiteSpace: 'pre-line' }}>{fullTargetsList}</Text>} withArrow multiline>
                    <Text fw={500} truncate="end">{targetsDisplay}</Text>
                </Tooltip>
            </Table.Td>

            {/* Cột Tiến trình */}
            <Table.Td>
                <Tooltip label={progressText} withArrow>
                    <Progress value={progressPercentage} size="lg" radius="sm" />
                </Tooltip>
            </Table.Td>

            {/* Cột Trạng thái */}
            <Table.Td>
                <Badge color={getStatusColor(workflow.status)} variant="light">
                    {workflow.status}
                </Badge>
            </Table.Td>

            {/* Cột Thời gian tạo */}
            <Table.Td>
                <Text size="sm" c="dimmed">{formattedDate}</Text>
            </Table.Td>

            {/* Cột Hành động */}
            <Table.Td>
                <Group gap="xs" justify="flex-end">
                    <Button
                        variant="subtle"
                        color="red"
                        size="compact-sm"
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click của cả hàng
                            onCancel(workflow.workflow_id);
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