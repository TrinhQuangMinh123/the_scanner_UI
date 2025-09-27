// src/features/dashboard/components/WorkflowRow.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Group, Button, Text, Badge, Tooltip, Progress } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react'; // Import the new icon

// Helper function to get color for status badge
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

    // Shorten Targets and add Tooltip for the full list
    const targetsDisplay = workflow.targets.length > 1
        ? `${workflow.targets[0]} and ${workflow.targets.length - 1} other targets`
        : workflow.targets[0];

    const fullTargetsList = workflow.targets.join('\n');

    // Calculate progress for the Progress Bar
    const completed = workflow.completed_steps || 0;
    const total = workflow.total_steps || 0;
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    const progressText = `${completed}/${total}`;

    const formattedDate = new Date(workflow.created_at).toLocaleString('vi-VN');

    // Check if the workflow is AI-generated
    const isAiGenerated = workflow.description && workflow.description.includes('AI auto-generated');

    return (
        <Table.Tr onClick={handleNavigate} style={{ cursor: 'pointer' }}>
            {/* Numeric ID Column with AI Indicator */}
            <Table.Td>
                <Group gap="xs" wrap="nowrap">
                    {isAiGenerated && (
                        <Tooltip label={workflow.description} withArrow>
                            <IconSparkles size={16} color="var(--mantine-color-blue-6)" />
                        </Tooltip>
                    )}
                    <Text ff="monospace" c="dimmed" size="sm">
                        #{workflow.id}
                    </Text>
                </Group>
            </Table.Td>

            {/* Workflow ID (shortened UUID) Column */}
            <Table.Td>
                <Text ff="monospace" c="dimmed" size="xs">{workflow.workflow_id.split('-').pop()}</Text>
            </Table.Td>

            {/* Targets Column */}
            <Table.Td>
                <Tooltip label={<Text style={{ whiteSpace: 'pre-line' }}>{fullTargetsList}</Text>} withArrow multiline>
                    <Text fw={500} truncate="end">{targetsDisplay}</Text>
                </Tooltip>
            </Table.Td>

            {/* Progress Column */}
            <Table.Td>
                <Tooltip label={progressText} withArrow>
                    <Progress value={progressPercentage} size="lg" radius="sm" />
                </Tooltip>
            </Table.Td>

            {/* Status Column */}
            <Table.Td>
                <Badge color={getStatusColor(workflow.status)} variant="light">
                    {workflow.status}
                </Badge>
            </Table.Td>

            {/* Creation Time Column */}
            <Table.Td>
                <Text size="sm" c="dimmed">{formattedDate}</Text>
            </Table.Td>

            {/* Actions Column */}
            <Table.Td>
                <Group gap="xs" justify="flex-end">
                    <Button
                        variant="subtle"
                        color="red"
                        size="compact-sm"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row's click event
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