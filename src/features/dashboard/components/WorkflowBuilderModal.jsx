// src/features/dashboard/components/WorkflowBuilderModal.jsx
import React, { useState, useEffect } from 'react';
// Thêm Loader vào import
import { Modal, Stack, Textarea, SegmentedControl, Button, Grid, Text, Select, Alert, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useIpPoolStore } from '../../../stores/ipPoolStore';
import AvailableScans from './AvailableScans';
import WorkflowSteps from './WorkflowSteps';
import { scanTemplates } from '../../../scanTemplates';

function WorkflowBuilderModal({ opened, onClose }) {
    const poolIps = useIpPoolStore((state) => state.ips);

    // --- Các State ---
    const [targets, setTargets] = useState('');
    const [workflow, setWorkflow] = useState([]);
    const [strategy, setStrategy] = useState('deep');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countriesError, setCountriesError] = useState(null);

    // 1. State mới để quản lý việc tải danh sách quốc gia
    const [isCountriesLoading, setIsCountriesLoading] = useState(false);

    useEffect(() => {
        if (opened) {
            const fetchCountries = async () => {
                setIsCountriesLoading(true); // Bắt đầu tải
                setCountriesError(null);
                try {
                    const response = await fetch('/api/vpns/countries');
                    if (!response.ok) throw new Error('Không thể kết nối tới server.');

                    const data = await response.json();
                    const countryList = data.countries || [];
                    const formattedCountries = countryList.map(country => ({
                        value: country.code,
                        label: country.code
                    }));
                    setCountries(formattedCountries);
                } catch (error) {
                    setCountriesError(error.message);
                    console.error("Failed to fetch countries:", error);
                } finally {
                    setIsCountriesLoading(false); // Kết thúc tải
                }
            };
            void fetchCountries();
        }
    }, [opened]);

    // Hàm để nhập danh sách từ IP Pool vào ô targets
    const handleImportFromPool = () => {
        const ipListString = poolIps.map(ip => ip.target).join('\n');
        setTargets(ipListString);
    };

    const handleSubmit = async () => {
        const targetList = targets.split('\n').filter(t => t.trim() !== '');
        if (targetList.length === 0 || workflow.length === 0) {
            notifications.show({
                title: 'Thiếu thông tin',
                message: 'Vui lòng nhập Mục tiêu và thêm ít nhất một bước quét.',
                color: 'yellow',
            });
            return;
        }

        setIsSubmitting(true); // Bắt đầu gửi

        const finalWorkflow = {
            targets: targetList,
            strategy,
            country: selectedCountry,
            steps: workflow,
        };

        try {
            const response = await fetch('/api/scans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalWorkflow),
            });

            if (!response.ok) {
                // Lấy thông tin lỗi từ backend nếu có
                const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định từ server.' }));
                throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
            }

            // 4. Hiển thị thông báo thành công
            notifications.show({
                title: 'Thành công!',
                message: 'Đã gửi yêu cầu quét thành công.',
                color: 'green',
                icon: <IconCheck size={18} />,
            });

            onClose(); // Đóng modal

        } catch (error) {
            // 5. Hiển thị thông báo thất bại
            notifications.show({
                title: 'Gửi yêu cầu thất bại',
                message: `Đã có lỗi xảy ra: ${error.message}`,
                color: 'red',
                icon: <IconAlertCircle size={18} />,
            });
        } finally {
            setIsSubmitting(false); // Kết thúc gửi
        }
    };

    const addScanToWorkflow = (scanId) => {
        const scanTemplate = scanTemplates.find(t => t.id === scanId);
        if (scanTemplate) {
            // Thêm một bước mới với ID duy nhất và các tham số mặc định
            const newStep = {
                id: `${scanId}-${Date.now()}`, // ID duy nhất cho mỗi bước
                type: scanId,
                name: scanTemplate.name,
                params: scanTemplate.fields.reduce((acc, field) => {
                    if (field.defaultValue !== undefined) {
                        acc[field.name] = field.defaultValue;
                    }
                    return acc;
                }, {}),
            };
            setWorkflow(currentWorkflow => [...currentWorkflow, newStep]);
        }
    };

    const removeStep = (stepId) => {
        setWorkflow(currentWorkflow => currentWorkflow.filter(step => step.id !== stepId));
    };

    const handleParamsChange = (stepId, paramName, value) => {
        setWorkflow(currentWorkflow =>
            currentWorkflow.map(step =>
                step.id === stepId
                    ? { ...step, params: { ...step.params, [paramName]: value } }
                    : step
            )
        );
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Xây dựng Luồng quét" size="xl">
            <Stack gap="xl">
                <div>
                    {/* Thay TextInput bằng Textarea */}
                    <Textarea
                        label="Mục tiêu"
                        description="Nhập nhiều mục tiêu, mỗi mục tiêu trên một dòng."
                        placeholder="example.com&#10;1.1.1.1&#10;192.168.1.0/24"
                        required
                        autosize
                        minRows={3}
                        value={targets}
                        onChange={(e) => setTargets(e.currentTarget.value)}
                    />
                    {/* Nút mới để liên kết với IP Pool */}
                    <Button
                        variant="light"
                        size="xs"
                        mt="xs"
                        onClick={handleImportFromPool}
                    >
                        Sử dụng danh sách từ IP Pool
                    </Button>
                </div>

                {countriesError ? (
                    <Alert color="orange" icon={<IconAlertCircle size={16} />}>
                        Không thể tải danh sách quốc gia: {countriesError}
                    </Alert>
                ) : (
                    // 2. Cập nhật component Select
                    <Select
                        label="Chọn Quốc gia VPN (Tùy chọn)"
                        placeholder={isCountriesLoading ? "Đang tải danh sách..." : "Mặc định (tự động chọn)"}
                        data={countries}
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        clearable
                        disabled={isCountriesLoading} // Vô hiệu hóa khi đang tải
                        rightSection={isCountriesLoading ? <Loader size="xs" /> : null} // Hiển thị loader
                    />
                )}

                <Grid>
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <AvailableScans onAddScan={addScanToWorkflow} />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <WorkflowSteps
                            steps={workflow}
                            setSteps={setWorkflow}
                            onRemove={removeStep}
                            onParamsChange={handleParamsChange}
                        />
                    </Grid.Col>
                </Grid>

                <div>
                    <Text fw={500} size="sm">Chiến lược quét</Text>
                    <SegmentedControl
                        fullWidth
                        value={strategy}
                        onChange={setStrategy}
                        data={[
                            { label: 'Quét Sâu (Toàn diện từng mục tiêu)', value: 'deep' },
                            { label: 'Quét Rộng (Nhanh trên diện rộng)', value: 'wide' },
                        ]}
                    />
                </div>

                <Button onClick={handleSubmit} size="md">Bắt đầu Luồng quét</Button>
            </Stack>
        </Modal>
    );
}

export default WorkflowBuilderModal;