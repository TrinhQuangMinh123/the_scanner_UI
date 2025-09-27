// src/features/jobs/results/ResultViewer.jsx
import React, { useState, useEffect } from 'react';

// --- Imports từ Mantine UI Kit ---
import { Stack, Pagination, Group } from '@mantine/core';

// --- Imports các Component con ---
import ResultsWrapper from './ResultsWrapper';
import PortScanResultsTable from './PortScanResultsTable';
import DnsResultsList from './DnsResultsList';
import NucleiResultsTable from './NucleiResultsTable';
import WpscanResults from './WpscanResults';
import HttpxResultsTable from './HttpxResultsTable';
import DirsearchScanResultsTable from './DirsearchScanResultsTable';
import SqlmapResultsTable from './SqlmapResultsTable'; // Import component mới

// Hằng số: Số lượng kết quả hiển thị trên mỗi trang.
const ITEMS_PER_PAGE = 10;

/**
 * Quyết định component nào sẽ được dùng để hiển thị kết quả.
 * @param {object} subJob - Object chứa thông tin về sub-job.
 * @param {Array} resultsToRender - Mảng kết quả cho trang hiện tại.
 * @returns {JSX.Element} - Component tương ứng để hiển thị kết quả.
 */
const renderResults = (subJob, resultsToRender) => {
    switch (subJob.tool) {
        case 'port-scan':
            return <PortScanResultsTable data={resultsToRender} />;
        case 'dns-lookup':
            return <DnsResultsList data={resultsToRender} />;
        case 'nuclei-scan':
            return <NucleiResultsTable data={resultsToRender} />;
        case 'wpscan-scan':
            return <WpscanResults data={resultsToRender} />;
        case 'httpx-scan':
            return <HttpxResultsTable data={resultsToRender} />;
        case 'dirsearch-scan':
            return <DirsearchScanResultsTable data={resultsToRender} />;
        case 'sqlmap-scan': // Thêm case mới cho sqlmap-scan
            return <SqlmapResultsTable data={resultsToRender} />;
        default:
            // Giữ nguyên fallback để debug
            return <pre>{JSON.stringify(resultsToRender, null, 2)}</pre>;
    }
};

/**
 * Component ResultViewer:
 * Fetch toàn bộ kết quả cho một sub-job và thực hiện phân trang ở phía client.
 */
function ResultViewer({ subJob }) {
    // State để lưu TOÀN BỘ kết quả
    const [allResults, setAllResults] = useState(null);
    const [activePage, setPage] = useState(1);

    // State cho trạng thái tải và lỗi
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hook useEffect để fetch toàn bộ dữ liệu khi subJob thay đổi
    useEffect(() => {
        const fetchAllResults = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API không cần tham số phân trang
                const apiUrl = `/api/sub_jobs/${subJob.job_id}/results`;

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Không thể tải kết quả chi tiết.");
                }

                const data = await response.json();

                // Lấy ra mảng "results" từ object và lưu vào state
                // Giả định API trả về: { "results": [...] }
                setAllResults(data.results || []);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        void fetchAllResults();

        // Chỉ chạy 1 lần khi subJob thay đổi
    }, [subJob.job_id]);

    // Logic tính toán phân trang được thực hiện ở client
    const totalPages = allResults ? Math.ceil(allResults.length / ITEMS_PER_PAGE) : 0;
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const itemsForCurrentPage = allResults ? allResults.slice(start, end) : [];

    return (
        <Stack>
            {/* Wrapper vẫn kiểm tra `allResults` */}
            <ResultsWrapper isLoading={loading} error={error} data={allResults}>
                {/* Nhưng component render chỉ nhận dữ liệu của trang hiện tại */}
                {allResults && renderResults(subJob, itemsForCurrentPage)}
            </ResultsWrapper>

            {/* Thanh phân trang được điều khiển bởi logic của client */}
            {totalPages > 1 && (
                <Group justify="center" mt="md">
                    <Pagination
                        total={totalPages}
                        value={activePage}
                        onChange={setPage}
                    />
                </Group>
            )}
        </Stack>
    );
}

export default ResultViewer;