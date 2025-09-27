// src/features/jobs/results/WpscanResults.jsx
import React from 'react';
import { Table, Text, Anchor, Badge } from '@mantine/core';

function WpscanResults({ data }) {
    // THAY ĐỔI: Trích xuất mảng kết quả thực tế từ dữ liệu lồng nhau
    const findings = data[0]?.scan_metadata?.wpscan_results || [];

    if (!findings || findings.length === 0) {
        return (
            <Table>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td colSpan={4} ta="center">
                            <Text c="dimmed">Không tìm thấy kết quả nào.</Text>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        );
    }
    const rows = findings.map((finding, index) => {
        const cveId = finding.references?.cve?.[0];

        return (
            <Table.Tr key={index}>
                <Table.Td>
                    <Text fw={500}>{finding.name}</Text>
                    {cveId && (
                        <Anchor
                            href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-${cveId}`}
                            target="_blank"
                            size="xs"
                        >
                            (CVE-{cveId})
                        </Anchor>
                    )}
                </Table.Td>
                <Table.Td>
                    <Badge color="orange">{finding.confidence}%</Badge>
                </Table.Td>
                <Table.Td>
                    <Text c="green">{finding.fixed_in || 'N/A'}</Text>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Lỗ hổng / Phát hiện</Table.Th>
                    <Table.Th>Độ tin cậy</Table.Th>
                    <Table.Th>Phiên bản đã vá</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}

export default WpscanResults;