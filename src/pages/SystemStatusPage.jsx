// src/pages/SystemStatusPage.jsx
import React, { useState } from 'react';
import { Title, Button, Stack, Card, Code, Alert, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

function SystemStatusPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cập nhật hàm fetchData
    const fetchData = async (endpoint) => {
        setLoading(true);
        setData(null);
        try {
            const response = await fetch(endpoint);

            // Lấy header để kiểm tra kiểu nội dung
            const contentType = response.headers.get("content-type");

            // Nếu response là JSON, phân tích nó
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const result = await response.json();
                setData(JSON.stringify(result, null, 2)); // Format JSON cho đẹp
            } else {
                // Nếu không, đọc nó như văn bản thuần túy
                const result = await response.text();
                setData(result);
            }

        } catch (error) {
            setData(`Lỗi khi gọi API: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack>
            <Group justify="space-between">
                <Title order={1}>Trạng thái Hệ thống (Dev)</Title>
                <Button component={Link} to="/" variant="light">
                    Quay lại Dashboard
                </Button>
            </Group>

            <Card withBorder p="md" radius="md">
                <Stack>
                    <Button onClick={() => fetchData('/health')} loading={loading}>
                        Kiểm tra Health
                    </Button>
                    <Button onClick={() => fetchData('/debug/info')} loading={loading} color="orange">
                        Lấy thông tin Debug
                    </Button>
                    <Button onClick={() => fetchData('/debug/vpn-service')} loading={loading} color="grape">
                        Debug Dịch vụ VPN
                    </Button>
                </Stack>
            </Card>

            {data && (
                <Card withBorder p="md" radius="md">
                    <Alert title="Kết quả" color="gray" variant="outline">
                        <Code block>{data}</Code>
                    </Alert>
                </Card>
            )}
        </Stack>
    );
}

export default SystemStatusPage;