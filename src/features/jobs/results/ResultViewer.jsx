// src/features/jobs/results/ResultViewer.jsx
import React, { useState, useEffect } from 'react';

// --- Imports từ Mantine UI Kit ---
// Stack: Dùng để sắp xếp các component theo chiều dọc (bảng kết quả ở trên, thanh phân trang ở dưới).
// Group: Dùng để căn giữa thanh phân trang.
// Pagination: Component UI cho phép người dùng điều hướng qua các trang.
import { Pagination, Group, Stack } from '@mantine/core';

// --- Imports các Component con ---
import ResultsWrapper from './ResultsWrapper';
import PortScanResultsTable from './PortScanResultsTable';
import DnsResultsList from './DnsResultsList';
import NucleiResultsTable from './NucleiResultsTable';
import WpscanResults from './WpscanResults';
import HttpxResultsTable from './HttpxResultsTable';
import DirsearchScanResultsTable from './DirsearchScanResultsTable';

// Hằng số định nghĩa số lượng kết quả hiển thị trên mỗi trang.
// Việc tách ra thành hằng số giúp dễ dàng thay đổi sau này.
const ITEMS_PER_PAGE = 10;

/**
 * Hàm renderResults: Dựa vào 'subJob.tool', component này sẽ quyết định
 * component con nào sẽ được dùng để hiển thị dữ liệu.
 * Đây là một cách tiếp cận linh hoạt để hỗ trợ nhiều loại kết quả khác nhau.
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
            // Nếu không có component hiển thị chuyên dụng, hiển thị dữ liệu dưới dạng JSON thô.
            return <pre>{JSON.stringify(subJob.results, null, 2)}</pre>;
    }
};

/**
 * Component ResultViewer:
 * Chịu trách nhiệm fetch và hiển thị kết quả chi tiết cho một sub-job cụ thể,
 * đồng thời quản lý trạng thái tải, lỗi, và phân trang.
 */
function ResultViewer({ subJob }) {
    // --- Quản lý State (State Management) ---

    // `results`: Lưu trữ danh sách kết quả cho trang hiện tại.
    const [results, setResults] = useState(null);

    // `pagination`: Lưu trữ thông tin về phân trang từ API (ví dụ: total_pages).
    const [pagination, setPagination] = useState(null);

    // `activePage`: Lưu trữ trang mà người dùng đang xem. Mặc định là trang 1.
    const [activePage, setPage] = useState(1);

    // `loading`: Cờ boolean để cho biết dữ liệu đang được tải hay không.
    const [loading, setLoading] = useState(true);

    // `error`: Lưu trữ thông báo lỗi nếu có sự cố khi fetch dữ liệu.
    const [error, setError] = useState(null);

    // --- Hook `useEffect` để fetch dữ liệu ---
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true); // Bắt đầu quá trình tải, hiển thị spinner.
            setError(null);   // Xóa lỗi cũ (nếu có) trước khi fetch lần mới.

            try {
                // Xây dựng URL động với các tham số cho phân trang.
                const apiUrl = `/api/sub_jobs/${subJob.job_id}/results?page=${activePage}&page_size=${ITEMS_PER_PAGE}`;

                // Gọi API để lấy dữ liệu.
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Không thể tải kết quả chi tiết.");
                }

                // Parse dữ liệu JSON từ phản hồi của API.
                // API được kỳ vọng trả về một object có dạng: { results: [...], pagination: {...} }
                const data = await response.json();

                // Cập nhật state với dữ liệu mới.
                setResults(data.results || []);
                setPagination(data.pagination || null);

            } catch (e) {
                setError(e.message); // Nếu có lỗi, cập nhật state `error`.
            } finally {
                setLoading(false); // Kết thúc quá trình tải, ẩn spinner.
            }
        };

        void fetchResults();

        // Mảng phụ thuộc (dependency array):
        // useEffect sẽ được chạy lại mỗi khi `subJob.job_id` hoặc `activePage` thay đổi.
        // Điều này đảm bảo component sẽ tải lại dữ liệu khi người dùng chọn một sub-job khác
        // hoặc chuyển sang một trang kết quả khác.
    }, [subJob.job_id, activePage]);

    // --- Render Giao diện (JSX) ---
    return (
        // `Stack` dùng để sắp xếp các phần tử con theo chiều dọc.
        <Stack>
            {/* `ResultsWrapper` là một component bao bọc, chịu trách nhiệm hiển thị
                trạng thái loading, error, hoặc thông báo không có dữ liệu.
                Nó chỉ render `children` khi có dữ liệu hợp lệ. */}
            <ResultsWrapper isLoading={loading} error={error} data={results}>
                {/* Chỉ khi có kết quả (`results` không phải null) thì mới gọi hàm renderResults */}
                {results && renderResults({ ...subJob, results: results })}
            </ResultsWrapper>

            {/* Hiển thị thanh phân trang */}
            {/* Điều kiện: Chỉ hiển thị khi có thông tin pagination VÀ tổng số trang > 1 */}
            {pagination && pagination.total_pages > 1 && (
                // `Group` với `justify="center"` để căn giữa thanh phân trang.
                <Group justify="center" mt="md">
                    <Pagination
                        total={pagination.total_pages} // Tổng số trang
                        value={activePage}             // Trang hiện tại đang được chọn
                        onChange={setPage}             // Hàm callback được gọi khi người dùng nhấp vào trang khác.
                        // Nó sẽ cập nhật state `activePage`, kích hoạt lại `useEffect`.
                    />
                </Group>
            )}
        </Stack>
    );
}

export default ResultViewer;