// src/pages/VpnManagementPage.jsx
import React, { useState, useEffect } from 'react';
// Thêm 'Group' vào dòng import dưới đây
import { Title, Text, Button, Stack, Table, Card, Loader, Alert, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconAlertCircle } from '@tabler/icons-react';

function VpnManagementPage() {
    const [vpns, setVpns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVpns = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/vpns');
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP: ${response.status}`);
                }
                const data = await response.json();
                setVpns(data.vpns);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVpns();
    }, []);

    const rows = vpns.map((vpn) => (
        <Table.Tr key={vpn.id || vpn.filename}>
            <Table.Td>{vpn.hostname}</Table.Td>
            <Table.Td>{vpn.country}</Table.Td>
            <Table.Td>{vpn.ip_address}</Table.Td>
            <Table.Td>{vpn.status}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack>
            <Group justify="space-between">
                <Title order={1}>Quản lý VPN</Title>
                <Button component={Link} to="/" variant="light">
                    Quay lại Dashboard
                </Button>
            </Group>

            {loading && <Loader />}

            {error && (
                <Alert icon={<IconAlertCircle size="1rem" />} title="Lỗi!" color="red">
                    Không thể tải danh sách VPN. Lỗi: {error}
                </Alert>
            )}

            {!loading && !error && (
                <Card withBorder p={0} radius="md">
                    <Table verticalSpacing="sm" striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Hostname/IP</Table.Th>
                                <Table.Th>Quốc gia</Table.Th>
                                <Table.Th>Địa chỉ IP</Table.Th>
                                <Table.Th>Trạng thái</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Card>
            )}
        </Stack>
    );
}

export default VpnManagementPage;