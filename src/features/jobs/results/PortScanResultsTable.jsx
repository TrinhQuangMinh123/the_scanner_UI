// src/features/jobs/results/PortScanResultsTable.jsx
import React from 'react';
import { Table, Badge, Text } from '@mantine/core';

function PortScanResultsTable({ data }) {

    const rows = data.map((item, index) => (
        <Table.Tr key={`${item.ip}-${item.port}-${index}`}>
            <Table.Td><Text fw={500}>{item.ip}</Text></Table.Td>
            <Table.Td><Badge color="red">{item.port}/{item.protocol || 'tcp'}</Badge></Table.Td>
            <Table.Td>{item.service}</Table.Td>
            <Table.Td><Text truncate="end">{item.banner}</Text></Table.Td>
        </Table.Tr>
    ));

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>IP Address</Table.Th>
                    <Table.Th>Port</Table.Th>
                    <Table.Th>Service</Table.Th>
                    <Table.Th>Banner</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}

export default PortScanResultsTable;