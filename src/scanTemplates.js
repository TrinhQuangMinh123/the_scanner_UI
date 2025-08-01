// src/scanTemplates.js
export const scanTemplates = [
    {
        id: 'nmap',
        name: 'Nmap quét cổng',
        fields: [
            { name: 'allPorts', label: 'Quét toàn bộ 65535 cổng', component: 'Switch', defaultValue: false },
            { name: 'ports', label: 'Hoặc nhập các cổng cụ thể', component: 'TextInput', placeholder: 'vd: 80,443,8080' },
        ],
    },
    {
        id: 'httpx',
        name: 'Httpx thu thập thông tin http',
        fields: [
            { name: 'path', label: 'Đường dẫn cụ thể để kiểm tra', component: 'TextInput', placeholder: 'vd: /login' },
            { name: 'statusCode', label: 'Chỉ hiển thị các status code', component: 'Switch', defaultValue: false },
        ],
    },
    {
        id: 'dnslookup',
        name: 'Dnslookup phân giải tên miền',
        fields: [
            {
                name: 'recordType',
                label: 'Loại bản ghi',
                component: 'Select',
                defaultValue: 'A',
                data: [
                    { value: 'ANY', label: 'Tất cả các loại phổ biến' },
                    { value: 'A', label: 'A' }, { value: 'AAAA', label: 'AAAA' },
                    { value: 'CNAME', label: 'CNAME' }, { value: 'MX', label: 'MX' },
                    { value: 'NS', label: 'NS' }, { value: 'TXT', label: 'TXT' }
                ]
            },
        ],
    },
    {
        id: 'nuclei',
        name: 'Nuclei quét lỗ hổng (vuln)',
        fields: [
            {
                name: 'severity',
                label: 'Mức độ nghiêm trọng tối thiểu',
                component: 'Select',
                defaultValue: 'high',
                data: ['critical', 'high', 'medium', 'low', 'info']
            },
            {
                name: 'templates',
                label: 'Chạy các mẫu cụ thể',
                component: 'MultiSelect',
                data: ['cves', 'default-logins', 'exposed-panels', 'vulnerabilities'],
                placeholder: 'Để trống nếu muốn chạy tất cả'
            },
        ],
    },
];