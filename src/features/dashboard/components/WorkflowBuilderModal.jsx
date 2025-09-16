// src/features/dashboard/components/WorkflowBuilderModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    Stack,
    Textarea,
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
import { useUiStore } from '../../../stores/uiStore'; // Import uiStore
import { cacheManager } from '../../../utils/cacheManager';
import AvailableScans from './AvailableScans';
import WorkflowSteps from './WorkflowSteps';

const CACHE_DURATION_MINUTES = 15;

function WorkflowBuilderModal({ opened, onClose }) {
    const navigate = useNavigate();
    const poolIps = useIpPoolStore((state) => state.ips);
    // Lấy dữ liệu ban đầu từ store
    const initialWorkflowData = useUiStore((state) => state.initialWorkflowData);

    const [targets, setTargets] = useState('');
    const [workflow, setWorkflow] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('AUTO');

    const [scanTemplates, setScanTemplates] = useState([]);
    const [availableCountries, setAvailableCountries] = useState([]);

    const [isLoadingTools, setIsLoadingTools] = useState(false);
    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (opened) {
            const fetchInitialData = async () => {
                const cachedTools = cacheManager.get('api_tools', CACHE_DURATION_MINUTES);
                const cachedCountries = cacheManager.get('api_vpn_profiles_by_country', CACHE_DURATION_MINUTES);

                if (cachedTools && cachedCountries) {
                    setScanTemplates(cachedTools);
                    setAvailableCountries(cachedCountries);
                    return;
                }

                setIsLoadingTools(true);
                setIsLoadingCountries(true);
                setError(null);

                try {
                    const [toolsRes, profilesRes] = await Promise.all([
                        fetch('/api/tools'),
                        fetch('/api/vpn_profiles')
                    ]);

                    if (!toolsRes.ok) throw new Error('Không thể tải cấu hình các loại scan.');
                    if (!profilesRes.ok) throw new Error('Không thể tải danh sách VPN profiles.');

                    const toolsData = await toolsRes.json();
                    const vpnProfilesData = await profilesRes.json();

                    const countryCounts = vpnProfilesData.reduce((acc, profile) => {
                        const country = profile.country || 'UNKNOWN';
                        acc[country] = (acc[country] || 0) + 1;
                        return acc;
                    }, {});

                    const countries = Object.entries(countryCounts).map(([code, count]) => ({
                        value: code,
                        label: `${code} (${count} VPNs)`
                    }));

                    const countriesWithAuto = [{ value: 'AUTO', label: 'Tự động (Ngẫu nhiên)' }, ...countries];
                    const tools = toolsData.tools || [];

                    setScanTemplates(tools);
                    setAvailableCountries(countriesWithAuto);

                    cacheManager.set('api_tools', tools, CACHE_DURATION_MINUTES);
                    cacheManager.set('api_vpn_profiles_by_country', countriesWithAuto, CACHE_DURATION_MINUTES);

                } catch (e) {
                    setError(e.message);
                } finally {
                    setIsLoadingTools(false);
                    setIsLoadingCountries(false);
                }
            };
            void fetchInitialData();
        }
    }, [opened]);

    // THÊM MỚI: useEffect để điền sẵn dữ liệu từ AI
    useEffect(() => {
        if (opened && initialWorkflowData) {
            setTargets(initialWorkflowData.targets ? initialWorkflowData.targets.join('\n') : '');
            setWorkflow(initialWorkflowData.steps || []);
        } else {
            // Reset form khi modal đóng hoặc không có dữ liệu ban đầu
            setTargets('');
            setWorkflow([]);
        }
    }, [opened, initialWorkflowData]);


    const handleImportFromPool = () => {
        const ipListString = poolIps.map(ip => ip.target).join('\n');
        setTargets(ipListString);
    };

    const handleSubmit = async () => {
        setError(null);
        const targetList = targets.split('\n').filter(t => t.trim() !== '');

        if (targetList.length === 0 || workflow.length === 0) {
            setError('Vui lòng nhập Mục tiêu và thêm ít nhất một bước quét.');
            return;
        }

        setIsSubmitting(true);
        const finalWorkflow = {
            targets: targetList,
            country: selectedCountry,
            // THAY ĐỔI 1: Quay lại sử dụng 'tool_id' như ban đầu
            steps: workflow.map(step => ({ tool_id: step.type, params: step.params })),
        };

        try {
            // THAY ĐỔI 2: Cập nhật đường dẫn API
            const response = await fetch('/api/workflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalWorkflow),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail?.[0]?.msg || errorData.detail || 'Gửi yêu cầu thất bại.';
                throw new Error(errorMessage);
            }

            const masterJob = await response.json();
            notifications.show({
                color: 'green',
                title: 'Thành công!',
                message: `Đã tạo Job tổng: ${masterJob.workflow_id}`,
                icon: <IconCheck size={18} />,
            });

            onClose();
            navigate(`/jobs/${masterJob.workflow_id}`);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addScanToWorkflow = (toolName) => {
        const newStep = {
            id: `${toolName}-${Date.now()}`,
            type: toolName,
            name: toolName,
            params: {},
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
            <Stack gap="xl">
                <div>
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
                    onChange={setSelectedCountry}
                    disabled={isLoadingCountries}
                    rightSection={isLoadingCountries ? <Loader size="xs" /> : null}
                />

                <Grid>
                    <Grid.Col span={{ base: 12, md: 5 }}>
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
                            scanTemplates={scanTemplates}
                        />
                    </Grid.Col>
                </Grid>

                {error && (
                    <Alert
                        variant="light"
                        color="red"
                        title="Lỗi"
                        icon={<IconAlertCircle />}
                        onClose={() => setError(null)}
                        withCloseButton
                    >
                        {error}
                    </Alert>
                )}

                <Button onClick={handleSubmit} loading={isSubmitting} size="md">
                    Bắt đầu Luồng quét
                </Button>
            </Stack>
        </Modal>
    );
}

export default WorkflowBuilderModal;