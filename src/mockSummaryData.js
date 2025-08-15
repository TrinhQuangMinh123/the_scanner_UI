// src/mockSummaryData.js
export const mockSummaryData = {
    summary_by_target: [
        {
            target: "example.com",
            dns_records: ["93.184.216.34"],
            open_ports: [
                { port: 80, protocol: "tcp", service: "http" },
                { port: 443, protocol: "tcp", service: "https" }
            ],
            web_technologies: ["Nginx", "React"],
            vulnerabilities: [
                { name: "Missing Security Headers", severity: "medium" },
                { name: "SSL/TLS Protocol Version Support", severity: "info" }
            ]
        },
        {
            target: "github.com",
            dns_records: ["20.205.243.166"],
            open_ports: [
                { port: 443, protocol: "tcp", service: "https" }
            ],
            web_technologies: [], // Dữ liệu rỗng
            vulnerabilities: [] // Dữ liệu rỗng
        }
    ]
};