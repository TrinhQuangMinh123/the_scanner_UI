// src/features/jobs/results/ResultViewer.jsx
import React, { useState, useEffect } from 'react';
import { Loader, Alert, Text, Center } from '@mantine/core';
import PortScanResultsTable from './PortScanResultsTable';
import DnsResultsList from './DnsResultsList';
// Import các component hiển thị kết quả khác ở đây

const renderResults = (subJob) => {
    // ... hàm switch-case để chọn component phù hợp ...
    switch (subJob.tool) {
        case 'port-scan': return <PortScanResultsTable data={subJob.results} />;
        case 'dns-lookup': return <DnsResultsList data={subJob.results} />;
        default: return <pre>{JSON.stringify(subJob.results, null, 2)}</pre>;
    }
};

function ResultViewer({ subJob }) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Nếu subJob đã có sẵn kết quả từ lần fetch trước (từ cache chẳng hạn), thì không fetch lại.
        if (subJob.results && subJob.results.length > 0) {
            setResults(subJob.results);
            setLoading(false);
            return;
        }

        // Chỉ gọi API để lấy kết quả chi tiết khi component này được render (tức là khi tab được click)
        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/sub_jobs/${subJob.job_id}/results`);
                if (!response.ok) throw new Error("Không thể tải kết quả chi tiết.");
                const data = await response.json();
                setResults(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        void fetchResults();
    }, [subJob.job_id, subJob.results]); // Chỉ chạy lại nếu job_id thay đổi

    if (loading) return <Center><Loader /></Center>;
    if (error) return <Alert color="red" title="Lỗi">{error}</Alert>;
    if (!results || results.length === 0) return <Text c="dimmed">Không có kết quả nào được tìm thấy.</Text>;

    // Tạo một object subJob tạm để truyền vào hàm render, vì results giờ là state cục bộ
    const subJobWithResults = { ...subJob, results: results };

    return (
        <div>
            {renderResults(subJobWithResults)}
        </div>
    );
}

export default ResultViewer;