// src/features/dashboard/components/AiControls.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Title, Text, Switch, Group, Badge, Skeleton, Stack} from '@mantine/core';
import { IconBrain, IconServer, IconListNumbers } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function AiControls() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggleLoading, setToggleLoading] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/ai/status');
            if (!response.ok) throw new Error('Không thể lấy trạng thái AI.');
            const data = await response.json();
            setStatus(data);
        } catch (error) {
            notifications.show({ color: 'red', title: 'Lỗi', message: error.message });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchStatus();
    }, [fetchStatus]);

    const handleToggleAutoWorkflow = async (checked) => {
        setToggleLoading(true);
        try {
            // Giả định backend có endpoint này để bật/tắt
            const response = await fetch('/api/ai/toggle-auto-workflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: checked }),
            });
            if (!response.ok) throw new Error('Thay đổi cài đặt thất bại.');
            // Cập nhật lại trạng thái sau khi thay đổi thành công
            await fetchStatus();
            notifications.show({ color: 'green', title: 'Thành công', message: 'Đã cập nhật cài đặt AI.' });
        } catch (error) {
            notifications.show({ color: 'red', title: 'Lỗi', message: error.message });
            // Hoàn lại trạng thái switch nếu có lỗi
            setStatus(current => ({ ...current, auto_workflow_enabled: !checked }));
        } finally {
            setToggleLoading(false);
        }
    };

    const StatusIndicator = ({ label, value, color }) => (
        <Group justify="space-between">
            <Text size="sm">{label}:</Text>
            <Badge color={color} variant="light">{value}</Badge>
        </Group>
    );

    return (
        <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack>
                <Group gap="sm">
                    <IconBrain size={20} stroke={1.5} />
                    <Title order={4}>Cố vấn AI</Title>
                </Group>

                {loading ? (
                    <Stack>
                        <Skeleton height={20} mt={6} radius="sm" />
                        <Skeleton height={20} mt={6} radius="sm" />
                        <Skeleton height={38} mt={10} radius="sm" />
                    </Stack>
                ) : (
                    status && (
                        <>
                            <Stack gap="xs" mt="sm">
                                <StatusIndicator label="RAG Server" value={status.rag_server_status} color={status.rag_server_status === 'online' ? 'green' : 'red'} />
                                <StatusIndicator label="Giới hạn job tự động" value={status.max_auto_jobs} color="blue" />
                            </Stack>
                            <Switch
                                label="Tự động tạo luồng quét"
                                checked={status.auto_workflow_enabled}
                                onChange={(event) => handleToggleAutoWorkflow(event.currentTarget.checked)}
                                disabled={toggleLoading}
                                mt="md"
                            />
                        </>
                    )
                )}
            </Stack>
        </Card>
    );
}

export default AiControls;