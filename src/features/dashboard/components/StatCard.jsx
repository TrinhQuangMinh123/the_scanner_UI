import { Card, Text, Group } from '@mantine/core';

function StatCard({ icon, title, value, valueColor }) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group>
                <Text size="xl" p="sm" bg="gray.1" radius="md">{icon}</Text>
                <div>
                    <Text c="dimmed" size="sm" fw={500}>{title}</Text>
                    <Text fw={700} size="xl" c={valueColor}>{value}</Text>
                </div>
            </Group>
        </Card>
    );
}

export default StatCard; // <-- Thêm dòng này vào cuối file