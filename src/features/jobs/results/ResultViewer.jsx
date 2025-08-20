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

// Hằng số: Số lượng kết quả hiển thị trên mỗi trang.
const ITEMS_PER_PAGE = 10;

/**
 * Quyết định component nào sẽ được dùng để hiển thị kết quả dựa vào `subJob.tool`.
 * @param {object} subJob - Object chứa thông tin về sub-job và kết quả của nó.
 * @returns {JSX.Element} - Component tương ứng để hiển thị kết quả.
 */
const renderResults = (subJob) => {
    switch (subJob.tool) {
        case 'port-scan':
            return <PortScanResultsTable data={subJob.results} />;
        case 'dns-lookup':
            return <DnsResultsList data={subJob.results} />;
        case 'nuclei-scan':
            return <NucleiResultsTable data={subJob.results} />;
        case 'wpscan-scan':
            return <WpscanResults data={subJob.results} />;
        case 'httpx-scan':
            return <HttpxResultsTable data={subJob.results} />;
        case 'dirsearch-scan':
            return <DirsearchScanResultsTable data={subJob.results} />;
        default:
            // Fallback: Hiển thị dữ liệu JSON thô nếu không có component chuyên dụng.
            return <pre>{JSON.stringify(subJob.results, null, 2)}</pre>;
    }
};

/**
 * Component ResultViewer:
 * Fetch và hiển thị kết quả chi tiết cho một sub-job, hỗ trợ phân trang.
 */
function ResultViewer({ subJob }) {
    // 1. Quản lý state cho kết quả và phân trang
    const [results, setResults] = useState(null);
    const [paginationInfo, setPaginationInfo] = useState(null);
    const [activePage, setPage] = useState(1); // Trang hiện tại, mặc định là 1

    // State cho trạng thái tải và lỗi
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hook useEffect để fetch dữ liệu khi component được mount hoặc khi trang thay đổi
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                // 2. Xây dựng URL động với tham số page và page_size cho API
                const apiUrl = `/api/sub_jobs/${subJob.job_id}/results?page=${activePage}&page_size=${ITEMS_PER_PAGE}`;

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Không thể tải kết quả chi tiết.");
                }

                const data = await response.json();

                // 3. Cập nhật state với dữ liệu nhận được từ response
                // API trả về object có dạng: { results: [...], pagination: {...} }
                setResults(data.results || []);
                setPaginationInfo(data.pagination || null);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        void fetchResults();

        // 4. Dependency array: useEffect sẽ chạy lại khi subJob.job_id hoặc activePage thay đổi.
        // Điều này đảm bảo dữ liệu được fetch lại khi người dùng chọn sub-job khác hoặc chuyển trang.
    }, [subJob.job_id, activePage]);

    return (
        // Stack dùng để sắp xếp các component con theo chiều dọc
        <Stack>
            {/* ResultsWrapper xử lý việc hiển thị trạng thái loading, error, hoặc khi không có dữ liệu */}
            <ResultsWrapper isLoading={loading} error={error} data={results}>
                {results && renderResults({ ...subJob, results: results })}
            </ResultsWrapper>

            {/* 5. Hiển thị thanh điều khiển phân trang */}
            {/* Chỉ hiển thị khi có thông tin phân trang và tổng số trang lớn hơn 1 */}
            {paginationInfo && paginationInfo.total_pages > 1 && (
                <Group justify="center" mt="md">
                    <Pagination
                        total={paginationInfo.total_pages} // Tổng số trang
                        value={activePage}                 // Trang hiện tại
                        onChange={setPage}                 // Callback khi người dùng đổi trang, kích hoạt lại useEffect
                    />
                </Group>
            )}
        </Stack>
    );
}

export default ResultViewer;