// src/features/dashboard/components/WorkflowBuilderModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Stack, Textarea, SegmentedControl, Button, Grid, Text, Select, Alert, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useIpPoolStore } from '../../../stores/ipPoolStore';
import AvailableScans from './AvailableScans';
import WorkflowSteps from './WorkflowSteps';

function WorkflowBuilderModal({ opened, onClose }) {
    const navigate = useNavigate(); // KHỞI TẠO hook
    const poolIps = useIpPoolStore((state) => state.ips);

    // --- State gốc của bạn được giữ nguyên ---
    const [targets, setTargets] = useState('');
    const [workflow, setWorkflow] = useState([]);
    const [strategy, setStrategy] = useState('deep');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null); // Đổi tên state lỗi chung
    const [isLoading, setIsLoading] = useState(false); // State tải dữ liệu ban đầu

    // 3. THÊM MỚI: State để lưu cấu hình scan từ API
    const [scanTemplates, setScanTemplates] = useState([]);

    useEffect(() => {
        if (opened) {
            // Giữ nguyên cấu trúc `useEffect` và `void fetch` của bạn
            const fetchInitialData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    // Gọi song song 2 API để tối ưu tốc độ
                    const [toolsRes, countriesRes] = await Promise.all([
                        fetch('/api/tools'),
                        fetch('/api/vpns/countries')
                    ]);

                    if (!toolsRes.ok) throw new Error('Không thể tải cấu hình các loại scan.');
                    if (!countriesRes.ok) throw new Error('Không thể tải danh sách quốc gia.');

                    const toolsData = await toolsRes.json();
                    const countriesData = await countriesRes.json();

                    // 4. LƯU CẤU HÌNH SCAN ĐỘNG
                    setScanTemplates(toolsData || []);

                    // Xử lý response countries như file của bạn
                    const countryList = countriesData.countries || [];
                    const formattedCountries = countryList.map(country => ({
                        value: country.code,
                        label: country.code
                    }));
                    setCountries(formattedCountries);

                } catch (e) {
                    setError(e.message);
                    console.error("Failed to fetch initial data:", e);
                } finally {
                    setIsLoading(false);
                }
            };
            void fetchInitialData();
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

            const masterJob = await response.json(); // Nhận về job tổng

            // 4. Hiển thị thông báo thành công
            notifications.show({
                title: 'Thành công!',
                message: 'Đã gửi yêu cầu quét thành công.',
                color: 'green',
                icon: <IconCheck size={18} />,
            });

            onClose(); // Đóng modal

            // CHUYỂN HƯỚNG người dùng đến trang chi tiết job
            navigate(`/jobs/${masterJob.master_job_id}`);

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
            {isLoading && <Loader style={{ position: 'absolute', top: '50%', left: '50%' }} />}
            {error && (
                <Alert color="orange" icon={<IconAlertCircle size={16} />}>
                    Không thể tải dữ liệu cần thiết: {error}
                </Alert>
            )}
            {!isLoading && !error && (
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
                    <Select
                        label="Chọn Quốc gia VPN (Tùy chọn)"
                        placeholder="Mặc định (tự động chọn)"
                        data={countries}
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        clearable
                    />
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            {/* 6. Truyền `scanTemplates` từ state vào component con */}
                            <AvailableScans onAddScan={addScanToWorkflow} scanTemplates={scanTemplates} />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <WorkflowSteps
                                steps={workflow}
                                setSteps={setWorkflow}
                                onRemove={removeStep}
                                onParamsChange={handleParamsChange}
                                scanTemplates={scanTemplates} // Truyền cả vào đây để `ScanStep` có thể dùng
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

                    <Button onClick={handleSubmit} loading={isSubmitting} size="md">
                        Bắt đầu Luồng quét
                    </Button>
                </Stack>
            )}
        </Modal>
    );
}

export default WorkflowBuilderModal;