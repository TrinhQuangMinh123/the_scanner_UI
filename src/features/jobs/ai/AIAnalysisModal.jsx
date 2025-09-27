// src/features/jobs/ai/AIAnalysisModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Stack, Text, Title, Alert, Loader, Center, Blockquote, RingProgress, Group, Card, List } from '@mantine/core';
import { IconSparkles, IconAlertCircle } from '@tabler/icons-react';
import { mockAiAnalysisPortscan, mockAiAnalysisHttpxWp } from '../../../mockAiData'; // Điều chỉnh đường dẫn nếu cần

function AIAnalysisModal({ job, workflow, onClose }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);

    useEffect(() => {
        if (job && workflow) {
            const useMockData = () => {
                setLoading(true);
                // Giả lập độ trễ mạng
                setTimeout(() => {
                    // CHỌN KỊCH BẢN BẠN MUỐN TEST Ở ĐÂY:
                    const mockData = mockAiAnalysisPortscan;
                    // const mockData = mockAiAnalysisHttpxWp;

                    setAnalysisData(mockData.analyses[0]?.analysis || null);
                    setLoading(false);
                }, 500); // 0.5 giây delay
            };

            useMockData();
// Tạm thời bình luận lại code fetch thật
/*
    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        setAnalysisData(null);
        try {
            const representativeJobId = job.subJobsInGroup[0].job_id;
            const response = await fetch(`/api/ai/analyze/${workflow.workflow_id}/${representativeJobId}`);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || 'Phân tích AI thất bại.');
            }
            const data = await response.json();
            // Demo API trả về mảng `analyses`, ta lấy phần tử đầu tiên
            setAnalysisData(data.analyses[0]?.analysis || null);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    void fetchAnalysis();
 */
}
}, [job, workflow]);

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
    {analysisData && (
        <Stack>
            <Text size="sm" c="dimmed">Tóm tắt kết quả đầu vào:</Text>
            <Text size="sm"><i>{analysisData.summary}</i></Text>

            <Text size="sm" c="dimmed" mt="md">Phân tích và nhận định:</Text>
            <Blockquote color="blue" icon={<IconSparkles size={20} />} mt="xs">
                {analysisData.ai_analysis}
            </Blockquote>

            <Title order={5} mt="lg">Hành động đề xuất (chỉ xem)</Title>
            <List spacing="xs" size="sm" center>
                {analysisData.suggested_actions.length > 0 ? (
                    analysisData.suggested_actions.map(action => (
                        <List.Item key={action.tool}>
                            <Text>
                                Chạy <b>{action.tool}</b> với độ tin cậy {(action.confidence * 100).toFixed(0)}%
                            </Text>
                        </List.Item>
                    ))
                ) : (
                    <Text size="sm" c="dimmed">AI không có đề xuất nào.</Text>
                )}
            </List>
        </Stack>
    )}
</Modal>
);
}

export default AIAnalysisModal;