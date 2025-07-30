// src/features/dashboard/components/VitalSigns.jsx
import React from 'react';
import { SimpleGrid } from '@mantine/core';
import StatCard from './StatCard.jsx';

const statsData = [
    { id: 1, icon: '🏃‍♂️', title: 'Scanners Hoạt động', value: '15' },
    { id: 2, icon: '🎭', title: 'Proxies Online', value: '50' },
    { id: 3, icon: '⏳', title: 'IP trong Hàng đợi', value: '12,500' },
    { id: 4, icon: '✅', title: 'Đã quét (24h)', value: '250,000' },
    { id: 5, icon: '❌', title: 'Tỉ lệ Lỗi', value: '1.2%', valueColor: 'text-red-500' },
];

function VitalSigns() {
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
            {statsData.map((stat) => (
                <StatCard
                    key={stat.id}
                    icon={stat.icon}
                    title={stat.title}
                    value={stat.value}
                    valueColor={stat.valueColor}
                />
            ))}
        </SimpleGrid>
    );
}

export default VitalSigns;