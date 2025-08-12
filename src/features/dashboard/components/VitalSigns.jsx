// src/features/dashboard/components/VitalSigns.jsx
import React, { useState, useEffect } from 'react';
import { SimpleGrid, Loader, Alert } from '@mantine/core';
import StatCard from './StatCard.jsx';
import { IconAlertCircle } from '@tabler/icons-react';

// API cần có: GET /api/statistics
// Response ví dụ: { "active_scanners": 15, "online_proxies": 50, ... }

function VitalSigns() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/statistics');
                if (!response.ok) throw new Error('Không thể tải dữ liệu thống kê.');
                const data = await response.json();
                setStats(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        void fetchStats();
    }, []);

    if (loading) {
        return <SimpleGrid cols={5}><Loader /></SimpleGrid>;
    }

    if (error) {
        return <Alert color="red" title="Lỗi" icon={<IconAlertCircle />}>{error}</Alert>;
    }

    if (!stats) {
        return null; // Không hiển thị gì nếu không có dữ liệu
    }

    // Chuyển đổi dữ liệu từ API thành định dạng mà StatCard cần
    const statsData = [
        { id: 1, icon: '🏃‍♂️', title: 'Scanners Hoạt động', value: stats.active_scanners },
        { id: 2, icon: '🎭', title: 'Proxies Online', value: stats.online_proxies },
        { id: 3, icon: '⏳', title: 'IP trong Hàng đợi', value: stats.ips_in_queue.toLocaleString() },
        { id: 4, icon: '✅', title: 'Đã quét (24h)', value: stats.scanned_last_24h.toLocaleString() },
        { id: 5, icon: '❌', title: 'Tỉ lệ Lỗi', value: `${stats.error_rate_percent}%`, valueColor: 'red' },
    ];

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