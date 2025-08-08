// src/pages/VpnManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Title, Button, Stack, Table, Card, Loader, Alert, Group, Accordion, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

// Component con để hiển thị Badge trạng thái
const StatusBadge = ({ status }) => {
    const color = status === 'online' ? 'green' : status === 'offline' ? 'red' : 'gray';
    const label = status || 'unknown'; // Hiển thị 'unknown' nếu status là null/undefined

    return (
        <Badge
            color={color}
            leftSection={
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: `var(--mantine-color-${color}-6)` }} />
            }
        >
            {label}
        </Badge>
    );
};

function VpnManagementPage() {
    const [groupedVpns, setGroupedVpns] = useState({});
    const [loading, setLoading] = useState(true);
    const [isTesting, setIsTesting] = useState(false);
    const [error, setError] = useState(null);

    // Dùng useCallback để hàm fetchVpns không bị tạo lại mỗi lần render
    const fetchVpns = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/vpns/by-country');
            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }
            const data = await response.json();
            // Chỉ lấy đối tượng 'countries' từ data, nếu không có thì lấy object rỗng
            setGroupedVpns(data.countries || {});         } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Gọi API lần đầu khi component được tải
    useEffect(() => {
        void fetchVpns();
    }, [fetchVpns]);

    // Hàm xử lý khi nhấn nút kiểm tra
    const handleTestVpns = async () => {
        setIsTesting(true);
        setError(null);
        try {
            const response = await fetch('/api/vpns/test');
            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }
            // Sau khi test xong, gọi lại API để cập nhật danh sách
            await fetchVpns();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsTesting(false);
        }
    };

    const accordionItems = Object.keys(groupedVpns).map((country) => {
        const vpnsInCountry = groupedVpns[country];
        const rows = vpnsInCountry.map((vpn) => (
            <Table.Tr key={vpn.filename}>
                <Table.Td>{vpn.hostname}</Table.Td>
                <Table.Td>{vpn.filename}</Table.Td>
                <Table.Td>
                    <StatusBadge status={vpn.status} />
                </Table.Td>
            </Table.Tr>
        ));

        return (
            <Accordion.Item key={country} value={country}>
                <Accordion.Control>
                    {country.toUpperCase()} ({vpnsInCountry.length} VPNs)
                </Accordion.Control>
                <Accordion.Panel>
                    <Table verticalSpacing="sm" striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Hostname / IP</Table.Th>
                                <Table.Th>Tên file</Table.Th>
                                <Table.Th>Trạng thái</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
        );
    });

    return (
        <Stack>
            <Group justify="space-between">
                <Title order={1}>Quản lý VPN</Title>
                <Button component={Link} to="/" variant="light">
                    Quay lại Dashboard
                </Button>
            </Group>

            <Card withBorder p="md" radius="md">
                <Group>
                    <Button
                        leftSection={<IconRefresh size={14} />}
                        onClick={handleTestVpns}
                        loading={isTesting}
                    >
                        Kiểm tra hệ thống VPN
                    </Button>
                </Group>
            </Card>

            {loading && <Loader />}

            {error && (
                <Alert icon={<IconAlertCircle size="1rem" />} title="Lỗi!" color="red">
                    Không thể tải danh sách VPN. Lỗi: {error}
                </Alert>
            )}

            {!loading && !error && (
                <Accordion variant="separated" radius="md">
                    {accordionItems}
                </Accordion>
            )}
        </Stack>
    );
}

export default VpnManagementPage;