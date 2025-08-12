import React from 'react';
import { Table, Text } from '@mantine/core';

function DnsResultsList({ data }) {
    const rows = data.map((item) => (
        <Table.Tr key={item.target}>
            <Table.Td><Text fw={500}>{item.target}</Text></Table.Td>
            <Table.Td>{item.resolved_ips.join(', ')}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Tên miền</Table.Th>
                    <Table.Th>Các IP được phân giải</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}

export default DnsResultsList;