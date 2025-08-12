import React from 'react';
import { Table, Badge } from '@mantine/core';

function PortScanResultsTable({ data }) {
    const rows = data.map((item) => (
        <Table.Tr key={`${item.ip}-${item.port}`}>
            <Table.Td>{item.ip}</Table.Td>
            <Table.Td><Badge color="red">{item.port}</Badge></Table.Td>
            <Table.Td>{item.service}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>IP Address</Table.Th>
                    <Table.Th>Port</Table.Th>
                    <Table.Th>Service</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}

export default PortScanResultsTable;