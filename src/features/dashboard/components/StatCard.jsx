// src/features/dashboard/components/StatCard.jsx
import { Card, Text, Group, ThemeIcon } from '@mantine/core'; // Thêm ThemeIcon

// Prop 'icon' giờ sẽ là một component React
function StatCard({ icon: Icon, title, value, valueColor }) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group>
                {/* Dùng ThemeIcon để bọc icon, tạo nền và màu sắc đẹp hơn */}
                <ThemeIcon color="gray" variant="light" size={38} radius="md">
                    <Icon size={24} stroke={1.5} />
                </ThemeIcon>
                <div>
                    <Text c="dimmed" size="sm" fw={500}>{title}</Text>
                    <Text fw={700} size="xl" c={valueColor}>{value}</Text>
                </div>
            </Group>
        </Card>
    );
}

export default StatCard;