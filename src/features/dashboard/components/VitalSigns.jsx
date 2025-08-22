// src/features/dashboard/components/VitalSigns.jsx
import React from 'react';
import { SimpleGrid } from '@mantine/core';
import StatCard from './StatCard.jsx';
// 1. Import các icon chuyên nghiệp từ thư viện
import {
    IconActivity,
    IconShieldLock,
    IconClockHour4,
    IconScan,
    IconAlertTriangle
} from '@tabler/icons-react';

/**
 * Component hiển thị các chỉ số thống kê quan trọng.
 * Dữ liệu được truyền vào thông qua props.
 * @param {object} stats - Object chứa các dữ liệu thống kê.
 */
function VitalSigns({ stats }) {
    // 2. Thay thế emoji bằng các component Icon đã import
    // Sử dụng optional chaining (?.) và giá trị mặc định để tránh lỗi khi stats chưa có
    const statsData = [
        { id: 1, icon: IconActivity, title: 'Scanners Hoạt động', value: stats?.active_scanners || '0' },
        { id: 2, icon: IconShieldLock, title: 'Proxies Online', value: stats?.online_proxies || '0' },
        { id: 3, icon: IconClockHour4, title: 'IP trong Hàng đợi', value: (stats?.ips_in_queue || 0).toLocaleString() },
        { id: 4, icon: IconScan, title: 'Đã quét (24h)', value: (stats?.scanned_last_24h || 0).toLocaleString() },
        { id: 5, icon: IconAlertTriangle, title: 'Tỉ lệ Lỗi', value: `${stats?.error_rate_percent || 0}%`, valueColor: 'red' },
    ];

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
            {statsData.map((stat) => (
                <StatCard
                    key={stat.id}
                    icon={stat.icon} // Giờ đây 'icon' là một component React
                    title={stat.title}
                    value={stat.value}
                    valueColor={stat.valueColor}
                />
            ))}
        </SimpleGrid>
    );
}

export default VitalSigns;