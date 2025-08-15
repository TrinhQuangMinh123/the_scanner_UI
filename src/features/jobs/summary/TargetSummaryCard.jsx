// src/features/jobs/summary/TargetSummaryCard.jsx
import React from 'react';
import { Card, Title, Text, Stack, Badge, Group } from '@mantine/core';

const severityColors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'blue',
    info: 'gray',
};

// Hàm helper để gom nhóm và đếm các lỗ hổng
const groupVulnerabilities = (vulnerabilities) => {
    if (!vulnerabilities || vulnerabilities.length === 0) return [];

    const grouped = vulnerabilities.reduce((acc, vuln) => {
        const key = vuln.name;
        if (!acc[key]) {
            acc[key] = { ...vuln, count: 0 };
        }
        acc[key].count += 1;
        return acc;
    }, {});

    return Object.values(grouped);
};


// Component con để render một section
const SummarySection = ({ title, data, renderItem }) => {
    if (!data || data.length === 0) {
        return null; // Không hiển thị section nếu không có dữ liệu
    }
    return (
        <Stack gap="xs" mt="md">
            <Text fw={500} size="sm">{title}</Text>
            <Group gap="xs">
                {data.map(renderItem)}
            </Group>
        </Stack>
    );
};

function TargetSummaryCard({ summary }) {
    // Gom nhóm các lỗ hổng trước khi render
    const uniqueVulnerabilities = groupVulnerabilities(summary.vulnerabilities);

    return (
        <Card withBorder p="md" radius="md">
            <Title order={3}>{summary.target}</Title>

            {/* BỔ SUNG: Hiển thị DNS Records */}
            <SummarySection
                title="Thông tin DNS"
                data={summary.dns_records}
                renderItem={(ip, i) => <Badge key={i} variant="outline">{ip}</Badge>}
            />

            <SummarySection
                title="Các Port đang mở"
                data={summary.open_ports}
                renderItem={(item, i) => <Badge key={i} color="red" variant="light">{item.port}/{item.protocol}</Badge>}
            />

            <SummarySection
                title="Công nghệ Web"
                data={summary.web_technologies}
                renderItem={(item, i) => <Badge key={i} variant="filled">{item}</Badge>}
            />

            {/* CẬP NHẬT: Hiển thị danh sách lỗ hổng đã gom nhóm */}
            <SummarySection
                title="Lỗ hổng đã tìm thấy"
                data={uniqueVulnerabilities}
                renderItem={(item, i) => (
                    <Badge
                        key={i}
                        color={severityColors[item.severity] || 'gray'}
                        rightSection={item.count > 1 ? item.count : ''} // Hiển thị số lượng nếu > 1
                    >
                        {item.name}
                    </Badge>
                )}
            />
        </Card>
    );
}

export default TargetSummaryCard;