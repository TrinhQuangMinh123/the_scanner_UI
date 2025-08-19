// src/features/dashboard/components/WorkflowBuilderModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    Stack,
    Textarea,
    SegmentedControl,
    Button,
    Grid,
    Text,
    Select,
    Alert,
    Loader,
    Slider
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useIpPoolStore } from '../../../stores/ipPoolStore';
import AvailableScans from './AvailableScans';
import WorkflowSteps from './WorkflowSteps';

function WorkflowBuilderModal({ opened, onClose }) {
    const navigate = useNavigate(); // KHỞI TẠO hook
    const poolIps = useIpPoolStore((state) => state.ips);

    // State lưu trữ dữ liệu form
    const [targets, setTargets] = useState('');
    const [workflow, setWorkflow] = useState([]);
    const [strategy, setStrategy] = useState('deep');
    const [selectedCountry, setSelectedCountry] = useState('AUTO');

    // --- STATE MỚI ---
    const [selectedProfile, setSelectedProfile] = useState(null); // Lưu profile VPN cụ thể được chọn
    const [availableProfiles, setAvailableProfiles] = useState([]); // Lưu danh sách profile của quốc gia đã chọn
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false); // Trạng thái tải cho profile

    // State cho dữ liệu tải từ API
    const [scanTemplates, setScanTemplates] = useState([]);
    const [availableCountries, setAvailableCountries] = useState([]);

    // State quản lý trạng thái giao diện (UX)
    const [isLoadingTools, setIsLoadingTools] = useState(false);
    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [threads, setThreads] = useState(10); // Giá trị mặc định là 10

    useEffect(() => {
        if (opened) {
            const fetchInitialData = async () => {
                // Sửa lại: Dùng đúng các state setter
                setIsLoadingTools(true);
                setIsLoadingCountries(true);
                setError(null);

                try {
                    const [toolsRes, countriesRes] = await Promise.all([
                        fetch('/api/tools'),
                        fetch('/api/vpns/countries')
                    ]);

                    if (!toolsRes.ok) throw new Error('Không thể tải cấu hình các loại scan.');
                    if (!countriesRes.ok) throw new Error('Không thể tải danh sách quốc gia.');

                    const toolsData = await toolsRes.json();
                    const countriesData = await countriesRes.json();

                    // Sửa lại: Truy cập vào key "tools"
                    setScanTemplates(toolsData.tools || []);

                    // Sửa lại: Dùng đúng state setter
                    // Giả sử response là { countries: [{ code, ... }] } theo code của bạn
                    const countryList = countriesData.countries || [];
                    const formattedCountries = countryList.map(country => ({
                        value: country.code,
                        label: country.code
                    }));
                    setAvailableCountries(formattedCountries);

                } catch (e) {
                    setError(e.message);
                } finally {
                    // Sửa lại: Dùng đúng các state setter
                    setIsLoadingTools(false);
                    setIsLoadingCountries(false);
                }
            };
            void fetchInitialData();
        }
    }, [opened]);

    useEffect(() => {
        // Nếu không chọn quốc gia cụ thể, hoặc chọn AUTO, thì reset danh sách profile
        if (!selectedCountry || selectedCountry === 'AUTO') {
            setAvailableProfiles([]);
            setSelectedProfile(null); // Reset luôn lựa chọn profile cũ
            return;
        }

        const fetchProfiles = async () => {
            setIsLoadingProfiles(true);
            try {
                const response = await fetch(`/api/vpns?country=${selectedCountry}`);
                if (!response.ok) throw new Error('Không thể tải danh sách profile VPN.');
                const data = await response.json();
                // 1. Truy cập vào mảng 'vpns' bên trong object data
                const vpnList = data.vpns || [];

                // 2. Map qua mảng vpnList mới
                const formattedProfiles = vpnList.map(p => ({
                    value: p.filename,
                    label: p.hostname // Dùng hostname làm nhãn vì response không có ip riêng
                }));
                setAvailableProfiles(formattedProfiles);
            } catch (error) {
                console.error(error);
                setAvailableProfiles([]);
            } finally {
                setIsLoadingProfiles(false);
            }
        };

        void fetchProfiles();

    }, [selectedCountry]); // Phụ thuộc vào selectedCountry

    // Hàm để nhập danh sách từ IP Pool vào ô targets
    const handleImportFromPool = () => {
        const ipListString = poolIps.map(ip => ip.target).join('\n');
        setTargets(ipListString);
    };

    const handleSubmit = async () => {
        const targetList = targets.split('\n').filter(t => t.trim() !== '');
        if (targetList.length === 0 || workflow.length === 0) {
            notifications.show({
                color: 'orange',
                title: 'Thiếu thông tin',
                message: 'Vui lòng nhập Mục tiêu và thêm ít nhất một bước quét.',
            });
            return;
        }

        setIsSubmitting(true); // Bắt đầu trạng thái "đang gửi"

        const finalWorkflow = {
            targets: targetList,
            strategy,
            country: selectedCountry,
            vpn_profile: selectedProfile,
            threads: threads, // Thêm số luồng vào request
            steps: workflow.map(step => ({ tool_id: step.type, params: step.params })),
        };

        try {
            const response = await fetch('/api/scans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalWorkflow),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Gửi yêu cầu thất bại.');
            }

            const masterJob = await response.json();

            notifications.show({
                color: 'green',
                title: 'Thành công!',
                message: `Đã tạo Job tổng: ${masterJob.master_job_id}`,
                icon: <IconCheck size={18} />,
            });

            onClose();
            navigate(`/jobs/${masterJob.master_job_id}`); // Điều hướng đến trang chi tiết

        } catch (e) {
            notifications.show({
                color: 'red',
                title: 'Thất bại',
                message: e.message,
                icon: <IconAlertCircle size={18} />,
            });
        } finally {
            setIsSubmitting(false); // Kết thúc trạng thái "đang gửi"
        }
    };

    const addScanToWorkflow = (toolName) => {
        // Logic thêm một bước scan mới vào workflow dựa trên toolName
        const newStep = {
            id: `${toolName}-${Date.now()}`,
            type: toolName, // Dùng toolName làm 'type'
            name: toolName, // Và cũng là 'name'
            params: {}, // Khởi tạo params rỗng
        };
        setWorkflow(currentWorkflow => [...currentWorkflow, newStep]);
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
            {/* Form sẽ luôn hiển thị */}
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
                    label="Chọn Quốc gia VPN"
                    placeholder="Chọn một quốc gia"
                    data={availableCountries}
                    value={selectedCountry}
                    onChange={(value) => {
                        setSelectedCountry(value);
                        // Khi đổi quốc gia, reset lựa chọn profile
                        setSelectedProfile(null);
                    }}
                    disabled={isLoadingCountries}
                    rightSection={isLoadingCountries ? <Loader size="xs" /> : null}
                />

                {/* Ô chọn IP/Profile cụ thể (component mới) */}
                {/* Chỉ hiển thị khi một quốc gia được chọn và không phải là AUTO */}
                {(selectedCountry && selectedCountry !== 'AUTO') && (
                        <Select
                            label="Chọn Profile VPN cụ thể (Tùy chọn)"
                            placeholder={isLoadingProfiles ? "Đang tải profile..." : "Mặc định (ngẫu nhiên trong quốc gia)"}
                            data={availableProfiles}
                            value={selectedProfile}
                            onChange={setSelectedProfile}
                            disabled={isLoadingProfiles}
                            rightSection={isLoadingProfiles ? <Loader size="xs" /> : null}
                            clearable
                            mt="md" // Thêm một chút khoảng cách
                        />
                    )}


                <Grid>
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        {/* 5. Truyền trạng thái tải tools xuống component con */}
                        <AvailableScans
                            scanTemplates={scanTemplates}
                            isLoading={isLoadingTools}
                            onAddScan={addScanToWorkflow}
                        />
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

                {/* Hiển thị lỗi chung nếu có */}
                {error && <Alert color="red" title="Lỗi">{error}</Alert>}

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

                <div>
                    <Text fw={500} size="sm">
                        Số luồng đồng thời (Threads): <Text component="span" fw={700}>{threads}</Text>
                    </Text>
                    <Text size="xs" c="dimmed">Tăng số luồng có thể tăng tốc độ quét nhưng tốn nhiều tài nguyên hơn.</Text>
                    <Slider
                        value={threads}
                        onChange={setThreads}
                        min={1}
                        max={100} // Giới hạn tối đa là 100
                        mt="xs"
                    />
                </div>

                    <Button onClick={handleSubmit} loading={isSubmitting} size="md">
                        Bắt đầu Luồng quét
                    </Button>
            </Stack>
        </Modal>
    );
}

export default WorkflowBuilderModal;