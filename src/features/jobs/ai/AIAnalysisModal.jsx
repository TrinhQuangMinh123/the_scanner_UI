// src/features/jobs/ai/AIAnalysisModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Stack, Text, Title, Alert, Loader, Center, Blockquote, RingProgress, Button, Group, Card } from '@mantine/core';
import { IconSparkles, IconAlertCircle } from '@tabler/icons-react';
import { useUiStore } from '../../../stores/uiStore';

function AIAnalysisModal({ job, workflow, onClose }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const openWorkflowModal = useUiStore((state) => state.openWorkflowModal);

    useEffect(() => {
        if (job) {
            const fetchAnalysis = async () => {
                setLoading(true);
                setError(null);
                setAnalysis(null);
                try {
                    // Lấy job_id đại diện từ nhóm
                    const representativeJobId = job.subJobsInGroup[0].job_id;
                    const response = await fetch(`/api/ai/analyze-job/${representativeJobId}`, {
                        method: 'POST',
                    });
                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        throw new Error(errData.detail || 'Phân tích AI thất bại.');
                    }
                    const data = await response.json();
                    setAnalysis(data);
                } catch (e) {
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            };
            void fetchAnalysis();
        }
    }, [job]);

    const handleCreateScan = (tool) => {
        // Đóng modal AI
        onClose();
        // Mở modal tạo workflow mới với tool và target được đề xuất
        openWorkflowModal({
            targets: workflow.targets.join('\n'), // Lấy target từ workflow hiện tại
            steps: [{ type: tool, id: `${tool}-${Date.now()}`, name: tool, params: {} }]
        });
    };

    return (
        <Modal
            opened={!!job}
            onClose={onClose}
            title={<Title order={4}>Phân tích của Cố vấn AI cho công cụ "{job?.tool}"</Title>}
            size="lg"
            centered
        >
            {loading && <Center p="xl"><Loader /></Center>}
            {error && <Alert color="red" title="Lỗi" icon={<IconAlertCircle />}>{error}</Alert>}
            {analysis && (
                <Stack>
                    <Group>
                        <RingProgress
                            size={80}
                            thickness={8}
                            roundCaps
                            sections={[{ value: analysis.confidence * 100, color: 'teal' }]}
                            label={<Text c="teal" fw={700} ta="center" size="sm">{ (analysis.confidence * 100).toFixed(0) }%</Text>}
                        />
                        <div>
                            <Text fw={500}>Độ tự tin tổng thể</Text>
                            <Text size="sm" c="dimmed">Dựa trên kết quả và ngữ cảnh.</Text>
                        </div>
                    </Group>

                    <Text size="sm" c="dimmed" mt="md">Tóm tắt kết quả đầu vào:</Text>
                    <Text size="sm"><i>{analysis.summary}</i></Text>

                    <Text size="sm" c="dimmed" mt="md">Phân tích và nhận định:</Text>
                    <Blockquote color="blue" icon={<IconSparkles size={20} />} mt="xs">
                        {analysis.ai_analysis}
                    </Blockquote>

                    <Title order={5} mt="lg">Hành động đề xuất</Title>
                    <Stack gap="xs">
                        {analysis.suggested_actions.length > 0 ? (
                            analysis.suggested_actions.map(action => (
                                <Card withBorder p="sm" radius="md" key={action.tool}>
                                    <Group justify="space-between">
                                        <Stack gap={0}>
                                            <Text fw={500}>{action.tool}</Text>
                                            <Text size="xs" c="dimmed">Độ tự tin: {(action.confidence * 100).toFixed(0)}%</Text>
                                        </Stack>
                                        <Button
                                            variant="light"
                                            size="xs"
                                            onClick={() => handleCreateScan(action.tool)}
                                        >
                                            + Tạo Luồng quét
                                        </Button>
                                    </Group>
                                </Card>
                            ))
                        ) : (
                            <Text size="sm" c="dimmed">AI không có đề xuất nào dựa trên kết quả này.</Text>
                        )}
                    </Stack>
                </Stack>
            )}
        </Modal>
    );
}

export default AIAnalysisModal;