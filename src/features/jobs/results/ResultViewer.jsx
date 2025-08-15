// src/features/jobs/results/ResultViewer.jsx
import React, { useState, useEffect } from 'react';
import ResultsWrapper from './ResultsWrapper';
import { Loader, Alert, Text, Center } from '@mantine/core';
import PortScanResultsTable from './PortScanResultsTable';
import DnsResultsList from './DnsResultsList';
import NucleiResultsTable from './NucleiResultsTable';
import WpscanResults from './WpscanResults';
import HttpxResultsTable from './HttpxResultsTable'; // Import component mới
import DirsearchScanResultsTable from './DirsearchScanResultsTable'; // Import component mới

// Import các component hiển thị kết quả khác ở đây

const renderResults = (subJob) => {
    // subJob ở đây đã chứa kết quả chi tiết bên trong nó
    switch (subJob.tool) {
        case 'port-scan':
            return <PortScanResultsTable data={subJob.results} />;
        case 'dns-lookup':
            return <DnsResultsList data={subJob.results} />;
        case 'nuclei-scan':
            return <NucleiResultsTable data={subJob.results} />;
        case 'wpscan-scan':
            return <WpscanResults data={subJob.results} />;
        case 'httpx-scan': // Thêm case mới
            return <HttpxResultsTable data={subJob.results} />;
        case 'dirsearch-scan': // Thêm case mới
            return <DirsearchScanResultsTable data={subJob.results} />;
        default:
            // Hiển thị dạng JSON thô nếu chưa có component tương ứng
            return <pre>{JSON.stringify(subJob.results, null, 2)}</pre>;
    }
};

function ResultViewer({ subJob }) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API lấy kết quả chi tiết theo xác nhận của Nguyen
                const response = await fetch(`/api/sub_jobs/${subJob.job_id}/results`);                if (!response.ok) throw new Error("Không thể tải kết quả chi tiết.");

                const data = await response.json();
                setResults(data || []);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        void fetchResults();
    }, [subJob.job_id]);

    // 2. Bọc toàn bộ phần hiển thị trong ResultsWrapper
    return (
        <ResultsWrapper isLoading={loading} error={error} data={results}>
            {/* Component con chỉ được render khi có dữ liệu */}
            {renderResults({ ...subJob, results: results })}
        </ResultsWrapper>
    );
}

export default ResultViewer;