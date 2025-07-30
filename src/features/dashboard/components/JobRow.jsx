// src/features/dashboard/components/JobRow.jsx
import React from 'react';
import { Table, Progress, Group, Button, Text } from '@mantine/core';

function JobRow({ job }) {
    return (
        <Table.Tr>
            <Table.Td>
                <Text component="span" ff="monospace" c="dimmed" size="xs">{job.id}</Text>
            </Table.Td>
            <Table.Td>
                <Text fw={500}>{job.target}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <Progress value={job.progress} w={100} />
                    <Text size="sm">{job.progress}%</Text>
                </Group>
            </Table.Td>
            <Table.Td>
                <Text size="sm" c="dimmed">{job.type}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap="xs" justify="flex-end">
                    <Button variant="light" color="blue" size="compact-sm">Tạm dừng</Button>
                    <Button variant="light" color="red" size="compact-sm">Hủy</Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    );
}

export default JobRow;