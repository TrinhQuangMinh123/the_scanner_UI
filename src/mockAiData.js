// src/mockAiData.js

/**
 * Kịch bản 1: Phân tích sau khi quét Port Scan.
 * Phát hiện các cổng dịch vụ web và database, đề xuất các tool liên quan.
 */
export const mockAiAnalysisPortscan = {
    analyses: [
        {
            target: "scanme.nmap.org",
            analysis: {
                ai_analysis: "Kết quả quét cổng cho thấy mục tiêu là một máy chủ đa dịch vụ, bao gồm dịch vụ web (HTTP/HTTPS), SSH và có thể cả FTP. Sự hiện diện của các cổng 80 và 443 cho thấy cần ưu tiên kiểm tra các lỗ hổng ứng dụng web. Các bước tiếp theo nên tập trung vào việc định danh công nghệ và tìm kiếm các thư mục/tệp tin nhạy cảm.",
                summary: "Phát hiện 4 port mở: Port 22/tcp - ssh, Port 21/tcp - ftp, Port 80/tcp - http, Port 443/tcp - https.",
                suggested_actions: [
                    {
                        type: "run_tool",
                        tool: "httpx-scan",
                        confidence: 0.9,
                        reason: "AI xác định có dịch vụ web đang chạy, cần định danh công nghệ chi tiết."
                    },
                    {
                        type: "run_tool",
                        tool: "nuclei-scan",
                        confidence: 0.8,
                        reason: "Đề xuất tiêu chuẩn sau khi xác định có dịch vụ web để quét lỗ hổng phổ biến."
                    },
                    {
                        type: "run_tool",
                        tool: "bruteforce-scan",
                        confidence: 0.5,
                        reason: "Phát hiện cổng SSH (22) và FTP (21), có thể thử tấn công dò mật khẩu yếu."
                    }
                ],
                confidence: 0.92
            }
        }
    ]
};

/**
 * Kịch bản 2: Phân tích sau khi quét HTTPX Scan.
 * Phát hiện mục tiêu đang chạy WordPress, đề xuất công cụ chuyên dụng.
 */
export const mockAiAnalysisHttpxWp = {
    analyses: [
        {
            target: "wp-test.com",
            analysis: "Phân tích HTTP cho thấy mục tiêu đang sử dụng WordPress. Đây là một hệ thống quản trị nội dung (CMS) phổ biến với nhiều vector tấn công tiềm tàng liên quan đến plugin, theme và tài khoản người dùng. Cần thực hiện quét chuyên sâu cho WordPress.",
            summary: "Phát hiện 1 HTTP endpoint: http://wp-test.com (200). Technologies: WordPress, PHP, Apache.",
            suggested_actions: [
                {
                    type: "run_tool",
                    tool: "wpscan-scan",
                    confidence: 0.95,
                    reason: "Công cụ chuyên dụng để quét lỗ hổng WordPress, là bước đi hợp lý nhất."
                },
                {
                    type: "run_tool",
                    tool: "dirsearch-scan",
                    confidence: 0.7,
                    reason: "Tìm kiếm các file nhạy cảm hoặc thư mục backup trong cấu trúc của WordPress."
                }
            ],
            confidence: 0.88
        }
    ]
};

/**
 * Kịch bản 3: Phân tích sau khi quét Nuclei.
 * Chỉ tìm thấy các lỗ hổng mức độ thấp, không có đề xuất hành động rõ ràng.
 */
export const mockAiAnalysisNucleiLow = {
    analyses: [
        {
            target: "secure-server.net",
            analysis: "Kết quả từ Nuclei không phát hiện lỗ hổng nghiêm trọng nào. Các phát hiện chủ yếu liên quan đến việc cấu hình chưa tối ưu (ví dụ: thiếu một số security header). Mặc dù không có rủi ro cao, nhưng việc rà soát và củng cố cấu hình vẫn được khuyến nghị. Không có đề xuất chạy công cụ tự động nào tiếp theo.",
            summary: "Nuclei phát hiện 2 lỗ hổng - info: 2. Chi tiết: http-missing-security-headers (info), expose-version (info).",
            suggested_actions: [], // Mảng rỗng để kiểm tra trường hợp không có đề xuất
            confidence: 0.75
        }
    ]
};