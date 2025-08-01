// src/features/dashboard/components/WorkflowBuilderModal.jsx
import React, { useState } from 'react';
import { Modal, Stack, Textarea, SegmentedControl, Button, Grid, Text } from '@mantine/core';
import { scanTemplates } from '../../../scanTemplates'; // Import dữ liệu mẫu quét
import AvailableScans from './AvailableScans';
import WorkflowSteps from './WorkflowSteps';
import { useIpPoolStore } from '../../../stores/ipPoolStore'; // Import store

function WorkflowBuilderModal({ opened, onClose }) {
    // Lấy danh sách IPs từ store toàn cục
    const poolIps = useIpPoolStore((state) => state.ips);

    // State cục bộ cho modal
    const [targets, setTargets] = useState(''); // Thay TextInput bằng Textarea
    const [workflow, setWorkflow] = useState([]);
    const [strategy, setStrategy] = useState('deep');

    // Hàm để nhập danh sách từ IP Pool vào ô targets
    const handleImportFromPool = () => {
        const ipListString = poolIps.map(ip => ip.target).join('\n');
        setTargets(ipListString);
    };

    const handleSubmit = () => {
        // Tách chuỗi targets thành một mảng, loại bỏ các dòng trống
        const targetList = targets.split('\n').filter(t => t.trim() !== '');

        if (targetList.length === 0 || workflow.length === 0) {
            alert('Vui lòng nhập Mục tiêu và thêm ít nhất một bước quét.');
            return;
        }
        const finalWorkflow = {
            targets: targetList, // Gửi đi một mảng các mục tiêu
            strategy,
            steps: workflow,
        };
        console.log("Submitting Workflow:", finalWorkflow);
        onClose();
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