// src/features/dashboard/components/Header.jsx
import React, { useState } from 'react';
import {
    Group, Title, Text, Button, Modal, TextInput, Stack, Select, Switch, MultiSelect
} from '@mantine/core';

// Cập nhật lại cấu trúc dữ liệu của các mẫu quét
const scanTemplates = [
    {
        value: 'nmap',
        label: 'Nmap quét cổng',
        fields: [
            { name: 'allPorts', label: 'Quét toàn bộ 65535 cổng', component: 'Switch', defaultValue: false },
            { name: 'ports', label: 'Hoặc nhập các cổng cụ thể', component: 'TextInput', placeholder: 'vd: 80,443,8080' },
        ],
    },
    {
        value: 'httpx',
        label: 'Httpx thu thập thông tin http',
        fields: [
            { name: 'path', label: 'Đường dẫn cụ thể để kiểm tra', component: 'TextInput', placeholder: 'vd: /login' },
            { name: 'statusCode', label: 'Chỉ hiển thị các status code', component: 'Switch', defaultValue: false },
        ],
    },
    {
        value: 'dnslookup',
        label: 'Dnslookup phân giải tên miền',
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
        value: 'nuclei',
        label: 'Nuclei quét lỗ hổng (vuln)',
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

// Cập nhật hàm render để xử lý logic 'disabled'
const renderFormField = (field, params, handleParamChange) => {
    const commonProps = {
        key: field.name,
        label: field.label,
        placeholder: field.placeholder,
    };

    switch (field.component) {
        case 'TextInput':
            // Thêm logic disable cho Nmap
            const isDisabled = field.name === 'ports' && params.allPorts === true;
            return (
                <TextInput
                    {...commonProps}
                    value={params[field.name] || ''}
                    onChange={(event) => handleParamChange(field.name, event.currentTarget.value)}
                    disabled={isDisabled}
                />
            );
        case 'Switch':
            return (
                <Switch
                    {...commonProps}
                    mt="md"
                    checked={params[field.name] === undefined ? field.defaultValue : params[field.name]}
                    onChange={(event) => {
                        handleParamChange(field.name, event.currentTarget.checked);
                        // Nếu bật 'allPorts', xóa giá trị trong ô 'ports'
                        if (field.name === 'allPorts' && event.currentTarget.checked) {
                            handleParamChange('ports', '');
                        }
                    }}
                />
            );
        case 'Select':
            return (
                <Select
                    {...commonProps}
                    data={field.data}
                    value={params[field.name] || field.defaultValue}
                    onChange={(value) => handleParamChange(field.name, value)}
                />
            );
        // ... MultiSelect và các case khác giữ nguyên
        default:
            return null;
    }
};


function Header() {
    // ... Toàn bộ phần logic state và các hàm xử lý giữ nguyên như trước ...
    // --- BẠN KHÔNG CẦN THAY ĐỔI GÌ Ở PHẦN NÀY ---
    const [opened, setOpened] = useState(false);
    const [formState, setFormState] = useState({ target: '', scanType: null, params: {} });
    const handleFormChange = (field, value) => setFormState(p => ({ ...p, [field]: value }));
    const handleParamChange = (paramName, value) => setFormState(p => ({ ...p, params: { ...p.params, [paramName]: value } }));
    const handleScanTypeChange = (value) => {
        handleFormChange('scanType', value);
        setFormState(p => ({ ...p, params: {} }));
    };
    const handleSubmit = () => {
        if (formState.target && formState.scanType) {
            console.log('Tác vụ mới được tạo:', formState);
            setOpened(false);
            setFormState({ target: '', scanType: null, params: {} });
        } else {
            alert('Vui lòng điền Mục tiêu và chọn Loại Scan.');
        }
    };
    const selectedTemplate = scanTemplates.find(t => t.value === formState.scanType);
    // --- KẾT THÚC PHẦN KHÔNG THAY ĐỔI ---

    return (
        <>
            <Modal opened={opened} onClose={() => setOpened(false)} title="Tạo Tác Vụ Quét Mới" size="md">
                <Stack>
                    <TextInput label="Mục tiêu" required value={formState.target} onChange={(e) => handleFormChange('target', e.currentTarget.value)} />
                    <Select label="Loại Scan" required data={scanTemplates.map(t => ({ value: t.value, label: t.label }))} value={formState.scanType} onChange={handleScanTypeChange} />
                    {selectedTemplate && (
                        <Stack mt="md" p="md" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
                            <Text fw={500} size="sm">Tùy chọn cho: {selectedTemplate.label}</Text>
                            {selectedTemplate.fields.map(field => renderFormField(field, formState.params, handleParamChange))}
                        </Stack>
                    )}
                    <Button onClick={handleSubmit} mt="md">Bắt đầu Scan</Button>
                </Stack>
            </Modal>
            <Group justify="space-between">
                <Title order={1}>The Scanner 📡</Title>
                <Text c="dimmed">Dashboard giám sát và điều khiển</Text>
            </Group>
            <Button onClick={() => setOpened(true)} size="sm" mt="md">+ Tạo Tác Vụ Mới</Button>
        </>
    );
}

export default Header;