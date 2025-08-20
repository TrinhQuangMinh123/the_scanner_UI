// src/mockData.js
export const mockJobDetails = {
    workflow: {
        workflow_id: "workflow-488a97f9",
        targets: ["example.com", "github.com"],
        status: "running",
        total_steps: 4,
        completed_steps: 2,
        failed_steps: 1,
        created_at: "2025-08-08T11:00:00Z",
    },
    sub_jobs: [
        {
            job_id: "scan-dns-lookup-95a36b",
            tool: "dns-lookup",
            status: "completed",
            step_order: 1,
            results: [
                { target: "example.com", resolved_ips: ["93.184.216.34"] },
                { target: "github.com", resolved_ips: ["20.205.243.166"] },
            ],
        },
        {
            job_id: "scan-port-scan-f67e2e",
            tool: "port-scan",
            status: "completed",
            step_order: 2,
            results: [
                { ip: "93.184.216.34", port: 80, service: "http" },
                { ip: "93.184.216.34", port: 443, service: "https" },
                { ip: "20.205.243.166", port: 443, service: "https" },
            ],
        },
        {
            job_id: "scan-nuclei-scan-5cb31f",
            tool: "nuclei-scan",
            status: "failed",
            step_order: 3,
            error_message: "Target timed out after 3 retries.",
            results: [],
        },
        {
            job_id: "scan-httpx-scan-f2014b",
            tool: "httpx-scan",
            status: "running",
            step_order: 4,
            results: [],
        },
    ],
    progress: {
        completed: 2,
        total: 4,
        failed: 1,
        percentage: 75.0, // (2 completed + 1 failed) / 4 total
    },
};